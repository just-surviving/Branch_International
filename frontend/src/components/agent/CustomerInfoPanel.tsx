import React from 'react';
import { User, Mail, Phone, CreditCard, Clock, TrendingUp, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
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

  const creditScoreInfo = getCreditScoreLevel(customer.creditScore);

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Customer Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-semibold">
            {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{customer.name}</h2>
            <p className="text-sm text-gray-500">Customer ID: {customer.userId}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-800">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm text-gray-800">{customer.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Account Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccountStatusColor(customer.accountStatus)}`}>
              {customer.accountStatus}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Credit Score
            </span>
            <div className="text-right">
              <p className={`font-semibold ${creditScoreInfo.color}`}>
                {customer.creditScore}
              </p>
              <p className="text-xs text-gray-500">{creditScoreInfo.label}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              <Calendar className="w-4 h-4 inline mr-1" />
              Account Age
            </span>
            <span className="text-sm font-medium text-gray-800">
              {customer.accountAgeMonths} months
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Loan Status
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLoanStatusColor(customer.loanStatus)}`}>
              {customer.loanStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Conversation Information */}
      {conversation && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Conversation Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Status
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                conversation.status === 'OPEN'
                  ? 'bg-green-100 text-green-800'
                  : conversation.status === 'IN_PROGRESS'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {conversation.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Urgency
              </span>
              <UrgencyBadge level={conversation.urgencyLevel} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                <Clock className="w-4 h-4 inline mr-1" />
                Last Message
              </span>
              <span className="text-sm font-medium text-gray-800">
                {formatRelativeTime(conversation.lastMessageAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Created</span>
              <span className="text-sm text-gray-800">
                {formatDate(conversation.createdAt)}
              </span>
            </div>
            {conversation.resolvedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolved</span>
                <span className="text-sm text-gray-800">
                  {formatDate(conversation.resolvedAt)}
                </span>
              </div>
            )}
            {conversation.assignedAgentId && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Assigned To</span>
                <span className="text-sm font-medium text-gray-800">
                  Agent #{conversation.assignedAgentId}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Notes */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
            View Full History
          </button>
          <button className="w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
            Add Note
          </button>
          <button className="w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
            View Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoPanel;
