import React, { useState, useRef, useEffect } from 'react';
import { Bell, HelpCircle, AlertTriangle } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';

const { useNavigate } = ReactRouterDOM;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-900 shadow-sm px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {/* Spacer or Breadcrumbs could go here */}
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell with Popover */}
        <div className="relative" ref={notifRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`
                    p-2 rounded-full transition-colors relative
                    ${showNotifications ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
                `}
            >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] border border-slate-900 p-4 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600 shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1">Alpha Preview (v1.4.0)</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                You are using an early alpha build. Features may change, and data persistence in Guest Mode is local-only.
                            </p>
                            <div className="mt-3 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">
                                System Status: Stable
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <button 
          onClick={() => navigate('/dev-logs')}
          className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors"
          title="Developer Logs & Updates"
        >
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
};