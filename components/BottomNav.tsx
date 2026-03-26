import React from 'react';
import { Home, Bell, User, Zap, Timer } from 'lucide-react';
import { PageState } from '../types';

interface BottomNavProps {
  activePage: PageState;
  onNavigate: (page: PageState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: PageState.HOME, label: 'Home', icon: Home },
    { id: PageState.POMODORO, label: 'Timer', icon: Timer },
    { id: PageState.UPDATES, label: 'Updates', icon: Zap },
    { id: PageState.NOTIFICATION, label: 'Notification', icon: Bell },
    { id: PageState.PROFILE, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-50">
      {navItems.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-16 ${
              isActive ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;