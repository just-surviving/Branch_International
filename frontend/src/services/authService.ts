import type { Agent } from '../types';

const STORAGE_KEY = 'branch_agent';

export interface AuthState {
  isAuthenticated: boolean;
  agent: Agent | null;
}

export const getStoredAgent = (): Agent | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const storeAgent = (agent: Agent): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agent));
  localStorage.setItem('agentId', String(agent.id));
};

export const removeAgent = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('agentId');
};

export const getStoredAgentId = (): number | null => {
  const id = localStorage.getItem('agentId');
  return id ? parseInt(id) : null;
};

export const isAuthenticated = (): boolean => {
  return getStoredAgent() !== null;
};
