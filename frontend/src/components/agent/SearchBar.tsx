import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import type { Conversation } from '../../types';
import { truncateText, formatRelativeTime } from '../../utils/formatters';
import UrgencyBadge from '../common/UrgencyBadge';
import LoadingSpinner from '../common/LoadingSpinner';

interface SearchBarProps {
  onSelectConversation?: (conversationId: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectConversation }) => {
  const { query, setQuery, results, loading, performSearch, clearSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleClear = () => {
    clearSearch();
    setIsOpen(false);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    onSelectConversation?.(conversation.id);
    handleClear();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search messages, customers..."
          className="w-64 pl-10 pr-10 py-2 text-sm bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 flex justify-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : results ? (
            <div>
              {results.totalResults === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No results found
                </div>
              ) : (
                <>
                  {/* Messages */}
                  {results.messages.length > 0 && (
                    <div className="p-2">
                      <p className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                        Messages ({results.messages.length})
                      </p>
                      {results.messages.slice(0, 5).map((message) => (
                        <button
                          key={message.id}
                          className="w-full p-2 text-left hover:bg-gray-50 rounded-lg"
                          onClick={() => {
                            if (message.conversation) {
                              handleSelectConversation(message.conversation);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {message.customer?.name || 'Unknown'}
                            </span>
                            <UrgencyBadge level={message.urgencyLevel} size="sm" showIcon={false} />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {truncateText(message.content, 60)}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Conversations */}
                  {results.conversations.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <p className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                        Conversations ({results.conversations.length})
                      </p>
                      {results.conversations.slice(0, 5).map((conv) => (
                        <button
                          key={conv.id}
                          className="w-full p-2 text-left hover:bg-gray-50 rounded-lg"
                          onClick={() => handleSelectConversation(conv)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {conv.customer?.name || 'Unknown'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatRelativeTime(conv.lastMessageAt)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Customers */}
                  {results.customers.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <p className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                        Customers ({results.customers.length})
                      </p>
                      {results.customers.slice(0, 5).map((customer) => (
                        <div
                          key={customer.id}
                          className="p-2 hover:bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </span>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && query && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
