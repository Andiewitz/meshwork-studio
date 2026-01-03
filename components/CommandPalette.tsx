
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Settings, 
  Plus, 
  Database, 
  LogOut, 
  FileText, 
  Command,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { Dialog, DialogContent, Backdrop } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

interface CommandOption {
  id: string;
  label: string;
  subLabel?: string;
  icon: any;
  action: () => void;
  shortcut?: string;
  group: 'Navigation' | 'Actions' | 'Account';
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Handle Keyboard Toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Define Commands
  const commands = useMemo<CommandOption[]>(() => [
    { 
      id: 'nav-home', 
      label: 'Go to Dashboard', 
      group: 'Navigation', 
      icon: LayoutDashboard, 
      action: () => navigate('/') 
    },
    { 
      id: 'nav-new', 
      label: 'Create New Mesh', 
      subLabel: 'Start a new architecture project',
      group: 'Navigation', 
      icon: Plus, 
      action: () => navigate('/flow/new'),
      shortcut: 'N'
    },
    { 
      id: 'nav-settings', 
      label: 'Settings', 
      group: 'Navigation', 
      icon: Settings, 
      action: () => navigate('/settings') 
    },
    { 
      id: 'nav-data', 
      label: 'Data Sources', 
      group: 'Navigation', 
      icon: Database, 
      action: () => navigate('/data') 
    },
    { 
      id: 'nav-logs', 
      label: 'Developer Logs', 
      group: 'Navigation', 
      icon: FileText, 
      action: () => navigate('/dev-logs') 
    },
    { 
        id: 'act-logout', 
        label: 'Sign Out', 
        group: 'Account', 
        icon: LogOut, 
        action: () => { if(confirm('Sign out?')) logout(); } 
    }
  ], [navigate, logout]);

  // Filter commands
  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    const lowerQuery = query.toLowerCase();
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(lowerQuery) || 
      cmd.subLabel?.toLowerCase().includes(lowerQuery)
    );
  }, [query, commands]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle List Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  return (
    <Dialog 
        open={isOpen} 
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
            style: {
                borderRadius: '16px',
                border: '2px solid #0f172a',
                boxShadow: '8px 8px 0 0 rgba(0,0,0,1)',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
            }
        }}
        BackdropComponent={(props) => (
            <Backdrop {...props} sx={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
        )}
    >
        <div className="flex flex-col">
            <div className="flex items-center gap-3 px-4 py-4 border-b-2 border-slate-100">
                <Search className="text-slate-400" size={20} />
                <input 
                    className="flex-1 bg-transparent text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none"
                    placeholder="Type a command or search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <div className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                    Esc
                </div>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                    <div className="space-y-1">
                        {filteredCommands.map((cmd, index) => {
                            const isSelected = index === selectedIndex;
                            const Icon = cmd.icon;
                            return (
                                <button
                                    key={cmd.id}
                                    onClick={() => {
                                        cmd.action();
                                        setIsOpen(false);
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group
                                        ${isSelected 
                                            ? 'bg-slate-900 text-white shadow-md' 
                                            : 'text-slate-600 hover:bg-slate-50'}
                                    `}
                                >
                                    <div className={`
                                        p-2 rounded-lg flex items-center justify-center
                                        ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}
                                    `}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                            {cmd.label}
                                        </div>
                                        {cmd.subLabel && (
                                            <div className={`text-xs ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                                                {cmd.subLabel}
                                            </div>
                                        )}
                                    </div>
                                    {isSelected && <ArrowRight size={16} className="text-white/50" />}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-8 text-center text-slate-400">
                        <Command size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-bold">No commands found</p>
                    </div>
                )}
            </div>

            <div className="px-4 py-2 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                 <span>Meshwork Studio</span>
                 <div className="flex gap-3">
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                 </div>
            </div>
        </div>
    </Dialog>
  );
};
