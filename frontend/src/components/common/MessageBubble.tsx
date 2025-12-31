import React from 'react';
import type { Message } from '../../types';
import { formatTime } from '../../utils/formatters';
import { User, Headphones, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  showUrgency?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isInbound = message.direction === 'INBOUND';

  return (
    <div
      className={`flex ${isInbound ? 'justify-start' : 'justify-end'} animate-slide-in mb-1`}
    >
      <div className={`flex gap-2 max-w-[75%] ${isInbound ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center avatar-animated ${isInbound
            ? 'bg-gray-300 dark:bg-gray-600'
            : 'bg-wa-green'
            }`}
        >
          {isInbound ? (
            <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          ) : (
            <Headphones className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message content */}
        <div className="flex flex-col gap-0.5">
          <div className="relative">
            <div
              className={`px-3 py-2 shadow-sm ${isInbound
                ? 'message-inbound'
                : 'message-outbound'
                }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

              {/* Timestamp and status inside bubble - WhatsApp style */}
              <div className={`flex items-center gap-1 mt-1 ${isInbound ? 'justify-start' : 'justify-end'}`}>
                <span className={`text-[10px] ${isInbound ? 'text-gray-500 dark:text-gray-400' : 'text-green-200 dark:text-green-300'}`}>
                  {formatTime(message.timestamp)}
                </span>
                {!isInbound && (
                  <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                )}
              </div>
            </div>
          </div>

          {/* Agent name for outbound */}
          {!isInbound && message.agent && (
            <span className={`text-[10px] text-gray-400 dark:text-gray-500 ${isInbound ? 'text-left' : 'text-right'}`}>
              {message.agent.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
