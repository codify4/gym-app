"use client"

import { useState, useEffect, useCallback } from "react"
import {
  fetchConversations,
  fetchConversation,
  createConversation,
  addMessage,
  deleteConversation,
  deleteAllConversations,
  type ChatConversation,
} from "@/lib/chat-history"

export const useChatHistory = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch all conversations
  const fetchAllConversations = useCallback(async () => {
    if (!userId) {
      setConversations([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await fetchConversations(userId)
      setConversations(data)
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Initial fetch
  useEffect(() => {
    fetchAllConversations()
  }, [fetchAllConversations])

  // Refresh conversations
  const onRefresh = useCallback(async () => {
    if (!userId) return

    try {
      setRefreshing(true)
      await fetchAllConversations()
    } finally {
      setRefreshing(false)
    }
  }, [userId, fetchAllConversations])

  // Load a specific conversation
  const loadConversation = useCallback(
    async (conversationId: string) => {
      if (!userId) return null

      try {
        setLoading(true)
        const conversation = await fetchConversation(userId, conversationId)
        if (conversation) {
          setCurrentConversation(conversation)
        } else {
          console.error("Failed to load conversation:", conversationId)
        }
        return conversation
      } catch (error) {
        console.error("Error loading conversation:", error)
        return null
      } finally {
        setLoading(false)
      }
    },
    [userId],
  )

  // Start a new conversation
  const startNewConversation = useCallback(
    async (firstMessage: string) => {
      if (!userId) return null

      try {
        console.log("Creating new conversation with first message:", firstMessage)
        const newConversation = await createConversation(userId, firstMessage)
        if (newConversation) {
          setConversations((prev) => [newConversation, ...prev])
          setCurrentConversation(newConversation)
          return newConversation
        }
        return null
      } catch (error) {
        console.error("Error starting new conversation:", error)
        return null
      }
    },
    [userId],
  )

  // Send a message in the current conversation
  const sendMessage = useCallback(
    async (content: string, role: "user" | "assistant" = "user") => {
      if (!userId || !currentConversation) {
        console.error("Cannot send message: No current conversation or user ID")
        return null
      }

      try {
        const message = await addMessage(userId, currentConversation.conversation_id, role, content)

        if (message) {
          // Update the current conversation with the new message
          setCurrentConversation((prev) => {
            if (!prev) return null
            const updatedMessages = [...(prev.messages || []), message]

            return {
              ...prev,
              messages: updatedMessages,
              updated_at: new Date().toISOString(),
            }
          })

          // Update the conversation in the list
          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.conversation_id === currentConversation.conversation_id) {
                return {
                  ...conv,
                  updated_at: new Date().toISOString(),
                }
              }
              return conv
            }),
          )

          return message
        }
        return null
      } catch (error) {
        console.error("Error sending message:", error)
        return null
      }
    },
    [userId, currentConversation],
  )

  // Delete a conversation
  const deleteChat = useCallback(
    async (conversationId: string) => {
      try {
        const success = await deleteConversation(conversationId)
        if (success) {
          // Remove from conversations list
          setConversations((prev) => prev.filter((conv) => conv.conversation_id !== conversationId))

          // If this was the current conversation, clear it
          if (currentConversation?.conversation_id === conversationId) {
            setCurrentConversation(null)
          }

          return true
        }
        return false
      } catch (error) {
        console.error("Error deleting conversation:", error)
        return false
      }
    },
    [currentConversation],
  )

  // Clear all conversations
  const clearAllChats = useCallback(async () => {
    if (!userId) return false

    try {
      const success = await deleteAllConversations(userId)
      if (success) {
        setConversations([])
        setCurrentConversation(null)
        return true
      }
      return false
    } catch (error) {
      console.error("Error clearing all conversations:", error)
      return false
    }
  }, [userId])

  return {
    conversations,
    currentConversation,
    loading,
    refreshing,
    onRefresh,
    loadConversation,
    startNewConversation,
    sendMessage,
    deleteChat,
    clearAllChats,
    setCurrentConversation,
  }
}