import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Cloud, ExternalLink, Globe } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ExternalServiceNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const logo = data.logo as string | undefined;

  return (
    <div className={`relative group w-52 h-32 transition-all duration-200 ${selected ? '-translate-y-1' : ''}`}>
      <div className={`absolute inset-0 bg-slate-300 rounded-3xl transition-transform duration-200 ${selected ? 'translate-x-3 translate-y-3' : 'translate-x-1.5 translate-y-1.5'}`} />
      
      <div className={`
        relative w-full h-full flex flex-col bg-slate-50 border-[3px] border-dashed border-slate-400 rounded-3xl overflow-hidden
        ${selected ? 'border-sky-500 bg-sky-50' : ''}
      `}>
        <div className={`px-4 py-2 flex items-center justify-between text-slate-400 shrink-0 ${selected ? 'text-sky-500' : ''}`}>
          <div className="flex items-center gap-2">
            <Globe size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">SaaS Provider</span>
          </div>
          <ExternalLink size={12} strokeWidth={3} />
        </div>

        <div className="flex-1 p-4 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl border-2 border-slate-200 bg-white flex items-center justify-center shrink-0 p-2 ${selected ? 'border-sky-200' : ''}`}>
              {logo ? (
                 <img src={logo} alt="" className="w-full h-full object-contain" />
              ) : (
                 <Cloud size={24} strokeWidth={1.5} className="text-slate-300" />
              )}
            </div>
            <div className="min-w-0">
               <div className="text-sm font-black text-slate-900 font-heading truncate leading-tight">
                 {data.label}
               </div>
               <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">External API</div>
            </div>
        </div>
      </div>

      <Handle id="t" type="target" position={Position.Top} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="b" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="l" type="target" position={Position.Left} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="r" type="source" position={Position.Right} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
    </div>
  );
});