import axios from 'axios';
import type { Message, Customer, Agent, Conversation, CannedResponse, SearchResults, Stats, UrgencyResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Messages
export const getMessages = async (filters?: {
  urgencyLevel?: string;
  status?: string;
  limit?: number;
}): Promise<Message[]> => {
  const { data } = await api.get('/messages', { params: filters });
  return data;
};

export const getMessage = async (id: number): Promise<Message> => {
  const { data } = await api.get(`/messages/${id}`);
  return data;
};

export const createMessage = async (message: {
  customerId: number;
  content: string;
  conversationId?: number;
}): Promise<Message> => {
  const { data } = await api.post('/messages', message);
  return data;
};

export const replyToMessage = async (
  id: number,
  reply: { content: string; agentId?: number }
): Promise<Message> => {
  const { data } = await api.post(`/messages/${id}/reply`, reply);
  return data;
};

export const updateMessageStatus = async (
  id: number,
  status: string
): Promise<Message> => {
  const { data } = await api.patch(`/messages/${id}/status`, { status });
  return data;
};

export const getMessageStats = async () => {
  const { data } = await api.get('/messages/stats');
  return data;
};

export const analyzeUrgency = async (content: string): Promise<UrgencyResult> => {
  const { data } = await api.post('/messages/analyze-urgency', { content });
  return data;
};

// Customers
export const getCustomers = async (filters?: {
  search?: string;
  limit?: number;
}): Promise<Customer[]> => {
  const { data } = await api.get('/customers', { params: filters });
  return data;
};

export const getCustomer = async (id: number): Promise<Customer> => {
  const { data } = await api.get(`/customers/${id}`);
  return data;
};

export const getCustomerByUserId = async (userId: number): Promise<Customer> => {
  const { data } = await api.get(`/customers/user/${userId}`);
  return data;
};

// Agents
export const getAgents = async (): Promise<Agent[]> => {
  const { data } = await api.get('/agents');
  return data;
};

export const getAgent = async (id: number): Promise<Agent> => {
  const { data } = await api.get(`/agents/${id}`);
  return data;
};

export const updateAgentStatus = async (
  id: number,
  status: string
): Promise<Agent> => {
  const { data } = await api.patch(`/agents/${id}/status`, { status });
  return data;
};

// Conversations
export const getConversations = async (filters?: {
  status?: string;
  limit?: number;
}): Promise<Conversation[]> => {
  const { data } = await api.get('/conversations', { params: filters });
  return data;
};

export const getConversation = async (id: number): Promise<Conversation> => {
  const { data } = await api.get(`/conversations/${id}`);
  return data;
};

// Canned Responses
export const getCannedResponses = async (category?: string): Promise<CannedResponse[]> => {
  const { data } = await api.get('/canned-responses', { params: { category } });
  return data;
};

export const getCannedResponseCategories = async (): Promise<string[]> => {
  const { data } = await api.get('/canned-responses/categories');
  return data;
};

// Search
export const search = async (query: string, limit?: number): Promise<SearchResults> => {
  const { data } = await api.get('/search', { params: { q: query, limit } });
  return data;
};

// Stats
export const getStats = async (): Promise<Stats> => {
  const { data } = await api.get('/stats');
  return data;
};

// Health check
export const healthCheck = async () => {
  const { data } = await api.get('/health');
  return data;
};

export default api;
