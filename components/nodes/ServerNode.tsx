import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Server, Activity } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative group w-40 h-40 rounded-3xl
      transition-all duration-300 ease-in-out
      ${selected ? 'scale-105' : 'hover:scale-102'}
    `}>
      {/* Selection Glow */}
      <div className={`
        absolute -inset-1 bg-gradient-to-b from-indigo-500 to-violet-600 rounded-[28px] blur-md opacity-0 transition-opacity duration-300
        ${selected ? 'opacity-40' : 'group-hover:opacity-20'}
      `} />

      {/* Main Container */}
      <div className={`
        relative w-full h-full flex flex-col justify-between p-4 rounded-3xl
        bg-zinc-900 border-[3px]
        ${selected ? 'border-indigo-500' : 'border-zinc-800 group-hover:border-zinc-700'}
        shadow-xl transition-colors
      `}>
        {/* Header / Icon */}
        <div className="flex items-start justify-between">
            <div className={`
                p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400
                ${selected ? 'bg-indigo-500/20 text-indigo-300' : ''}
            `}>
                <Server size={24} />
            </div>
            {/* Status Dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>

        {/* Content */}
        <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 block">Server</span>
            <div className="text-sm font-bold text-white font-heading leading-tight line-clamp-2">
                {data.label}
            </div>
        </div>
      </div>

      {/* Handles */}
      <Handle id="top" type="target" position={Position.Top} className="!w-3 !h-3 !bg-indigo-500 !border-4 !border-zinc-900" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-indigo-500 !border-4 !border-zinc-900" />
      <Handle id="left" type="target" position={Position.Left} className="!w-3 !h-3 !bg-indigo-500 !border-4 !border-zinc-900" />
      <Handle id="right" type="source" position={Position.Right} className="!w-3 !h-3 !bg-indigo-500 !border-4 !border-zinc-900" />
    </div>
  );
});