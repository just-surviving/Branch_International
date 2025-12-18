import React from 'react';
import type { Message } from '../../types';
import { formatTime } from '../../utils/formatters';
import UrgencyBadge from './UrgencyBadge';
import { User, Headphones } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  showUrgency?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showUrgency = false }) => {
  const isInbound = message.direction === 'INBOUND';

  return (
    <div
      className={`flex ${isInbound ? 'justify-start' : 'justify-end'} animate-slide-in`}
    >
      <div className={`flex gap-2 max-w-[75%] ${isInbound ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isInbound ? 'bg-gray-200' : 'bg-blue-600'
          }`}
        >
          {isInbound ? (
            <User className="w-4 h-4 text-gray-600" />
          ) : (
            <Headphones className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message content */}
        <div className="flex flex-col gap-1">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isInbound
                ? 'bg-gray-100 text-gray-900 rounded-tl-sm'
                : 'bg-blue-600 text-white rounded-tr-sm'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          <div
            className={`flex items-center gap-2 text-xs text-gray-500 ${
              isInbound ? 'justify-start' : 'justify-end'
            }`}
          >
            <span>{formatTime(message.timestamp)}</span>
            {isInbound && showUrgency && message.urgencyLevel !== 'LOW' && (
              <UrgencyBadge level={message.urgencyLevel} size="sm" showIcon={false} />
            )}
            {!isInbound && message.agent && (
              <span className="text-gray-400">• {message.agent.name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
