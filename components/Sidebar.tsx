import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Database,
  LogOut,
  Plus
} from 'lucide-react';
import { NavigationItem } from '../types';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Updated navigation structure
const navItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Data Sources', path: '/data', icon: Database },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 transition-all duration-300 border-r border-slate-900">
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-900 bg-slate-950">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col justify-center">
              <span className="text-lg font-bold font-heading text-white tracking-tight">
                Meshwork Studio
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-white transition-colors"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Action Button - High Contrast White on Black */}
      <div className="p-4">
        <NavLink to="/flow/new" className={`
            flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-100 text-slate-950 rounded-lg p-2.5 transition-all shadow-lg shadow-slate-900/50
            ${!isOpen && 'px-0'}
        `}>
          <Plus size={20} className="stroke-[2.5]" />
          {isOpen && <span className="font-bold font-heading text-sm">New Mesh</span>}
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-2 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative
              ${isActive 
                ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800' 
                : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  className={`${isOpen ? "mr-3" : "mx-auto"} ${isActive ? 'text-white' : ''}`} 
                />
                
                {isOpen && <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>}
                
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User / Footer */}
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-slate-600 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="font-heading">{user?.email?.substring(0, 2).toUpperCase() || 'US'}</span>
            )}
          </div>
          
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate font-heading">
                {user?.displayName || 'Guest Architect'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          )}

          {isOpen && (
             <button onClick={logout} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors">
               <LogOut size={16} />
             </button>
          )}
        </div>
      </div>
    </div>
  );
};