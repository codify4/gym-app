import { supabase } from "./supabase"
import type { ChatMessage } from "./gemini-service"

// Define types for our chat history
export interface ChatConversation {
  conversation_id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  messages?: ChatMessage[]
}

// Define types for database message
export interface DbChatMessage extends ChatMessage {
  message_id: string
  conversation_id: string
  user_id: string
  created_at: string
}

// Fetch all conversations for a user
export const fetchConversations = async (userId: string | undefined): Promise<ChatConversation[]> => {
  if (!userId) return []

  try {
    console.log("Fetching conversations for user:", userId)

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
      console.log("No conversations found for user")
      return []
    }

    console.log("Found", conversations.length, "conversations")

    // Get all messages for these conversations
    const conversationIds = conversations.map((conversation) => conversation.conversation_id)
    const { data: messages, error: messagesError } = await supabase
      .from("chat_message")
      .select("*")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      return conversations
    }

    console.log("Found", messages?.length || 0, "total messages across all conversations")

    // Map messages to their respective conversations
    const conversationsWithMessages = conversations.map((conversation) => {
      const conversationMessages =
        messages?.filter((message) => message.conversation_id === conversation.conversation_id) || []
      console.log("Conversation", conversation.conversation_id, "has", conversationMessages.length, "messages")

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
    console.log("Fetching conversation:", conversationId, "for user:", userId)

    // Get the conversation
    const { data: conversation, error: conversationError } = await supabase
      .from("chat_conversation")
      .select("*")
      .eq("user_id", userId)
      .eq("conversation_id", conversationId)
      .single()

    if (conversationError) {
      console.error("Error fetching conversation:", conversationError)
      return null
    }

    if (!conversation) {
      console.log("Conversation not found")
      return null
    }

    console.log("Found conversation:", conversation.title)

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

    console.log("Found", messages?.length || 0, "messages for conversation")

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
    console.log("Creating new conversation for user:", userId)

    // Generate a title from the first message
    const title = generateTitleFromMessage(firstMessage)
    console.log("Generated title:", title)

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

    console.log("Created conversation with ID:", conversation.conversation_id)

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
    console.log("Adding message to conversation:", conversationId, "Role:", role)

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

    console.log("Added message with ID:", message?.message_id)

    // Update the conversation's updated_at timestamp
    const { error: updateError } = await supabase
      .from("chat_conversation")
      .update({ updated_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)

    if (updateError) {
      console.error("Error updating conversation timestamp:", updateError)
    } else {
      console.log("Updated conversation timestamp")
    }

    return message
  } catch (error) {
    console.error("Error in addMessage:", error)
    return null
  }
}

// Update a conversation's title
export const updateConversationTitle = async (conversationId: string, title: string): Promise<boolean> => {
  try {
    console.log("Updating conversation title:", conversationId, "New title:", title)

    const { error } = await supabase
      .from("chat_conversation")
      .update({ title: title, updated_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)

    if (error) {
      console.error("Error updating conversation title:", error)
      return false
    }

    console.log("Updated conversation title successfully")
    return true
  } catch (error) {
    console.error("Error in updateConversationTitle:", error)
    return false
  }
}

// Delete a conversation and all its messages
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    console.log("Deleting conversation:", conversationId)

    // First delete all messages for this conversation
    const { error: messagesError } = await supabase.from("chat_message").delete().eq("conversation_id", conversationId)

    if (messagesError) {
      console.error("Error deleting messages:", messagesError)
      return false
    }

    console.log("Deleted all messages for conversation")

    // Then delete the conversation
    const { error: conversationError } = await supabase
      .from("chat_conversation")
      .delete()
      .eq("conversation_id", conversationId)

    if (conversationError) {
      console.error("Error deleting conversation:", conversationError)
      return false
    }

    console.log("Deleted conversation successfully")
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
    console.log("Deleting all conversations for user:", userId)

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

    console.log("Found", conversations.length, "conversations to delete")
    const conversationIds = conversations.map((c) => c.conversation_id)

    // Delete all messages for these conversations
    const { error: messagesError } = await supabase.from("chat_message").delete().in("conversation_id", conversationIds)

    if (messagesError) {
      console.error("Error deleting messages:", messagesError)
      return false
    }

    console.log("Deleted all messages for all conversations")

    // Delete all conversations
    const { error: conversationsError } = await supabase.from("chat_conversation").delete().eq("user_id", userId)

    if (conversationsError) {
      console.error("Error deleting conversations:", conversationsError)
      return false
    }

    console.log("Deleted all conversations successfully")
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