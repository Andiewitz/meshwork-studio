import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Cpu } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServiceNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative w-48 h-28 rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
        : 'border-violet-500/30 hover:border-violet-500/60'}
    `}>
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border
        ${selected ? 'text-violet-400 border-violet-500' : 'text-violet-500/70 border-violet-500/30'}
      `}>
        Service
      </div>

      <div className="p-4 h-full flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
             <Cpu size={18} className="text-violet-500" />
             <div className="text-sm font-bold text-white font-heading truncate">
                {data.label}
             </div>
        </div>
        <div className="flex gap-1.5 mt-2">
             <div className="px-1.5 py-0.5 rounded border border-violet-500/30 bg-violet-500/10 text-[9px] font-bold text-violet-300">
                v1.0
             </div>
             <div className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-[9px] font-bold text-slate-400">
                HTTP
             </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-950 !border-2 !border-violet-500" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-slate-950 !border-2 !border-violet-500" />
    </div>
  );
});