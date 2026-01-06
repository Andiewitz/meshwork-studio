import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Cpu, Zap } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServiceNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative w-48 group transition-all duration-200 ${selected ? 'scale-[1.02]' : ''}`}>
      <div className={`
        relative w-full bg-white rounded-lg overflow-hidden flex flex-col
        border border-slate-200 shadow-sm transition-all duration-200
        ${selected ? 'ring-2 ring-emerald-500 shadow-xl' : 'hover:shadow-md hover:border-emerald-300'}
      `}>
        {/* Compact Header */}
        <div className="bg-emerald-500 px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white">
            <Cpu size={12} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Service</span>
          </div>
          <Zap size={10} className="text-white fill-current" />
        </div>

        <div className="p-3">
           <div className="text-sm font-bold text-slate-900 font-heading truncate">
             {data.label}
           </div>
           <div className="mt-1 flex gap-1">
              <span className="px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-100">
                v1.2.0
              </span>
              <span className="px-1.5 py-0.5 rounded-sm bg-slate-50 text-slate-500 text-[9px] font-bold border border-slate-100">
                HTTP
              </span>
           </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-white transition-all hover:scale-150" />
    </div>
  );
});