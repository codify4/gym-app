import { GoogleGenAI } from "@google/genai"

// Define types for our chat messages
export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

// The fitness-focused system prompt with instruction to avoid markdown formatting
const SYSTEM_PROMPT = `You are Mate, an AI fitness assistant in the Workout Mate app. 
Your purpose is to help users with their fitness journey by providing:
- Workout routines and exercise recommendations
- Form and technique guidance for exercises
- Nutrition advice related to fitness goals
- Recovery and rest day suggestions
- Motivation and accountability support
- Answers to common fitness questions

IMPORTANT: DO NOT use any markdown formatting like **, *, _, ~, #, etc. in your responses. 
Use plain text only. Do not use bullet points with * or - symbols.

Keep your responses concise, practical, and evidence-based. When suggesting exercises, 
always mention proper form to prevent injuries. For nutrition questions, focus on 
balanced approaches rather than extreme diets. If asked about medical conditions, 
remind users to consult healthcare professionals.

Always maintain a supportive, encouraging tone. Use fitness terminology appropriately 
but explain concepts for beginners when needed.`

// Function to send a message and get a response
export const sendMessage = async (message: string): Promise<string> => {
  try {
    // Get API key from environment
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY

    if (!apiKey) {
      console.error("Gemini API key is missing")
      return "Sorry, there's a configuration issue. Please check your API key."
    }

    // Create a new instance of the AI with the API key
    const ai = new GoogleGenAI({ apiKey })

    // Create a new chat session
    const chat = ai.chats.create({
      model: "gemini-2.0-flash-lite",
    })

    // First, send the system prompt as a user message to set context
    await chat.sendMessage({
      message: `${SYSTEM_PROMPT}\n\nPlease respond to all future messages as if you are Mate, the fitness assistant. Remember to use plain text only, no markdown formatting.`,
    })

    // Then send the actual user message
    const result = await chat.sendMessage({
      message,
    })

    // Check if we have a response
    if (!result) {
      console.error("Empty response from Gemini API")
      return "Sorry, I didn't receive a proper response. Please try again."
    }

    // Get the text content from the result and handle potential undefined
    const responseText = result.text

    // Return the response text or a fallback message if it's undefined
    return (
      responseText ||
      "I understand your question, but I'm having trouble formulating a response. Could you try rephrasing?"
    )
  } catch (error) {
    // Log detailed error information
    console.error("Error sending message to Gemini:", error)

    // Provide a more specific error message if possible
    if (error instanceof Error) {
      console.error("Error details:", error.message)

      if (error.message.includes("API key")) {
        return "Sorry, there's an issue with the API key configuration."
      }

      if (error.message.includes("network")) {
        return "Sorry, there seems to be a network issue. Please check your connection."
      }
    }

    return "Sorry, I encountered an error. Please try again."
  }
}