import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Server, Terminal } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative group w-56 h-36 transition-all duration-200 ${selected ? '-translate-y-1' : ''}`}>
      {/* Neo-Brutalist Shadow */}
      <div className={`absolute inset-0 bg-slate-900 rounded-[2rem] transition-transform duration-200 ${selected ? 'translate-x-3 translate-y-3' : 'translate-x-1.5 translate-y-1.5'}`} />
      
      {/* Main Card */}
      <div className={`
        relative w-full h-full flex flex-col bg-white border-[3px] border-slate-900 rounded-[2rem] overflow-hidden
        ${selected ? 'bg-blue-50' : ''}
      `}>
        {/* Header Bar */}
        <div className="bg-slate-900 px-5 py-2.5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <Server size={14} strokeWidth={3} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Compute Unit</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-lg font-black text-slate-900 font-heading leading-tight line-clamp-1">
              {data.label}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
               <Terminal size={12} />
               <span className="text-[9px] font-mono font-bold">NODE_ID: {Math.floor(Math.random() * 9000) + 1000}</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between">
             <div className="px-2 py-0.5 bg-slate-100 border border-slate-900 rounded-md text-[8px] font-bold uppercase">
               Linux x64
             </div>
             <div className="text-[10px] font-black text-blue-600">8vCPU / 32GB</div>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle id="t" type="target" position={Position.Top} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900 !-top-1.5" />
      <Handle id="b" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900 !-bottom-1.5" />
      <Handle id="l" type="target" position={Position.Left} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900 !-left-1.5" />
      <Handle id="r" type="source" position={Position.Right} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900 !-right-1.5" />
    </div>
  );
});