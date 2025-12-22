import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Fingerprint,  // Auth
  Zap,          // Cache (Speed)
  Gauge,        // Rate Limit
  Globe,        // Gateway
  ArrowRightLeft, // Proxy
  Activity,     // Circuit Breaker
  Share2,       // Mesh
  ShieldAlert,  // Security
  Layers        // Default
} from 'lucide-react';
import { FlowNodeData } from '../../types';

const getIcon = (type: string) => {
  switch (type) {
    case 'auth': return Fingerprint;
    case 'cache': return Zap;
    case 'ratelimit': return Gauge;
    case 'gateway': return Globe;
    case 'proxy': return ArrowRightLeft;
    case 'circuitbreaker': return Activity;
    case 'mesh': return Share2;
    case 'security': return ShieldAlert;
    default: return Layers;
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'auth': return 'text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-500/10';
    case 'cache': return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
    case 'ratelimit': return 'text-orange-400 border-orange-500/50 bg-orange-500/10';
    case 'gateway': return 'text-sky-400 border-sky-500/50 bg-sky-500/10';
    case 'proxy': return 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10';
    case 'circuitbreaker': return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
    case 'mesh': return 'text-teal-400 border-teal-500/50 bg-teal-500/10';
    case 'security': return 'text-red-400 border-red-500/50 bg-red-500/10';
    default: return 'text-slate-400 border-slate-500/50 bg-slate-500/10';
  }
};

export const MiddlewareNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const mwType = (data.middlewareType as string) || 'generic';
  
  // New: Check for specific technology data
  const techLogo = data.techLogo as string | undefined;
  const techName = data.techName as string | undefined;

  const Icon = getIcon(mwType);
  const colorClass = getColor(mwType);

  return (
    <div className={`
      relative group min-w-[140px]
      transition-all duration-200 ease-in-out
      ${selected ? 'scale-105' : 'hover:scale-105'}
    `}>
      {/* Glow */}
      <div className={`
        absolute -inset-0.5 rounded-full blur opacity-0 transition-opacity duration-300 bg-current
        ${selected ? 'opacity-40' : 'group-hover:opacity-10'}
      `} style={{ color: 'inherit' }} />

      {/* Main Container */}
      <div className={`
        relative flex items-center gap-3 pl-2 pr-4 py-2 rounded-full
        bg-zinc-900 border
        transition-colors
        ${selected ? 'border-white/50' : 'border-zinc-700 hover:border-zinc-500'}
      `}>
        {/* Icon Pill */}
        <div className={`
            flex items-center justify-center w-8 h-8 rounded-full border overflow-hidden
            ${colorClass}
            ${techLogo ? 'bg-white p-1' : ''} 
        `}>
          {techLogo ? (
            <img src={techLogo} alt="tech" className="w-full h-full object-contain" />
          ) : (
            <Icon size={16} strokeWidth={2.5} />
          )}
        </div>

        {/* Label */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-none mb-0.5">
            {techName || (mwType === 'generic' ? 'Middleware' : mwType)}
          </span>
          <span className="text-xs font-bold text-white font-heading leading-none">
            {data.label}
          </span>
        </div>
      </div>

      {/* Handles - All 4 sides visible and connectable */}
      <Handle id="left" type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-zinc-900" />
      <Handle id="right" type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-zinc-900" />
      
      <Handle id="top" type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-zinc-900" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-zinc-900" />
    </div>
  );
});