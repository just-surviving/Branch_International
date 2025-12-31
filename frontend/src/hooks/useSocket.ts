import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket } from '../services/socketService';
import { getStoredAgentId, getStoredAgent } from '../services/authService';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  agentCount: number;
  connect: () => void;
  disconnect: () => void;
}

export function useSocket(): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [agentCount, setAgentCount] = useState(0);

  const connect = useCallback(() => {
    const s = connectSocket();
    setSocket(s);

    s.on('connect', () => {
      setIsConnected(true);
      // Emit agent:join directly on this socket instance after connection
      const agentId = getStoredAgentId();
      const agent = getStoredAgent();
      if (agentId) {
        console.log('Emitting agent:join from useSocket (connect event)', { agentId, agentName: agent?.name });
        s.emit('agent:join', { agentId, agentName: agent?.name || undefined });
      }
    });

    // If already connected, manual check and emit
    if (s.connected) {
      setIsConnected(true);
      const agentId = getStoredAgentId();
      const agent = getStoredAgent();
      if (agentId) {
        console.log('Emitting agent:join from useSocket (already connected)', { agentId, agentName: agent?.name });
        s.emit('agent:join', { agentId, agentName: agent?.name || undefined });
      }
    }

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    s.on('connect_error', () => {
      setIsConnected(false);
    });

    s.on('agents:count', (count: number) => {
      console.log('Received agents:count', count);
      setAgentCount(count);
    });
  }, []);

  const disconnect = useCallback(() => {
    // Do not close the global socket on hook cleanup as it breaks other components sharing it
    // disconnectSocket(); 
    setSocket(null);
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket,
    isConnected,
    agentCount,
    connect,
    disconnect,
  };
}

export default useSocket;
