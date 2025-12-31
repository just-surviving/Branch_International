import React, { useState, useEffect } from 'react';
import { Mail, Phone, CreditCard, Clock, TrendingUp, Calendar, MessageSquare, AlertCircle, X, History, FileText, DollarSign, Trash2, ChevronDown } from 'lucide-react';
import type { Customer, Conversation } from '../../types';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import UrgencyBadge from '../common/UrgencyBadge';
import toast from 'react-hot-toast';
import { connectSocket } from '../../services/socketService';

interface CustomerNote {
  id: string;
  text: string;
  createdAt: string;
  agentName: string;
}

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-400' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-500' },
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-500' },
];

interface CustomerInfoPanelProps {
  customer: Customer;
  conversation?: Conversation;
}

const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({
  customer,
  conversation,
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [currentPriority, setCurrentPriority] = useState(conversation?.highestUrgency || 'LOW');

  // Load notes from localStorage when customer changes
  useEffect(() => {
    const storedNotes = localStorage.getItem(`customer_notes_${customer.userId}`);
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    } else {
      setNotes([]);
    }
  }, [customer.userId]);

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

  // Mock transaction data for demo
  const mockTransactions = [
    { id: 1, type: 'Loan Disbursement', amount: 50000, date: '2024-12-20', status: 'Completed' },
    { id: 2, type: 'Loan Repayment', amount: -5000, date: '2024-12-25', status: 'Completed' },
    { id: 3, type: 'Late Fee', amount: -500, date: '2024-12-28', status: 'Pending' },
  ];

  const handleSaveNote = () => {
    if (noteText.trim()) {
      const agentData = localStorage.getItem('branch_agent');
      const agentName = agentData ? JSON.parse(agentData).name : 'Unknown Agent';

      const newNote: CustomerNote = {
        id: Date.now().toString(),
        text: noteText.trim(),
        createdAt: new Date().toISOString(),
        agentName,
      };

      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem(`customer_notes_${customer.userId}`, JSON.stringify(updatedNotes));

      toast.success(`Note saved for ${displayName}`);
      setNoteText('');
      setShowNoteModal(false);
    } else {
      toast.error('Please enter a note');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem(`customer_notes_${customer.userId}`, JSON.stringify(updatedNotes));
    toast.success('Note deleted');
  };

  return (
    <>
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
                  Priority
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    className="flex items-center gap-1"
                  >
                    <UrgencyBadge level={currentPriority || 'LOW'} size="sm" />
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                  {showPriorityDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[120px]">
                      {PRIORITY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setCurrentPriority(option.value as any);
                            setShowPriorityDropdown(false);
                            // Emit to server
                            const socket = connectSocket();
                            socket.emit('conversation:update-priority', {
                              conversationId: conversation?.id,
                              priority: option.value
                            });
                            toast.success(`Priority set to ${option.label}`);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${option.value === currentPriority ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${option.color}`} />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
              className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              onClick={() => setShowHistoryModal(true)}
            >
              <History className="w-4 h-4" />
              View Full History
            </button>
            <button
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              onClick={() => setShowNoteModal(true)}
            >
              <FileText className="w-4 h-4" />
              Add Note
            </button>
            <button
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              onClick={() => setShowTransactionsModal(true)}
            >
              <DollarSign className="w-4 h-4" />
              View Transactions
            </button>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Message History - {displayName}
              </h2>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {conversation?.messages?.length ? (
                <div className="space-y-3">
                  {conversation.messages.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${msg.direction === 'INBOUND' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>{msg.direction === 'INBOUND' ? 'Customer' : 'Agent'}</span>
                        <span>{formatDate(msg.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{msg.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No message history available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notes for {displayName}
              </h2>
              <button onClick={() => setShowNoteModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add new note */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a new note..."
                className="w-full h-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSaveNote}
                  disabled={!noteText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Previous notes */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Previous Notes ({notes.length})
              </h3>
              {notes.length === 0 ? (
                <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">
                  No notes yet
                </p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {note.agentName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatRelativeTime(note.createdAt)}
                          </span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{note.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Modal */}
      {showTransactionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transactions - {displayName}
              </h2>
              <button onClick={() => setShowTransactionsModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 dark:text-gray-400 uppercase">
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {mockTransactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="py-3 text-gray-800 dark:text-gray-200">{tx.type}</td>
                      <td className={`py-3 font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        KES {Math.abs(tx.amount).toLocaleString()}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">{tx.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerInfoPanel;
