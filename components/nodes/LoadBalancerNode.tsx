import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Network, ArrowLeftRight } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const LoadBalancerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative group w-36 h-36 transition-all duration-200 ${selected ? '-translate-y-1' : ''}`}>
      <div className={`absolute inset-0 bg-slate-900 rounded-[1.5rem] transition-transform duration-200 ${selected ? 'translate-x-2.5 translate-y-2.5' : 'translate-x-1.5 translate-y-1.5'}`} />
      
      <div className={`
        relative w-full h-full flex flex-col bg-white border-[3px] border-slate-900 rounded-[1.5rem] overflow-hidden
        ${selected ? 'bg-violet-50' : ''}
      `}>
        <div className="bg-violet-600 px-3 py-2 flex items-center justify-between text-white shrink-0">
          <Network size={14} strokeWidth={3} />
          <span className="text-[8px] font-black uppercase tracking-widest">Router</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
            <div className="w-10 h-10 mb-2 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 border-2 border-slate-900">
               <ArrowLeftRight size={20} strokeWidth={3} />
            </div>
            <div className="text-xs font-black text-slate-900 font-heading leading-tight uppercase px-1">
              {data.label}
            </div>
            <div className="mt-1 text-[8px] font-bold text-slate-400">L7 PROXY</div>
        </div>
      </div>

      <Handle id="t" type="target" position={Position.Top} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="b" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="l" type="target" position={Position.Left} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="r" type="source" position={Position.Right} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
    </div>
  );
});