import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Server } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative w-56 h-32 rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
        : 'border-indigo-500/30 hover:border-indigo-500/60'}
    `}>
      {/* HUD Label */}
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border
        ${selected ? 'text-indigo-400 border-indigo-500' : 'text-indigo-500/70 border-indigo-500/30'}
      `}>
        Compute
      </div>

      <div className="p-5 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
            <div className={`p-2 rounded-lg border bg-indigo-500/10 ${selected ? 'border-indigo-500/50 text-indigo-400' : 'border-indigo-500/20 text-indigo-500/60'}`}>
                <Server size={20} />
            </div>
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
        </div>
        
        <div>
            <div className="text-lg font-bold text-white font-heading leading-tight truncate">
                {data.label}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
                4vCPU • 16GB
            </div>
        </div>
      </div>

      {/* Wireframe Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-950 !border-2 !border-indigo-500" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-slate-950 !border-2 !border-indigo-500" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-slate-950 !border-2 !border-indigo-500" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-slate-950 !border-2 !border-indigo-500" />
    </div>
  );
});