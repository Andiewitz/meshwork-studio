import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Split, ArrowDownUp } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const LoadBalancerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative w-36 h-36 group transition-all duration-200 ${selected ? 'scale-[1.02]' : ''}`}>
      <div className={`
        relative w-full h-full bg-white rounded-lg overflow-hidden flex flex-col
        border border-slate-200 shadow-sm transition-all duration-200
        ${selected ? 'ring-2 ring-violet-500 shadow-xl' : 'hover:shadow-md hover:border-violet-300'}
      `}>
        <div className="bg-violet-600 h-1.5 w-full shrink-0" />
        
        <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
            <div className="w-10 h-10 mb-2 flex items-center justify-center bg-violet-50 text-violet-600 rounded-lg">
               <Split size={20} />
            </div>
            
            <div className="text-xs font-bold text-slate-900 font-heading uppercase leading-tight">
              {data.label}
            </div>
            
            <div className="mt-2 flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                <ArrowDownUp size={10} />
                <span>Round Robin</span>
            </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-violet-500 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-violet-500 !border-2 !border-white transition-all hover:scale-150" />
    </div>
  );
});