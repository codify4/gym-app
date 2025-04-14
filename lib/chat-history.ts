import { supabase } from "./supabase"
import type { ChatMessage } from "./gemini-service"

export interface ChatConversation {
  conversation_id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  messages?: ChatMessage[]
}

export interface DbChatMessage extends ChatMessage {
  message_id: string
  conversation_id: string
  user_id: string
  created_at: string
}

export const fetchConversations = async (userId: string | undefined): Promise<ChatConversation[]> => {
  if (!userId) return []

  try {
    // Get all conversations
    const { data: conversations, error: conversationsError } = await supabase
      .from("chat_conversation")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (conversationsError) {
      console.error("Error fetching conversations:", conversationsError)
      return []
    }

    if (!conversations || conversations.length === 0) {
      return []
    }

    // Get all messages for these conversations
    const conversationIds = conversations.map((conversation) => conversation.conversation_id)
    const { data: messages, error: messagesError } = await supabase
      .from("chat_message")
      .select("*")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: true })

    if (messagesError) {
      return conversations
    }

    // Map messages to their respective conversations
    const conversationsWithMessages = conversations.map((conversation) => {
      const conversationMessages =
        messages?.filter((message) => message.conversation_id === conversation.conversation_id) || []

      return {
        ...conversation,
        messages: conversationMessages,
      }
    })

    return conversationsWithMessages
  } catch (error) {
    console.error("Error in fetchConversations:", error)
    return []
  }
}

// Fetch a single conversation with its messages
export const fetchConversation = async (
  userId: string | undefined,
  conversationId: string,
): Promise<ChatConversation | null> => {
  if (!userId) return null

  try {
    // Get the conversation
    const { data: conversation, error: conversationError } = await supabase
      .from("chat_conversation")
      .select("*")
      .eq("user_id", userId)
      .eq("conversation_id", conversationId)
      .single()

    if (conversationError) {
      return null
    }

    if (!conversation) {
      console.log("Conversation not found")
      return null
    }

    // Get all messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from("chat_message")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      return conversation
    }

    // Return conversation with messages
    return {
      ...conversation,
      messages: messages || [],
    }
  } catch (error) {
    console.error("Error in fetchConversation:", error)
    return null
  }
}

// Create a new conversation
export const createConversation = async (
  userId: string | undefined,
  firstMessage: string,
): Promise<ChatConversation | null> => {
  if (!userId) return null

  try {
    // Generate a title from the first message
    const title = generateTitleFromMessage(firstMessage)

    // Create a new conversation
    const { data: conversation, error: conversationError } = await supabase
      .from("chat_conversation")
      .insert([
        {
          user_id: userId,
          title: title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (conversationError) {
      console.error("Error creating conversation:", conversationError)
      return null
    }

    if (!conversation) {
      console.error("No conversation returned after insert")
      return null
    }

    // Add the first message
    const { data: message, error: messageError } = await supabase
      .from("chat_message")
      .insert([
        {
          conversation_id: conversation.conversation_id,
          user_id: userId,
          role: "user",
          content: firstMessage,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (messageError) {
      console.error("Error adding first message:", messageError)
      // We still return the conversation even if message failed
    } else {
      console.log("Added first message with ID:", message?.message_id)
    }

    // Return the conversation with the first message
    return {
      ...conversation,
      messages: message ? [message] : [],
    }
  } catch (error) {
    console.error("Error in createConversation:", error)
    return null
  }
}

// Add a message to a conversation
export const addMessage = async (
  userId: string | undefined,
  conversationId: string,
  role: "user" | "assistant",
  content: string,
): Promise<DbChatMessage | null> => {
  if (!userId) return null

  try {
    // Add the message
    const { data: message, error: messageError } = await supabase
      .from("chat_message")
      .insert([
        {
          conversation_id: conversationId,
          user_id: userId,
          role: role,
          content: content,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (messageError) {
      console.error("Error adding message:", messageError)
      return null
    }

    // Update the conversation's updated_at timestamp
    const { error: updateError } = await supabase
      .from("chat_conversation")
      .update({ updated_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)

    if (updateError) {
      console.error("Error updating conversation timestamp:", updateError)
    }

    return message
  } catch (error) {
    console.error("Error in addMessage:", error)
    return null
  }
}

// Delete a conversation and all its messages
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    // First delete all messages for this conversation
    const { error: messagesError } = await supabase.from("chat_message").delete().eq("conversation_id", conversationId)

    if (messagesError) {
      console.error("Error deleting messages:", messagesError)
      return false
    }

    // Then delete the conversation
    const { error: conversationError } = await supabase
      .from("chat_conversation")
      .delete()
      .eq("conversation_id", conversationId)

    if (conversationError) {
      console.error("Error deleting conversation:", conversationError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteConversation:", error)
    return false
  }
}

// Delete all conversations for a user
export const deleteAllConversations = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) return false

  try {
    // Get all conversation IDs for this user
    const { data: conversations, error: fetchError } = await supabase
      .from("chat_conversation")
      .select("conversation_id")
      .eq("user_id", userId)

    if (fetchError) {
      console.error("Error fetching conversations:", fetchError)
      return false
    }

    if (!conversations || conversations.length === 0) {
      console.log("No conversations to delete")
      return true // No conversations to delete
    }
    const conversationIds = conversations.map((c) => c.conversation_id)
    // Delete all messages for these conversations
    const { error: messagesError } = await supabase.from("chat_message").delete().in("conversation_id", conversationIds)

    if (messagesError) {
      console.error("Error deleting messages:", messagesError)
      return false
    }

    // Delete all conversations
    const { error: conversationsError } = await supabase.from("chat_conversation").delete().eq("user_id", userId)

    if (conversationsError) {
      console.error("Error deleting conversations:", conversationsError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteAllConversations:", error)
    return false
  }
}

// Helper function to generate a title from the first message
const generateTitleFromMessage = (message: string): string => {
  // Truncate to first 30 characters or first sentence, whichever is shorter
  const firstSentence = message.split(/[.!?]/)[0]
  const truncated = firstSentence.length > 30 ? firstSentence.substring(0, 30) + "..." : firstSentence
  return truncated || "New Conversation"
}