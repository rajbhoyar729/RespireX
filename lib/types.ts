import { z } from 'zod'

export interface UserHealth {
  userId: string;
  predictions: PredictionRecord[];
  latestPrediction: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PredictionRecord {
  features: Record<string, number>;
  prediction: string;
  timestamp: Date;
}

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100)
})

export const predictionSchema = z.object({
  features: z.record(z.string(), z.number()),
  prediction: z.string()
})

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(1000)
})

export type LoginInput = z.infer<typeof loginSchema>
export type PredictionInput = z.infer<typeof predictionSchema>
export type ChatMessageInput = z.infer<typeof chatMessageSchema>

