import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Cloud, ArrowUpRight } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ExternalServiceNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const logo = data.logo as string | undefined;

  return (
    <div className={`
      relative group min-w-[160px]
      transition-all duration-200 ease-in-out
      ${selected ? 'scale-105' : 'hover:scale-105'}
    `}>
      {/* Dashed Border Glow */}
      <div className={`
        absolute -inset-1 rounded-xl border-2 border-dashed border-slate-400 opacity-0 transition-opacity duration-300
        ${selected ? 'opacity-100 border-sky-400' : 'group-hover:opacity-30'}
      `} />

      {/* Main Container */}
      <div className={`
        relative flex items-center gap-3 p-3 rounded-lg
        bg-slate-50 border-2 border-dashed
        ${selected ? 'border-sky-500 bg-sky-50' : 'border-slate-300 hover:border-slate-400'}
        transition-colors
      `}>
        {/* Icon */}
        <div className={`
            flex items-center justify-center w-10 h-10 rounded-full border bg-white p-2 overflow-hidden
            ${selected ? 'border-sky-200 text-sky-500' : 'border-slate-200 text-slate-500'}
        `}>
          {logo ? (
             <img src={logo} alt="" className="w-full h-full object-contain" />
          ) : (
             <Cloud size={20} />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
               {logo ? 'Service' : 'External'}
            </span>
            <ArrowUpRight size={10} className="text-slate-300" />
          </div>
          <span className="text-sm font-bold text-slate-700 font-heading leading-tight line-clamp-1">
            {data.label}
          </span>
        </div>
      </div>

      {/* Handles */}
      <Handle id="top" type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white" />
      <Handle id="left" type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white" />
      <Handle id="right" type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white" />
    </div>
  );
});