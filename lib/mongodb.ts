import { MongoClient, MongoClientOptions } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 60000,
  retryWrites: true,
  retryReads: true,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
<<<<<<< HEAD
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
=======
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

<<<<<<< HEAD
=======
// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
export default clientPromise

export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db()
    return { client, db }
  } catch (error) {
<<<<<<< HEAD
    console.error('Database connection error:', error)
=======
    console.error('Failed to connect to the database', error)
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
    throw new Error('Unable to connect to the database')
  }
}

