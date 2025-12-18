import React from 'react';
import { Inbox, MessageSquare, Search } from 'lucide-react';

interface EmptyStateProps {
  type?: 'messages' | 'conversations' | 'search';
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'messages',
  title,
  description,
}) => {
  const icons = {
    messages: MessageSquare,
    conversations: Inbox,
    search: Search,
  };

  const defaults = {
    messages: {
      title: 'No messages',
      description: 'When customers send messages, they will appear here.',
    },
    conversations: {
      title: 'No conversations',
      description: 'Select a conversation from the list to view messages.',
    },
    search: {
      title: 'No results found',
      description: 'Try adjusting your search terms or filters.',
    },
  };

  const Icon = icons[type];
  const displayTitle = title || defaults[type].title;
  const displayDescription = description || defaults[type].description;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{displayTitle}</h3>
      <p className="text-sm text-gray-500 max-w-sm">{displayDescription}</p>
    </div>
  );
};

export default EmptyState;
