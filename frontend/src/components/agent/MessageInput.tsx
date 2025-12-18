import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { sendReply, sendTyping, sendStoppedTyping } from '../../services/socketService';
import { getStoredAgentId } from '../../services/authService';
import CannedResponseSelector from './CannedResponseSelector';
import toast from 'react-hot-toast';

interface MessageInputProps {
  conversationId: number;
  customerId: number;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  customerId,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(conversationId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendStoppedTyping(conversationId);
    }, 2000);
  };

  const handleSend = async () => {
    if (!message.trim() || disabled) return;

    const agentId = getStoredAgentId();
    if (!agentId) {
      toast.error('Please log in as an agent');
      return;
    }

    try {
      sendReply({
        customerId,
        conversationId,
        content: message.trim(),
      });

      setMessage('');
      setIsTyping(false);
      sendStoppedTyping(conversationId);
      
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCannedResponseSelect = (content: string) => {
    setMessage(content);
    setShowCannedResponses(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      {/* Canned Responses */}
      {showCannedResponses && (
        <div className="mb-4">
          <CannedResponseSelector
            onSelect={handleCannedResponseSelect}
            onClose={() => setShowCannedResponses(false)}
          />
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-3">
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCannedResponses(!showCannedResponses)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Canned responses"
            disabled={disabled}
          >
            <Smile className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Attach file"
            disabled={disabled}
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Conversation is resolved' : 'Type your message...'}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            rows={1}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          <span className="font-medium">Send</span>
        </button>
      </div>

      {/* Character count */}
      <div className="mt-2 text-xs text-gray-400 text-right">
        {message.length} characters
      </div>
    </div>
  );
};

export default MessageInput;
