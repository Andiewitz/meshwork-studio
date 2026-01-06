import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Workflow, ArrowRight } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const QueueNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative w-60 h-16 group transition-all duration-200 ${selected ? 'scale-[1.02]' : ''}`}>
      <div className={`
        relative w-full h-full bg-white rounded-lg overflow-hidden flex items-center
        border border-slate-200 shadow-sm transition-all duration-200
        ${selected ? 'ring-2 ring-pink-500 shadow-xl' : 'hover:shadow-md hover:border-pink-300'}
      `}>
         {/* Side Indicator */}
        <div className="w-1.5 h-full bg-pink-500 shrink-0" />

        <div className="flex-1 flex items-center justify-between px-4">
             <div className="flex items-center gap-3">
                <div className="bg-pink-50 p-2 rounded-lg text-pink-600">
                    <Workflow size={16} />
                </div>
                <div>
                    <div className="text-xs font-bold text-slate-900 font-heading">
                        {data.label}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">
                        Message Queue
                    </div>
                </div>
             </div>
             <ArrowRight size={14} className="text-slate-300" />
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-pink-500 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-pink-500 !border-2 !border-white transition-all hover:scale-150" />
    </div>
  );
});