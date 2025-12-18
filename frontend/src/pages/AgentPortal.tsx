import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentDashboard from '../components/agent/AgentDashboard';
import Header from '../components/layout/Header';
import { getStoredAgentId } from '../services/authService';
import { useSocket } from '../hooks/useSocket';

const AgentPortal: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useSocket();

  useEffect(() => {
    // Check if agent is logged in
    const agentId = getStoredAgentId();
    if (!agentId) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <AgentDashboard />
    </div>
  );
};

export default AgentPortal;
