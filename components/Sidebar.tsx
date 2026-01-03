
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
import { Tooltip, Zoom } from '@mui/material';

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
    <div className="flex flex-col h-full bg-white text-slate-900 transition-all duration-300 border-r-2 border-slate-900">
      {/* Logo Area - Indigo Theme */}
      <div className="h-20 flex items-center justify-between px-4 border-b-2 border-slate-900 bg-white">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm border-2 border-slate-900">
               <span className="font-bold font-heading text-lg">M</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg font-bold font-heading text-slate-900 tracking-tight leading-none">
                Meshwork
              </span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest">STUDIO</span>
            </div>
          </div>
        ) : (
           <div className="w-full flex justify-center">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm border-2 border-slate-900">
               <span className="font-bold font-heading text-lg">M</span>
            </div>
           </div>
        )}
        {isOpen && (
            <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
            >
            <ChevronLeft size={18} />
            </button>
        )}
      </div>

      {/* Action Button - Blue for Primary Action */}
      <div className="p-4">
        <Tooltip title={!isOpen ? "Create New Mesh" : ""} placement="right" arrow TransitionComponent={Zoom}>
            <NavLink to="/flow/new" className={`
                flex items-center justify-center gap-2 w-full 
                bg-blue-600 text-white hover:bg-blue-700
                rounded-xl p-3 transition-all 
                shadow-[3px_3px_0_0_#000000] hover:shadow-[1px_1px_0_0_#000000] hover:translate-y-[2px]
                border-2 border-slate-900
                ${!isOpen && 'px-0 aspect-square'}
            `}>
            <Plus size={20} className="stroke-[3]" />
            {isOpen && <span className="font-bold font-heading text-sm">New Mesh</span>}
            </NavLink>
        </Tooltip>
      </div>

      {/* Navigation Links - Rose Accent for Active State */}
      <nav className="flex-1 py-2 space-y-2 px-3">
        {navItems.map((item) => (
          <Tooltip 
            key={item.path} 
            title={!isOpen ? item.label : ""} 
            placement="right" 
            arrow 
            TransitionComponent={Zoom}
          >
            <NavLink
                to={item.path}
                className={({ isActive }) => `
                flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative border-2
                ${isActive 
                    ? 'bg-rose-50 border-slate-900 text-rose-600 shadow-[2px_2px_0_0_#0f172a]' 
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                ${!isOpen && 'justify-center px-0'}
                `}
            >
                {({ isActive }) => (
                <>
                    <item.icon 
                    size={20} 
                    className={`
                        ${isOpen ? "mr-3" : ""} 
                        ${isActive ? 'text-rose-600' : 'text-slate-500 group-hover:text-slate-900'}
                    `} 
                    />
                    
                    {isOpen && <span className={`text-sm font-bold`}>{item.label}</span>}
                </>
                )}
            </NavLink>
          </Tooltip>
        ))}
      </nav>

      {/* Toggle (if collapsed) or Spacer */}
      {!isOpen && (
          <div className="flex justify-center pb-4">
               <button 
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                >
                <ChevronRight size={18} />
                </button>
          </div>
      )}

      {/* User / Footer */}
      <div className="p-4 border-t-2 border-slate-900 bg-slate-50">
        <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-9 h-9 rounded-lg bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 font-bold text-xs shadow-[2px_2px_0_0_#cbd5e1] overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="font-heading">{user?.email?.substring(0, 2).toUpperCase() || 'US'}</span>
            )}
          </div>
          
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate font-heading">
                {user?.displayName || 'Guest Architect'}
              </p>
              <p className="text-xs text-slate-500 truncate font-mono">{user?.email}</p>
            </div>
          )}

          {isOpen && (
            <Tooltip title="Sign Out">
                <button onClick={logout} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut size={18} />
                </button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};
