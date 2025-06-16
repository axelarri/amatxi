
import React from 'react';
import { HomeIcon, ShieldExclamationIcon, HeartIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { AppView } from '../types';

interface NavBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const navItems = [
  { view: AppView.Dashboard, label: 'Inicio', icon: HomeIcon },
  { view: AppView.CravingHelper, label: 'Antojo', icon: ShieldExclamationIcon },
  { view: AppView.Motivations, label: 'Motivos', icon: HeartIcon },
  { view: AppView.Progress, label: 'Progreso', icon: ChartBarIcon },
  { view: AppView.Settings, label: 'Ajustes', icon: Cog6ToothIcon },
];

const NavBar: React.FC<NavBarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-top z-40 border-t border-slate-200">
      <div className="max-w-screen-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-150 focus:outline-none 
                        ${currentView === item.view ? 'text-teal-600' : 'text-slate-500 hover:text-teal-500'}`}
            aria-label={item.label}
          >
            <item.icon className="h-6 w-6 mb-0.5" />
            <span className={`text-xs font-medium ${currentView === item.view ? 'font-semibold' : ''}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
    