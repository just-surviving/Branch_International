import React, { useEffect, useState } from 'react';
import type { Conversation } from '../../types';
import { getConversations } from '../../services/api';
import { truncateText, formatRelativeTime } from '../../utils/formatters';
import { URGENCY_COLORS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { MessageSquare, Filter } from 'lucide-react';

interface ConversationListProps {
  selectedConversation: Conversation | null;
  onSelectConversation: (conversationId: number) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversation,
  onSelectConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Refresh every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    if (filter === 'unread') return (conv.unreadCount || 0) > 0;
    if (filter === 'critical') return conv.highestUrgency === 'CRITICAL' || conv.highestUrgency === 'HIGH';
    return true;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conversations</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{conversations.length}</span>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {(['all', 'unread', 'critical'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === f
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : 'Urgent'}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <EmptyState type="conversations" />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredConversations.map((conv) => {
              const isSelected = selectedConversation?.id === conv.id;
              const lastMessage = conv.messages?.[0];
              const urgencyColor = URGENCY_COLORS[conv.highestUrgency || 'LOW'];

              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full p-4 text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Urgency indicator */}
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${urgencyColor.dot}`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {conv.customer?.name || `Customer ${conv.customer?.userId}`}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
                          {formatRelativeTime(conv.lastMessageAt)}
                        </span>
                      </div>

                      {lastMessage && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {truncateText(lastMessage.content, 50)}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        {(conv.unreadCount || 0) > 0 && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                        {conv.highestUrgency && conv.highestUrgency !== 'LOW' && (
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${urgencyColor.bg} ${urgencyColor.text}`}
                          >
                            {conv.highestUrgency}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            conv.status === 'OPEN'
                              ? 'bg-blue-100 text-blue-700'
                              : conv.status === 'IN_PROGRESS'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {conv.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
