import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Play, Zap } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const TriggerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative group min-w-[180px]
      transition-all duration-200 ease-in-out
    `}>
      {/* Glow Effect on Selection */}
      <div className={`
        absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur opacity-0 transition-opacity duration-300
        ${selected ? 'opacity-40' : 'group-hover:opacity-20'}
      `} />

      {/* Main Node Content */}
      <div className={`
        relative flex items-center gap-3 px-5 py-3 rounded-full
        bg-zinc-900 border-2
        ${selected ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-zinc-700 hover:border-zinc-600'}
        transition-colors
      `}>
        {/* Icon container */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Zap size={16} fill="currentColor" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Trigger</span>
          <span className="text-sm font-medium text-white">{data.label}</span>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-emerald-500 !border-4 !border-zinc-900 transition-transform hover:scale-125 focus:scale-125"
      />
    </div>
  );
});