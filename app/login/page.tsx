'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      if (result?.ok) {
        toast({
          title: 'Success',
          description: 'Login successful!',
        });
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mt-12 mb-12">
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary dark:text-white">
              Log in to RespireX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="mt-1 block w-full"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="mt-1 block w-full"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>

              {/* Register Link */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}