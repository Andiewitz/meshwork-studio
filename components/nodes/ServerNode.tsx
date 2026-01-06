import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Server, Activity } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative w-64 group transition-all duration-200 ${selected ? 'scale-[1.02]' : ''}`}>
      <div className={`
        relative w-full bg-white rounded-lg overflow-hidden flex flex-col
        border border-slate-200 shadow-sm transition-all duration-200
        ${selected ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:shadow-md hover:border-indigo-300'}
      `}>
        {/* Professional Header */}
        <div className="bg-indigo-600 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Server size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Compute</span>
          </div>
          <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-indigo-400/50" />
             <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          </div>
        </div>

        {/* Main Body */}
        <div className="p-4 bg-white">
           <div className="text-sm font-bold text-slate-900 font-heading leading-tight mb-1">
             {data.label}
           </div>
           <div className="text-xs text-slate-500 font-medium truncate">
             Standard Instance • 4vCPU
           </div>
        </div>

        {/* Technical Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
           <span className="flex items-center gap-1.5">
             <Activity size={10} />
             <span>ID: {Math.floor(Math.random() * 9999)}</span>
           </span>
           <span className="uppercase text-slate-500 font-bold">Linux</span>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-indigo-600 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-indigo-600 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-indigo-600 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-indigo-600 !border-2 !border-white transition-all hover:scale-150" />
    </div>
  );
});