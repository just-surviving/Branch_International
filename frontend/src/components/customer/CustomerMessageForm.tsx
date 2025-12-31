import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader2, History, ArrowLeft, RefreshCw, X, Phone, HelpCircle, Copy, Check } from 'lucide-react';
import { sendCustomerMessage, connectSocket } from '../../services/socketService';
import { getCustomerMessages } from '../../services/api';
import toast from 'react-hot-toast';
import { formatRelativeTime } from '../../utils/formatters';

interface Message {
  id: number;
  content: string;
  direction: 'INBOUND' | 'OUTBOUND';
  timestamp: string;
  urgencyLevel?: string;
  agent?: { name: string };
}

const CustomerMessageForm: React.FC = () => {
  const [formData, setFormData] = useState({
    userId: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [storedUserId, setStoredUserId] = useState<string>('');
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('customer_userId');
    if (saved) {
      setStoredUserId(saved);
      setFormData(prev => ({ ...prev, userId: saved }));
    }

    const socket = connectSocket();

    socket.on('message:sent', (message: Message) => {
      if (showHistory && message.direction === 'OUTBOUND') {
        setMessages(prev => [...prev, message]);
        toast.success('New response received!');
      }
    });

    return () => {
      // Do not disconnect global socket
      socket.off('message:sent');
    };
  }, [showHistory]);

  const fetchMessageHistory = async (userId: string) => {
    setLoadingHistory(true);
    try {
      const data = await getCustomerMessages(userId);
      setMessages(data);
      localStorage.setItem('customer_userId', userId);
      setStoredUserId(userId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Could not load message history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleViewHistory = async () => {
    if (!formData.userId.trim()) {
      toast.error('Please enter your User ID first');
      return;
    }
    await fetchMessageHistory(formData.userId);
    setShowHistory(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);

    try {
      sendCustomerMessage({
        userId: formData.userId.trim(),
        content: formData.message.trim(),
      });

      localStorage.setItem('customer_userId', formData.userId.trim());
      setStoredUserId(formData.userId.trim());

      toast.success('Message sent successfully! Our team will respond shortly.');

      const sentMessage: Message = {
        id: Date.now(),
        content: formData.message.trim(),
        direction: 'INBOUND',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, sentMessage]);

      setFormData(prev => ({ ...prev, message: '' }));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setShowHistory(false)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Messages
            </h1>
            <button
              onClick={() => fetchMessageHistory(storedUserId)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700"
              disabled={loadingHistory}
            >
              <RefreshCw className={`w-5 h-5 ${loadingHistory ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-auto w-full p-4 overflow-y-auto">
          {loadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your conversation history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === 'INBOUND' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${msg.direction === 'INBOUND'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
                      }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className={`flex items-center justify-between mt-1 text-xs ${msg.direction === 'INBOUND' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                      <span>{msg.direction === 'OUTBOUND' && msg.agent ? `${msg.agent.name}` : ''}</span>
                      <span>{formatRelativeTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-3">
            <input
              type="text"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !formData.message.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Branch Customer Support
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Send us a message and our support team will get back to you shortly
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Your User ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Enter your Branch user ID"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={sending}
                  required
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You can find your user ID in the Branch app under Settings
                </p>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your question or issue..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={sending}
                  required
                />
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Be as specific as possible to help us assist you better
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {formData.message.length} characters
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleViewHistory}
                  disabled={!formData.userId.trim()}
                  className="flex-1 py-4 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <History className="w-5 h-5" />
                  View My Messages
                </button>
                <button
                  type="submit"
                  disabled={sending || !formData.userId.trim() || !formData.message.trim()}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Common Questions
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>Average response time: 2-4 hours during business hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>For urgent account issues, please include your account details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>You'll receive a confirmation once your message is received</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need immediate assistance?{' '}
                <button
                  onClick={() => setShowFAQModal(true)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  View our FAQ
                </button>{' '}
                or{' '}
                <button
                  onClick={() => setShowCallModal(true)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  call us
                </button>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 Branch International. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* FAQ Modal */}
      {showFAQModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              </div>
              <button onClick={() => setShowFAQModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              <div className="space-y-4">
                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">How do I check my loan status?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">You can check your loan status in the Branch app under "My Loans" section.</p>
                </div>
                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">When will I receive my loan disbursement?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Approved loans are typically disbursed within 24 hours to your M-Pesa.</p>
                </div>
                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">How do I update my phone number?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Please contact support with your current User ID for phone changes.</p>
                </div>
                <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">What are the business hours?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Mon-Fri, 8:00 AM - 6:00 PM EAT.</p>
                </div>
                <div className="pb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">How do I report unauthorized transactions?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Message us with "URGENT" or call our hotline immediately.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Us Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Call Us</h2>
              </div>
              <button onClick={() => setShowCallModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Our customer support hotline</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">+254 700 999 000</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('+254700999000');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                    toast.success('Number copied!');
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Available Mon-Fri, 8:00 AM - 6:00 PM EAT</p>
              <a
                href="tel:+254700999000"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerMessageForm;
