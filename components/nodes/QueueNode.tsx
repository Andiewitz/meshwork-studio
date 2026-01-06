import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { MoreHorizontal, Workflow } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const QueueNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative group w-48 h-24 transition-all duration-200 ${selected ? '-translate-y-1' : ''}`}>
      <div className={`absolute inset-0 bg-slate-900 rounded-2xl transition-transform duration-200 ${selected ? 'translate-x-2.5 translate-y-2.5' : 'translate-x-1.5 translate-y-1.5'}`} />
      
      <div className={`
        relative w-full h-full flex flex-col bg-white border-[3px] border-slate-900 rounded-2xl overflow-hidden
        ${selected ? 'bg-amber-50' : ''}
      `}>
        <div className="bg-amber-400 border-b-2 border-slate-900 px-3 py-1 flex items-center justify-between text-slate-900 shrink-0">
          <div className="flex items-center gap-1.5">
            <Workflow size={12} strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-widest">Message Bus</span>
          </div>
          <MoreHorizontal size={12} strokeWidth={3} />
        </div>

        <div className="flex-1 p-3 flex items-center gap-3">
            <div className="flex flex-col gap-1">
               <div className="w-1 h-8 bg-amber-500 rounded-full" />
            </div>
            <div className="min-w-0">
               <div className="text-xs font-black text-slate-900 font-heading truncate leading-tight uppercase">
                 {data.label}
               </div>
               <div className="text-[8px] font-mono font-bold text-slate-400 mt-0.5">QUEUE_LENGTH: 429</div>
            </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
    </div>
  );
});