import { MongoClient, MongoClientOptions, Db, WithId, Document } from 'mongodb';
import { ObjectId } from 'mongodb';

declare global {
  // Extend the NodeJS.Global type to include _mongoClientPromise
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }

  // Augment the globalThis type
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Use a global variable for the development environment to prevent reinitialization
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  // In production, create a new client for each connection
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

let db: Db;

export async function connectToDatabase(): Promise<void> {
  try {
    const client = await clientPromise; // Await the promise to get the MongoClient instance
    db = client.db();
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw new Error('Unable to connect to the database');
  }
}

// Interface for the predictions array
interface Prediction {
  features: any;
  prediction: any;
  timestamp: Date;
}

// Interface for the user_health document
interface UserHealth {
  _id?: ObjectId;
  userId: string;
  predictions: Prediction[];
  latestPrediction: any;
  updatedAt: Date;
}

export const getUserHealth = async (userId: string): Promise<UserHealth | null> => {
  if (!db) {
    throw new Error('Database connection not initialized. Call connectToDatabase() first.');
  }

  const userHealth: WithId<Document> | null = await db.collection('health').findOne({ userId });
  if (!userHealth) {
    return null;
  }
  return userHealth as UserHealth;
};
