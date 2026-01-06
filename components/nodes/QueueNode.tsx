import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Workflow } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const QueueNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative w-56 h-20 rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
        : 'border-amber-500/30 hover:border-amber-500/60'}
    `}>
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border
        ${selected ? 'text-amber-400 border-amber-500' : 'text-amber-500/70 border-amber-500/30'}
      `}>
        Message Bus
      </div>

      <div className="h-full flex items-center px-5 gap-3">
        <div className={`p-1.5 rounded-lg border ${selected ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-500/20 bg-transparent text-amber-500/60'}`}>
            <Workflow size={18} />
        </div>
        <div className="min-w-0">
             <div className="text-sm font-bold text-white font-heading truncate">{data.label}</div>
             <div className="text-[10px] text-slate-500 font-mono">Stream: active</div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-slate-950 !border-2 !border-amber-500" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-slate-950 !border-2 !border-amber-500" />
    </div>
  );
});