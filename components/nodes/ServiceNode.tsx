import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Cpu } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServiceNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative group w-36 h-36 rounded-3xl
      transition-all duration-300 ease-in-out
    `}>
      <div className={`
        absolute -inset-1 bg-emerald-500 rounded-[28px] blur-md opacity-0 transition-opacity duration-300
        ${selected ? 'opacity-40' : 'group-hover:opacity-20'}
      `} />

      <div className={`
        relative w-full h-full flex flex-col justify-between p-4 rounded-3xl
        bg-zinc-900 border-[3px]
        ${selected ? 'border-emerald-500' : 'border-zinc-800 group-hover:border-zinc-700'}
        transition-colors
      `}>
        <div className="flex justify-end">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
        
        <div className="flex flex-col items-center">
            <div className="mb-2 text-emerald-500">
                <Cpu size={28} />
            </div>
            <div className="text-center">
                <div className="text-sm font-bold text-white font-heading">{data.label}</div>
            </div>
        </div>
        
        <div className="text-[9px] text-slate-600 text-center font-mono">v1.0.2</div>
      </div>

      <Handle id="top" type="target" position={Position.Top} className="!w-3 !h-3 !bg-emerald-500 !border-4 !border-zinc-900" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-emerald-500 !border-4 !border-zinc-900" />
      <Handle id="left" type="target" position={Position.Left} className="!w-3 !h-3 !bg-emerald-500 !border-4 !border-zinc-900" />
      <Handle id="right" type="source" position={Position.Right} className="!w-3 !h-3 !bg-emerald-500 !border-4 !border-zinc-900" />
    </div>
  );
});