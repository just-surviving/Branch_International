import { io, Socket } from 'socket.io-client';
import type { Message } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

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
    if (socket.connected) {
      socket.disconnect();
    } else {
      socket.close();
    }
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

// Agent actions
export const joinAsAgent = (agentId: number, agentName?: string): void => {
  if (socket && socket.connected) {
    console.log('Emitting agent:join', { agentId, agentName });
    socket.emit('agent:join', { agentId, agentName });
  } else {
    console.warn('Socket not connected, cannot join as agent');
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

export const reopenConversation = (conversationId: number): void => {
  if (socket) {
    socket.emit('conversation:reopen', conversationId);
  }
};

export const updateMessageUrgency = (messageId: number, urgencyLevel: string): void => {
  if (socket) {
    socket.emit('message:update-urgency', { messageId, urgencyLevel });
  }
};

// Customer actions
export const sendCustomerMessage = (data: {
  userId: string;
  content: string;
}): void => {
  // Ensure we have a socket
  if (!socket) {
    console.log('Socket was null in sendCustomerMessage, connecting...');
    socket = connectSocket();
  }

  // Log the attempt
  console.log('Attempting to send customer message:', data);

  if (socket) {
    // Socket.io buffers events if not connected, so this is generally safe
    // provided we have the socket instance
    socket.emit('message:new', {
      userId: data.userId,
      content: data.content,
    });
    console.log('Emitted message:new event');
  } else {
    console.error('Failed to get socket instance for sending message');
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

export const onConversationReopened = (callback: (data: { conversationId: number }) => void): void => {
  if (socket) {
    socket.on('conversation:reopened', callback);
  }
};

export const onUrgencyUpdated = (callback: (data: { messageId: number; urgencyLevel: string }) => void): void => {
  if (socket) {
    socket.on('message:urgency-updated', callback);
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
