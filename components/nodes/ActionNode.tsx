import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { Settings, MoreHorizontal } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position } = ReactFlow;

export const ActionNode = memo(({ data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative group min-w-[200px] rounded-xl
      transition-all duration-200
    `}>
      {/* Selection Glow */}
      <div className={`
        absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur opacity-0 transition-opacity
        ${selected ? 'opacity-40' : 'group-hover:opacity-15'}
      `} />

      <div className={`
        relative bg-zinc-900 rounded-xl border-2 overflow-hidden
        ${selected ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-zinc-700 hover:border-zinc-600'}
        transition-all
      `}>
        {/* Header Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-lg bg-zinc-800 text-blue-400">
              <Settings size={18} />
            </div>
            <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white font-heading">{data.label}</h3>
            {data.description && (
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {data.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-500 !border-4 !border-zinc-900"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-500 !border-4 !border-zinc-900"
      />
    </div>
  );
});