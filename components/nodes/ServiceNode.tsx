import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Cpu, Zap } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServiceNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative group w-48 h-36 transition-all duration-200 ${selected ? '-translate-y-1' : ''}`}>
      <div className={`absolute inset-0 bg-slate-900 rounded-[2rem] transition-transform duration-200 ${selected ? 'translate-x-3 translate-y-3' : 'translate-x-1.5 translate-y-1.5'}`} />
      
      <div className={`
        relative w-full h-full flex flex-col bg-white border-[3px] border-slate-900 rounded-[2rem] overflow-hidden
        ${selected ? 'bg-emerald-50' : ''}
      `}>
        <div className="bg-emerald-500 px-5 py-2.5 flex items-center justify-between text-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <Cpu size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">Service</span>
          </div>
          <Zap size={12} strokeWidth={3} className="animate-pulse" />
        </div>

        <div className="flex-1 p-5 flex flex-col justify-center">
            <div className="text-base font-black text-slate-900 font-heading leading-tight mb-2">
              {data.label}
            </div>
            <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[8px] font-black uppercase tracking-tighter">Healthy</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[8px] font-bold uppercase tracking-tighter">Go v1.21</span>
            </div>
        </div>

        <div className="px-5 py-2 border-t border-slate-100 flex items-center justify-between">
           <span className="text-[9px] font-mono font-bold text-slate-300">POD: RES_AX2</span>
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>

      <Handle id="t" type="target" position={Position.Top} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="b" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="l" type="target" position={Position.Left} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="r" type="source" position={Position.Right} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
    </div>
  );
});