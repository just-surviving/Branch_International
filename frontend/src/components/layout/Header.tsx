import React from 'react';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import type { Agent } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  agent?: Agent | null;
  agentCount?: number;
  isConnected?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ agent = null, agentCount = 0, isConnected = false, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-wa-border px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/branch-logo.png"
            alt="Branch"
            width="107"
            height="40"
            className="h-8 object-contain dark:brightness-0 dark:invert"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Connection status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-wa-green' : 'bg-red-500'
                }`}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Agent count */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <User className="w-4 h-4" />
            <span>{agentCount} online</span>
          </div>

          {/* Agent info */}
          {agent && (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{agent.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{agent.email}</p>
              </div>
              <div className="w-10 h-10 bg-wa-green/20 dark:bg-wa-green/30 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-wa-green dark:text-wa-green">
                  {agent.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
