import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages,
    system: `You are Mate, a helpful fitness and workout assistant. You provide advice on:
    - Workout routines and exercises
    - Nutrition and diet planning
    - Fitness goals and motivation
    - Exercise form and technique
    - Recovery and rest
    
    Keep your responses helpful, encouraging, and focused on fitness and health topics.`,
  })

  return result.toDataStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
  })
}
