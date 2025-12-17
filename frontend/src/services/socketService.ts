import { io, Socket } from 'socket.io-client';
import type { Message } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(WS_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

// Agent actions
export const joinAsAgent = (agentId: number, agentName?: string): void => {
  if (socket) {
    socket.emit('agent:join', { agentId, agentName });
  }
};

export const sendReply = (data: {
  customerId: number;
  conversationId: number;
  content: string;
}): void => {
  if (socket) {
    socket.emit('message:reply', data);
  }
};

export const sendTyping = (conversationId: number): void => {
  if (socket) {
    const agentId = localStorage.getItem('agentId');
    socket.emit('agent:typing', { conversationId, agentId: agentId ? parseInt(agentId) : null });
  }
};

export const sendStoppedTyping = (conversationId: number): void => {
  if (socket) {
    const agentId = localStorage.getItem('agentId');
    socket.emit('agent:stopped-typing', { conversationId, agentId: agentId ? parseInt(agentId) : null });
  }
};

export const markMessageRead = (messageId: number): void => {
  if (socket) {
    socket.emit('message:read', messageId);
  }
};

export const resolveConversation = (conversationId: number): void => {
  if (socket) {
    socket.emit('conversation:resolve', conversationId);
  }
};

// Customer actions
export const sendCustomerMessage = (data: {
  userId: string;
  content: string;
}): void => {
  if (socket) {
    socket.emit('message:new', {
      userId: data.userId,
      content: data.content,
    });
  }
};

// Event listeners
export const onMessageReceived = (callback: (message: Message) => void): void => {
  if (socket) {
    socket.on('message:received', callback);
  }
};

export const onMessageSent = (callback: (message: Message) => void): void => {
  if (socket) {
    socket.on('message:sent', callback);
  }
};

export const onAgentCount = (callback: (count: number) => void): void => {
  if (socket) {
    socket.on('agents:count', callback);
  }
};

export const onAgentTyping = (callback: (data: { agentId: number; agentName?: string; conversationId: number }) => void): void => {
  if (socket) {
    socket.on('agent:typing', callback);
  }
};

export const onAgentStoppedTyping = (callback: (data: { agentId: number; conversationId: number }) => void): void => {
  if (socket) {
    socket.on('agent:stopped-typing', callback);
  }
};

export const onMessageStatus = (callback: (data: { messageId: number; status: string }) => void): void => {
  if (socket) {
    socket.on('message:status', callback);
  }
};

export const onConversationResolved = (callback: (data: { conversationId: number }) => void): void => {
  if (socket) {
    socket.on('conversation:resolved', callback);
  }
};

export const onError = (callback: (error: { message: string }) => void): void => {
  if (socket) {
    socket.on('error', callback);
  }
};

// Remove listeners
export const offMessageReceived = (callback?: (message: Message) => void): void => {
  if (socket) {
    socket.off('message:received', callback);
  }
};

export const offMessageSent = (callback?: (message: Message) => void): void => {
  if (socket) {
    socket.off('message:sent', callback);
  }
};

export const offAgentCount = (callback?: (count: number) => void): void => {
  if (socket) {
    socket.off('agents:count', callback);
  }
};
