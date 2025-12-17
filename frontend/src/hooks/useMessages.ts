import { useState, useEffect, useCallback } from 'react';
import type { Conversation, Message } from '../types';
import { getConversations, getConversation } from '../services/api';
import {
  onMessageReceived,
  onMessageSent,
  offMessageReceived,
  offMessageSent,
  onConversationResolved,
} from '../services/socketService';

interface UseMessagesReturn {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  selectConversation: (id: number) => Promise<void>;
  refreshConversations: () => Promise<void>;
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

  // Handle new messages from socket
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      // Update conversations list
      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              messages: [message],
              lastMessageAt: message.timestamp,
              unreadCount: (conv.unreadCount || 0) + 1,
              highestUrgencyScore: Math.max(conv.highestUrgencyScore || 0, message.urgencyScore),
              highestUrgency: message.urgencyScore > (conv.highestUrgencyScore || 0)
                ? message.urgencyLevel
                : conv.highestUrgency,
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
      });

      // Update messages if this is the selected conversation
      if (selectedConversation?.id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      // Refresh to get any new conversations
      fetchConversations();
    };

    const handleSentMessage = (message: Message) => {
      if (selectedConversation?.id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleConversationResolved = ({ conversationId }: { conversationId: number }) => {
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

    onMessageReceived(handleNewMessage);
    onMessageSent(handleSentMessage);
    onConversationResolved(handleConversationResolved);

    return () => {
      offMessageReceived(handleNewMessage);
      offMessageSent(handleSentMessage);
    };
  }, [selectedConversation, fetchConversations]);

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
  };
}

export default useMessages;
