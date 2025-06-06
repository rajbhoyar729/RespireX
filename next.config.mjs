/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables React's strict mode for better error handling and warnings.
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app"], // Restricts server actions to specific origins.
    },
  },
  images: {
    domains: ['placeholder.svg'], // Specifies allowed image domains for Next.js Image Optimization.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*', // Matches all routes, including API routes.
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store', // Disables caching for all routes.
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Resolve fallbacks for missing modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false, // Disable punycode polyfill if not needed.
      fs: false, // Exclude Node.js `fs` module as it's not available in the browser.
      path: false, // Exclude Node.js `path` module for similar reasons.
      os: false, // Exclude Node.js `os` module.
    };

    // Exclude problematic HTML file from `@mapbox/node-pre-gyp`
    config.module.rules.push({
      test: /\.html$/, // Match HTML files.
      exclude: /node_modules\/@mapbox\/node-pre-gyp\/lib\/util\/nw-pre-gyp\/index\.html/, // Exclude the problematic file.
      use: ['html-loader'], // Use `html-loader` to process HTML files.
    });

    // Add support for native modules (if needed)
    if (!isServer) {
      config.externals.push('mock-aws-s3'); // Exclude `mock-aws-s3` from client-side bundles.
    }

    return config;
  },
};

export default nextConfig;