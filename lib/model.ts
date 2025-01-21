import { Db, Collection } from 'mongodb';
import clientPromise from './mongodb';
import { User, userSchema } from './schema';

// Helper function to get the database instance
const getDb = async (): Promise<Db> => {
  const client = await clientPromise;
  return client.db('your_database_name'); // Replace with your database name
};

// User Model
export const getUserCollection = async (): Promise<Collection<User>> => {
  const db = await getDb();
  return db.collection<User>('users');
};

// Ensure a category exists in the user document
const ensureCategoryExists = async (email: string, category: keyof User) => {
  const usersCollection = await getUserCollection();
  const user = await usersCollection.findOne({ 'loginInfo.email': email });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user[category]) {
    await usersCollection.updateOne(
      { 'loginInfo.email': email },
      { $set: { [category]: {} } }
    );
  }
};

// Find a user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const usersCollection = await getUserCollection();
  return usersCollection.findOne({ 'loginInfo.email': email });
};

// Create a new user with profile and login info
export const createUser = async (userData: {
  profile: { username: string; userId: string; email: string };
  loginInfo: { userId: string; email: string; password: string };
}): Promise<void> => {
  const usersCollection = await getUserCollection();
  await usersCollection.insertOne({
    ...userData,
    sessionInfo: {
      userId: userData.profile.userId,
      loginCount: 0,
      lastLogin: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

// Update user profile
export const updateUserProfile = async (
  email: string,
  profile: { username: string; userId: string; email: string }
): Promise<void> => {
  const usersCollection = await getUserCollection();
  await usersCollection.updateOne(
    { 'loginInfo.email': email },
    { $set: { profile } }
  );
};

// Update login info
export const updateLoginInfo = async (
  email: string,
  loginInfo: { userId: string; email: string; password: string }
): Promise<void> => {
  const usersCollection = await getUserCollection();
  await usersCollection.updateOne(
    { 'loginInfo.email': email },
    { $set: { loginInfo } }
  );
};

// Add audio data to a user's record
export const addAudioData = async (
  email: string,
  audioData: { audioFile: string; timestamp: Date }
): Promise<void> => {
  const usersCollection = await getUserCollection();
  await ensureCategoryExists(email, 'audioData');

  await usersCollection.updateOne(
    { 'loginInfo.email': email },
    { $push: { audioData: audioData } }
  );
};

// Add disease detection data to a user's record
export const addDiseaseDetection = async (
  email: string,
  detectionData: {
    diseaseDetected: string;
    category: string;
    timeOfDetection: Date;
    date: Date;
  }
): Promise<void> => {
  const usersCollection = await getUserCollection();
  await ensureCategoryExists(email, 'diseaseDetections');

  await usersCollection.updateOne(
    { 'loginInfo.email': email },
    { $push: { diseaseDetections: detectionData } }
  );
};

// Update session info (e.g., login count and last login)
export const updateSessionInfo = async (email: string): Promise<void> => {
  const usersCollection = await getUserCollection();
  await ensureCategoryExists(email, 'sessionInfo');

  await usersCollection.updateOne(
    { 'loginInfo.email': email },
    {
      $set: { 'sessionInfo.lastLogin': new Date() },
      $inc: { 'sessionInfo.loginCount': 1 },
    }
  );
};