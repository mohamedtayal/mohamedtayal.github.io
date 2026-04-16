import React from 'react';
import { TargetIcon, BookOpenIcon, TrophyIcon } from './icons/Icons';

type View = 'dashboard' | 'resources' | 'achievements';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <TargetIcon className="w-5 h-5" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpenIcon className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <TrophyIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <TargetIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            وسيلة <span className="text-blue-600 font-normal text-lg">(Waseela)</span>
          </h1>
        </div>
        <nav className="flex items-center gap-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
