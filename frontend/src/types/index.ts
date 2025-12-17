export interface Customer {
  id: number;
  userId: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  accountStatus: string;
  creditScore: number | null;
  accountAge: string | null;
  loanStatus: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  customerId: number;
  conversationId: number | null;
  content: string;
  direction: 'INBOUND' | 'OUTBOUND';
  urgencyScore: number;
  urgencyLevel: UrgencyLevel;
  status: MessageStatus;
  agentId: number | null;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  agent?: Agent;
  conversation?: Conversation;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  status: AgentStatus;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
    conversations: number;
  };
}

export interface Conversation {
  id: number;
  customerId: number;
  agentId: number | null;
  status: ConversationStatus;
  lastMessageAt: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  agent?: Agent;
  messages?: Message[];
  highestUrgency?: UrgencyLevel;
  highestUrgencyScore?: number;
  unreadCount?: number;
}

export interface CannedResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MessageStatus = 'UNREAD' | 'READ' | 'REPLIED' | 'RESOLVED';
export type AgentStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';
export type ConversationStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface SearchResults {
  messages: Message[];
  customers: Customer[];
  conversations: Conversation[];
  totalResults: number;
}

export interface Stats {
  messages: {
    total: number;
    unread: number;
    critical: number;
    high: number;
  };
  conversations: {
    total: number;
    open: number;
  };
  customers: {
    total: number;
  };
  agents: {
    total: number;
  };
}

export interface UrgencyResult {
  score: number;
  level: UrgencyLevel;
  keywords: string[];
}
