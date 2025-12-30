import React, { useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { sendCustomerMessage } from '../../services/socketService';
import toast from 'react-hot-toast';

const CustomerMessageForm: React.FC = () => {
  const [formData, setFormData] = useState({
    userId: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

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

      toast.success('Message sent successfully! Our team will respond shortly.');
      setFormData({ userId: '', message: '' });

      // Navigate to a thank you page or show confirmation
      setTimeout(() => {
        // Could navigate to a thank you page
        // navigate('/customer/thank-you');
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
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

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID */}
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

            {/* Message */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending || !formData.userId.trim() || !formData.message.trim()}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          </form>

          {/* Additional Info */}
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

          {/* Help Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need immediate assistance?{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                View our FAQ
              </a>{' '}
              or{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                call us
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 Branch International. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerMessageForm;
