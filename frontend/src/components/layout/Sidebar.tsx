import React from 'react';
import { MessageSquare, Users, BarChart2, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const menuItems = [
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'messages', onItemClick }) => {
  return (
    <aside className="w-16 bg-gray-900 flex flex-col items-center py-4">
      {/* Logo */}
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-8">
        <MessageSquare className="w-6 h-6 text-white" />
      </div>

      {/* Menu items */}
      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
