import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Network, Split } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const LoadBalancerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative group w-36 h-36 rounded-full
      transition-all duration-300 ease-in-out
      ${selected ? 'scale-105' : 'hover:scale-102'}
    `}>
      {/* Selection Glow */}
      <div className={`
        absolute -inset-1 bg-violet-500 rounded-full blur-md opacity-0 transition-opacity duration-300
        ${selected ? 'opacity-40' : 'group-hover:opacity-20'}
      `} />

      {/* Main Container - Circular for LB distinction */}
      <div className={`
        relative w-full h-full flex flex-col items-center justify-center p-4 rounded-full
        bg-zinc-900 border-[3px]
        ${selected ? 'border-violet-500' : 'border-zinc-800 group-hover:border-zinc-700'}
        shadow-xl transition-colors
      `}>
        <div className="absolute top-3 text-slate-600">
            <Split size={14} />
        </div>

        <div className="mb-1 text-violet-500 p-2.5 rounded-full bg-violet-500/10">
           <Network size={24} />
        </div>
        
        <div className="text-center w-full">
             <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Load Balancer</div>
             <div className="text-xs font-bold text-white font-heading px-3 truncate">{data.label}</div>
        </div>
      </div>

      {/* Handles - 4 directions for maximum connectivity */}
      <Handle id="top" type="target" position={Position.Top} className="!w-3 !h-3 !bg-violet-500 !border-4 !border-zinc-900" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-violet-500 !border-4 !border-zinc-900" />
      <Handle id="left" type="target" position={Position.Left} className="!w-3 !h-3 !bg-violet-500 !border-4 !border-zinc-900" />
      <Handle id="right" type="source" position={Position.Right} className="!w-3 !h-3 !bg-violet-500 !border-4 !border-zinc-900" />
    </div>
  );
});