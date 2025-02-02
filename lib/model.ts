import { Db, Collection } from 'mongodb';
import clientPromise from './mongodb';
import { User, userSchema } from './schema';
import { AudioData, audioDataSchema } from './schema';
import { DiseaseDetection, diseaseDetectionSchema } from './schema';
import { ChatHistory, chatHistorySchema } from './schema';

// Helper function to get the database instance
const getDb = async (): Promise<Db> => {
  const client = await clientPromise;
  return client.db('RespireX'); // Replace with your database name
};

// User Collection
export const getUserCollection = async (): Promise<Collection<User>> => {
  const db = await getDb();
  return db.collection<User>('User');
};

// AudioData Collection
export const getAudioDataCollection = async (): Promise<Collection<AudioData>> => {
  const db = await getDb();
  return db.collection<AudioData>('AudioData');
};

// DiseaseDetection Collection
export const getDiseaseDetectionCollection = async (): Promise<Collection<DiseaseDetection>> => {
  const db = await getDb();
  return db.collection<DiseaseDetection>('DiseaseDetection');
};

// ChatHistory Collection
export const getChatHistoryCollection = async (): Promise<Collection<ChatHistory>> => {
  const db = await getDb();
  return db.collection<ChatHistory>('ChatHistory');
};

// Find a user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const usersCollection = await getUserCollection();
  return usersCollection.findOne({ 'loginInfo.email': email });
};

// Create a new user
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

// Add audio data to the AudioData collection
export const addAudioData = async (
  userId: string,
  audioData: { audioFile: string; timestamp: Date }
): Promise<void> => {
  const audioDataCollection = await getAudioDataCollection();
  await audioDataCollection.insertOne({
    userId,
    ...audioData,
  });
};

// Add disease detection data to the DiseaseDetection collection
export const addDiseaseDetection = async (
  userId: string,
  detectionData: {
    diseaseDetected: string;
    category: string;
    timeOfDetection: Date;
    date: Date;
  }
): Promise<void> => {
  const diseaseDetectionCollection = await getDiseaseDetectionCollection();
  await diseaseDetectionCollection.insertOne({
    userId,
    ...detectionData,
  });
};

// Add chat history data to the ChatHistory collection
export const addChatHistory = async (
  userId: string,
  chatData: {
    disease: string;
    messages: { sender: 'user' | 'ai'; message: string; timestamp: Date }[];
  }
): Promise<void> => {
  const chatHistoryCollection = await getChatHistoryCollection();
  await chatHistoryCollection.insertOne({
    userId,
    ...chatData,
  });
};

// Update session info (e.g., login count and last login)
export const updateSessionInfo = async (email: string): Promise<void> => {
  const usersCollection = await getUserCollection();
  await usersCollection.updateOne(
    { 'loginInfo.email': email },
    {
      $set: { 'sessionInfo.lastLogin': new Date() },
      $inc: { 'sessionInfo.loginCount': 1 },
    }
  );
};

// Get all audio data for a user
export const getAudioDataByUserId = async (userId: string): Promise<AudioData[]> => {
  const audioDataCollection = await getAudioDataCollection();
  return audioDataCollection.find({ userId }).toArray();
};

// Get all disease detections for a user
export const getDiseaseDetectionsByUserId = async (userId: string): Promise<DiseaseDetection[]> => {
  const diseaseDetectionCollection = await getDiseaseDetectionCollection();
  return diseaseDetectionCollection.find({ userId }).toArray();
};

// Get all chat history for a user
export const getChatHistoryByUserId = async (userId: string): Promise<ChatHistory[]> => {
  const chatHistoryCollection = await getChatHistoryCollection();
  return chatHistoryCollection.find({ userId }).toArray();
};