import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { GitFork, Check, X } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position } = ReactFlow;

export const ConditionNode = memo(({ data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  return (
    <div className="relative group w-[240px]">
      {/* Custom Diamond Shape Illusion using CSS Rotation or just a styled card */}
      {/* We will use a hexagon/modern card style for better readability than a pure diamond */}
      
      <div className={`
        absolute -inset-0.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg blur opacity-0 transition-opacity
        ${selected ? 'opacity-40' : 'group-hover:opacity-15'}
      `} />

      <div className={`
        relative bg-zinc-900 border-2 rounded-lg p-1
        ${selected ? 'border-amber-500' : 'border-zinc-700 hover:border-zinc-600'}
        transition-colors
      `}>
        <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded flex-1">
            <div className="flex-shrink-0 w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center text-amber-500">
                <GitFork size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Condition</div>
                <div className="text-sm font-medium text-white truncate">{data.label}</div>
            </div>
        </div>
        
        {/* Output Labels */}
        <div className="flex justify-between px-2 py-1.5 text-[10px] font-medium text-zinc-500 uppercase">
           <span className="text-emerald-500/80">True</span>
           <span className="text-red-500/80">False</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-amber-500 !border-4 !border-zinc-900"
      />
      
      {/* True Path */}
      <Handle
        type="source"
        position={Position.Left}
        id="true"
        className="!w-3 !h-3 !bg-emerald-500 !border-4 !border-zinc-900 !-left-[6px]"
      />
      
      {/* False Path */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="!w-3 !h-3 !bg-red-500 !border-4 !border-zinc-900 !-right-[6px]"
      />
    </div>
  );
});