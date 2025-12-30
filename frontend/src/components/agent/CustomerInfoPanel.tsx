import React from 'react';
import { Mail, Phone, CreditCard, Clock, TrendingUp, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import type { Customer, Conversation } from '../../types';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import UrgencyBadge from '../common/UrgencyBadge';

interface CustomerInfoPanelProps {
  customer: Customer;
  conversation?: Conversation;
}

const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({
  customer,
  conversation,
}) => {
  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoanStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'NONE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCreditScoreLevel = (score: number) => {
    if (score >= 800) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 700) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 600) return { label: 'Fair', color: 'text-yellow-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  const creditScoreInfo = getCreditScoreLevel(customer.creditScore ?? 0);

  const displayName = customer.name || `Customer ${customer.userId}`;
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Customer Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-semibold">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{displayName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID: {customer.userId}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{customer.email || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{customer.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          Account Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccountStatusColor(customer.accountStatus)}`}>
              {customer.accountStatus}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Credit Score
            </span>
            <div className="text-right">
              <p className={`font-semibold ${creditScoreInfo.color}`}>
                {customer.creditScore ?? 'N/A'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{creditScoreInfo.label}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 inline mr-1" />
              Account Age
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {customer.accountAge || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Loan Status
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLoanStatusColor(customer.loanStatus || 'NONE')}`}>
              {customer.loanStatus || 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Conversation Information */}
      {conversation && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
            Conversation Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Status
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${conversation.status === 'OPEN'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : conversation.status === 'IN_PROGRESS'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                {conversation.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Urgency
              </span>
              <UrgencyBadge level={conversation.highestUrgency || 'LOW'} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 inline mr-1" />
                Last Message
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {formatRelativeTime(conversation.lastMessageAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Created</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">
                {formatDate(conversation.createdAt)}
              </span>
            </div>
            {conversation.resolvedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Resolved</span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {formatDate(conversation.resolvedAt)}
                </span>
              </div>
            )}
            {conversation.agentId && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Assigned To</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {conversation.agent?.name || `Agent #${conversation.agentId}`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button
            className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
            onClick={() => console.log('View history for customer:', customer.id)}
          >
            View Full History
          </button>
          <button
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            onClick={() => console.log('Add note for customer:', customer.id)}
          >
            Add Note
          </button>
          <button
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            onClick={() => console.log('View transactions for customer:', customer.id)}
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoPanel;
