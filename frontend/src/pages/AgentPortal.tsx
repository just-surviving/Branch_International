import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentDashboard from '../components/agent/AgentDashboard';
import Header from '../components/layout/Header';
import { getStoredAgentId, getStoredAgent, removeAgent } from '../services/authService';
import { useSocket } from '../hooks/useSocket';

const AgentPortal: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, agentCount } = useSocket();
  const agent = getStoredAgent();

  useEffect(() => {
    // Check if agent is logged in
    const agentId = getStoredAgentId();
    if (!agentId) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    removeAgent();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        agent={agent}
        agentCount={agentCount}
        isConnected={isConnected}
        onLogout={handleLogout}
      />
      <AgentDashboard />
    </div>
  );
};

export default AgentPortal;
