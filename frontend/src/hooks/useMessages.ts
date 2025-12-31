import { useState, useEffect, useCallback } from 'react';
import type { Conversation, Message } from '../types';
import { getConversations, getConversation } from '../services/api';
import { connectSocket } from '../services/socketService';

interface UseMessagesReturn {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  selectConversation: (id: number) => Promise<void>;
  refreshConversations: () => Promise<void>;
  updateConversationPriority: (conversationId: number, priority: string) => void;
}

export function useMessages(): UseMessagesReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectConversation = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const conv = await getConversation(id);
      setSelectedConversation(conv);
      setMessages(conv.messages || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshConversations = useCallback(async () => {
    await fetchConversations();
  }, [fetchConversations]);

  const updateConversationPriority = useCallback((conversationId: number, priority: string) => {
    // Update local state immediately
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, highestUrgency: priority as any }
          : conv
      )
    );

    if (selectedConversation?.id === conversationId) {
      setSelectedConversation((prev) =>
        prev ? { ...prev, highestUrgency: priority as any } : null
      );
    }

    // Emit to server
    const socket = connectSocket();
    socket.emit('conversation:update-priority', { conversationId, priority });
  }, [selectedConversation]);

  // Handle socket events
  useEffect(() => {
    const socket = connectSocket();

    const handleNewMessage = (message: Message) => {
      console.log('Received new message:', message);

      // Update conversations list
      setConversations((prev) => {
        // Check if conversation exists
        const existingConv = prev.find(c => c.id === message.conversationId);

        if (existingConv) {
          const updated = prev.map((conv) => {
            if (conv.id === message.conversationId) {
              return {
                ...conv,
                messages: [message],
                lastMessageAt: message.timestamp,
                unreadCount: (conv.unreadCount || 0) + 1,
                status: 'OPEN' as const, // Reopen if new message
              };
            }
            return conv;
          });

          // Re-sort by urgency and last message
          return updated.sort((a, b) => {
            if ((b.highestUrgencyScore || 0) !== (a.highestUrgencyScore || 0)) {
              return (b.highestUrgencyScore || 0) - (a.highestUrgencyScore || 0);
            }
            return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
          });
        } else {
          // New conversation - refresh to get it
          fetchConversations();
          return prev;
        }
      });

      // Update messages if this is the selected conversation
      if (selectedConversation?.id === message.conversationId) {
        setMessages((prev) => {
          // Check if message already exists to avoid duplicates
          if (prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    };

    const handleSentMessage = (message: Message) => {
      console.log('Message sent:', message);
      if (selectedConversation?.id === message.conversationId) {
        setMessages((prev) => {
          if (prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    };

    const handleConversationResolved = ({ conversationId }: { conversationId: number }) => {
      console.log('Conversation resolved:', conversationId);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, status: 'RESOLVED' as const }
            : conv
        )
      );

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation((prev) =>
          prev ? { ...prev, status: 'RESOLVED' as const } : null
        );
      }
    };

    const handleConversationReopened = ({ conversationId }: { conversationId: number }) => {
      console.log('Conversation reopened:', conversationId);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, status: 'OPEN' as const, resolvedAt: null }
            : conv
        )
      );

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation((prev) =>
          prev ? { ...prev, status: 'OPEN' as const, resolvedAt: null } : null
        );
        // Reload conversation to get fresh data
        selectConversation(conversationId);
      }
    };

    socket.on('message:received', handleNewMessage);
    socket.on('message:sent', handleSentMessage);
    socket.on('conversation:resolved', handleConversationResolved);
    socket.on('conversation:reopened', handleConversationReopened);

    return () => {
      socket.off('message:received', handleNewMessage);
      socket.off('message:sent', handleSentMessage);
      socket.off('conversation:resolved', handleConversationResolved);
      socket.off('conversation:reopened', handleConversationReopened);
    };
  }, [selectedConversation, fetchConversations, selectConversation]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    selectedConversation,
    messages,
    loading,
    error,
    selectConversation,
    refreshConversations,
    updateConversationPriority,
  };
}

export default useMessages;
