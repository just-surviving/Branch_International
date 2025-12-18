import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import CustomerInfoPanel from './CustomerInfoPanel';
import SearchBar from './SearchBar';
import { useMessages } from '../../hooks/useMessages';
import { getCustomers } from '../../services/api';
import type { Customer } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

const AgentDashboard: React.FC = () => {
  const { conversations, selectedConversation, messages, loading, selectConversation } = useMessages();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('conversationSidebarWidth');
    return saved ? parseInt(saved, 10) : 320;
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    localStorage.setItem('conversationSidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const currentCustomer = customers.find(
    (c) => c.id === selectedConversation?.customerId
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= 280 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <SearchBar onSelectConversation={selectConversation} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Conversation List */}
        <div 
          ref={sidebarRef}
          className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col relative"
          style={{ width: `${sidebarWidth}px` }}
        >
          <ConversationList
            selectedConversation={selectedConversation}
            onSelectConversation={selectConversation}
          />
          
          {/* Resize Handle */}
          <div
            onMouseDown={handleMouseDown}
            className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors ${
              isResizing ? 'bg-blue-500 dark:bg-blue-400' : 'bg-transparent'
            }`}
            style={{ zIndex: 10 }}
          >
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-12 -mr-1.5" />
          </div>
        </div>

        {/* Center - Message Thread */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <MessageThread
              conversation={selectedConversation}
              messages={messages}
              loading={loading}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Customer Info */}
        {selectedConversation && currentCustomer && (
          <CustomerInfoPanel
            customer={currentCustomer}
            conversation={selectedConversation}
          />
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
