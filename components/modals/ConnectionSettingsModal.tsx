import React from 'react';
import { Globe, Shield, Radio, Activity, Database, ArrowRightLeft, MessageSquare, X } from 'lucide-react';

export interface ConnectionOption {
  id: string;
  label: string;
  description: string;
  icon: any;
  color: string;
}

interface ConnectionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (protocol: ConnectionOption) => void;
  currentLabel?: string | null;
}

const PROTOCOLS: ConnectionOption[] = [
  { id: 'HTTP', label: 'HTTP/REST', description: 'Standard sync communication', icon: Globe, color: '#3b82f6' }, // blue-500
  { id: 'HTTPS', label: 'HTTPS', description: 'Secure sync communication', icon: Shield, color: '#10b981' }, // emerald-500
  { id: 'gRPC', label: 'gRPC', description: 'High performance RPC', icon: Activity, color: '#06b6d4' }, // cyan-500
  { id: 'WS', label: 'WebSocket', description: 'Bidirectional streaming', icon: ArrowRightLeft, color: '#f59e0b' }, // amber-500
  { id: 'AMQP', label: 'AMQP/Queue', description: 'Async messaging', icon: MessageSquare, color: '#ec4899' }, // pink-500
  { id: 'JDBC', label: 'JDBC/SQL', description: 'Database connection', icon: Database, color: '#8b5cf6' }, // violet-500
  { id: 'TCP', label: 'TCP/UDP', description: 'Low level transport', icon: Radio, color: '#71717a' }, // zinc-500
];

export const ConnectionSettingsModal: React.FC<ConnectionSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  currentLabel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white font-heading">Define Connection</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 grid gap-2">
          {PROTOCOLS.map((proto) => {
            const isSelected = currentLabel === proto.id;
            const Icon = proto.icon;
            
            return (
              <button
                key={proto.id}
                onClick={() => {
                  onSave(proto);
                  onClose();
                }}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                  ${isSelected 
                    ? 'bg-blue-600/10 border-blue-500' 
                    : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'}
                `}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${proto.color}20`, color: proto.color }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div className={`text-sm font-bold ${isSelected ? 'text-blue-400' : 'text-zinc-200'}`}>
                    {proto.label}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {proto.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};