import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI; // Ensure this is set in your .env.local file
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// In development mode, use a global variable to preserve the MongoClient instance
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new MongoClient instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;