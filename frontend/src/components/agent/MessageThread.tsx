import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, Message } from '../../types';
import MessageBubble from '../common/MessageBubble';
import MessageInput from './MessageInput';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { getConversation } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { CheckCircle, RotateCcw } from 'lucide-react';

interface MessageThreadProps {
  conversation: Conversation;
  onResolve?: (conversationId: number) => void;
  onReopen?: (conversationId: number) => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({ conversation, onResolve, onReopen }) => {
  const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadConversation = async () => {
      try {
        setLoading(true);
        const conv = await getConversation(conversation.id);
        setMessages(conv.messages || []);
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = import('../../services/socketService').then(({ connectSocket }) => {
      const socket = connectSocket();

      const handleNewMessage = (message: Message) => {
        console.log('MessageThread received message:', message, 'Current Conv ID:', conversation.id);
        // Loose comparison or explicit number conversion to handle potential type mismatches
        if (Number(message.conversationId) === Number(conversation.id)) {
          setMessages((prev) => {
            if (prev.some(m => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      };

      const handleSentMessage = (message: Message) => {
        if (Number(message.conversationId) === Number(conversation.id)) {
          setMessages((prev) => {
            if (prev.some(m => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      };

      socket.on('message:received', handleNewMessage);
      socket.on('message:sent', handleSentMessage);

      // Cleanup
      return () => {
        socket.off('message:received', handleNewMessage);
        socket.off('message:sent', handleSentMessage);
      };
    });

    return () => {
      socket.then((cleanup) => cleanup && cleanup());
    };
  }, [conversation.id]);

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {conversation.customer?.name || 'Unknown Customer'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              User ID: {conversation.customer?.userId}
            </p>
          </div>
          {conversation.status !== 'RESOLVED' && (
            <button
              onClick={() => onResolve?.(conversation.id)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Resolved
            </button>
          )}
          {conversation.status === 'RESOLVED' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                Resolved
              </div>
              <button
                onClick={() => onReopen?.(conversation.id)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reopen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {Object.keys(messageGroups).length === 0 ? (
          <EmptyState type="messages" />
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              {/* Date divider */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                  {date}
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-3">
                {msgs.map((message) => (
                  <MessageBubble key={message.id} message={message} showUrgency />
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        conversationId={conversation.id}
        customerId={conversation.customerId}
        disabled={conversation.status === 'RESOLVED'}
      />
    </div>
  );
};

export default MessageThread;
