import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { User, Smartphone, Monitor } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ClientNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const isPhone = data.clientType === 'phone';
  const size = isPhone ? "w-32 h-48" : "w-48 h-32";
  const Icon = isPhone ? Smartphone : Monitor;

  return (
    <div className={`
      relative ${size} rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
        : 'border-rose-500/30 hover:border-rose-500/60'}
    `}>
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border
        ${selected ? 'text-rose-400 border-rose-500' : 'text-rose-500/70 border-rose-500/30'}
      `}>
        Client
      </div>

      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Icon size={32} className={`mb-3 ${selected ? 'text-rose-400' : 'text-rose-600'}`} strokeWidth={1.5} />
        <div className="text-sm font-bold text-white font-heading">
            {data.label}
        </div>
      </div>

      {/* Inputs (Left) - Optional for Client but good for consistency in n8n style */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-rose-500 hover:!bg-rose-500 hover:!scale-125 transition-all !-left-[7px] z-50" 
      />

      {/* Outputs (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-rose-500 hover:!bg-rose-500 hover:!scale-125 transition-all !-right-[7px] z-50" 
      />
    </div>
  );
});