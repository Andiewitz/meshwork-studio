import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Layers } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const QueueNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative group w-32 h-32 rounded-3xl
      transition-all duration-300 ease-in-out
    `}>
      <div className={`
        absolute -inset-1 bg-amber-500 rounded-[28px] blur-md opacity-0 transition-opacity duration-300
        ${selected ? 'opacity-40' : 'group-hover:opacity-20'}
      `} />

      <div className={`
        relative w-full h-full flex flex-col items-center justify-center p-3 rounded-3xl
        bg-zinc-900 border-[3px] border-dashed
        ${selected ? 'border-amber-500' : 'border-zinc-800 group-hover:border-zinc-700'}
        transition-colors
      `}>
         <div className="mb-2 text-amber-500 p-2 rounded-xl bg-amber-500/10">
            <Layers size={24} />
         </div>
         <div className="text-center">
            <div className="text-xs font-bold text-white font-heading leading-tight">{data.label}</div>
            <div className="text-[9px] text-zinc-500 mt-1 uppercase tracking-wide">Queue</div>
         </div>
      </div>

      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-amber-500 !border-4 !border-zinc-900" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-amber-500 !border-4 !border-zinc-900" />
    </div>
  );
});