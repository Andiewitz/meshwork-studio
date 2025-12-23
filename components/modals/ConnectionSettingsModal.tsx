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
        className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-slate-900">
          <h2 className="text-lg font-bold text-slate-900 font-heading">Define Connection</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
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
                  flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                  ${isSelected 
                    ? 'bg-slate-50 border-slate-900 shadow-[2px_2px_0_0_#0f172a] translate-x-1' 
                    : 'bg-white border-slate-100 hover:border-slate-400 hover:bg-slate-50'}
                `}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-transparent"
                  style={{ backgroundColor: `${proto.color}15`, color: proto.color, borderColor: isSelected ? proto.color : 'transparent' }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                    {proto.label}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
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