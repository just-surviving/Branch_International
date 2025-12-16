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
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: number;
  customerId: number;
  conversationId: number | null;
  content: string;
  direction: 'INBOUND' | 'OUTBOUND';
  urgencyScore: number;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'RESOLVED';
  agentId: number | null;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  agent?: Agent;
  conversation?: Conversation;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: number;
  customerId: number;
  agentId: number | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  lastMessageAt: Date;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  agent?: Agent;
  messages?: Message[];
}

export interface CannedResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocketMessage {
  customerId: number;
  conversationId?: number;
  content: string;
  urgencyScore?: number;
  urgencyLevel?: string;
}

export interface SocketReply {
  customerId: number;
  conversationId: number;
  content: string;
  agentId: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
