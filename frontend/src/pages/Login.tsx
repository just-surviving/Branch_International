import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Loader2 } from 'lucide-react';
import { getAgents, updateAgentStatus } from '../services/api';
import { storeAgent } from '../services/authService';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll find an agent by email
      const agents = await getAgents();
      const agent = agents.find((a) => a.email.toLowerCase() === formData.email.toLowerCase());

      if (!agent) {
        toast.error('Invalid email or password');
        setLoading(false);
        return;
      }

      // Store agent
      storeAgent(agent);

      // Update agent status to available
      await updateAgentStatus(agent.id, 'AVAILABLE');

      // Join as agent via WebSocket will be handled by AgentPortal upon navigation

      toast.success(`Welcome back, ${agent.name}!`);
      navigate('/agent/portal');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick login demo accounts
  const demoAccounts = [
    { name: 'Sarah Johnson', email: 'sarah.johnson@branch.com' },
    { name: 'Michael Chen', email: 'michael.chen@branch.com' },
    { name: 'Emily Rodriguez', email: 'emily.rodriguez@branch.com' },
    { name: 'David Kim', email: 'david.kim@branch.com' },
  ];

  const handleDemoLogin = (email: string) => {
    setFormData({ ...formData, email });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white dark:bg-gray-800 rounded-full px-6 py-3 mb-4 shadow-lg">
            <img
              src="/branch-logo.png"
              alt="Branch"
              className="h-12 object-contain"
            />
          </div>
          <p className="text-blue-100 dark:text-gray-300">Agent Portal Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@branch.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center font-medium">
              Quick Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email)}
                  className="px-3 py-2 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-lg transition-colors text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {account.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Click to auto-fill email (password not required for demo)
            </p>
          </div>
        </div>

        {/* Customer Link */}
        <div className="mt-6 text-center">
          <p className="text-blue-100 dark:text-gray-300 text-sm">
            Not an agent?{' '}
            <a
              href="/customer"
              onClick={(e) => {
                e.preventDefault();
                navigate('/customer');
              }}
              className="text-white dark:text-blue-400 font-semibold hover:underline"
            >
              Send us a message
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-blue-200 dark:text-gray-400">
          <p>© 2024 Branch International. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
