import { MongoClient, MongoClientOptions } from 'mongodb'
import { ObjectId } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options: MongoClientOptions = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db()
    return { client, db }
  } catch (error) {
    console.error('Failed to connect to the database:', error)
    throw new Error('Unable to connect to the database')
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
