import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Layers } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const MiddlewareNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const techLogo = data.techLogo as string;
  return (
    <div className="relative w-44 h-16 group">
      <div className="absolute inset-0 bg-slate-900 rounded-lg translate-x-1 translate-y-1" />
      <div className={`
        relative h-full w-full bg-white border-2 border-slate-900 rounded-lg px-4 flex items-center gap-3
        ${selected ? 'border-amber-500 ring-2 ring-amber-500/20' : ''}
      `}>
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          {techLogo ? (
            <img src={techLogo} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md border border-slate-100">
              <Layers size={14} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-900 font-heading truncate leading-tight">{data.label}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{String(data.middlewareType || 'logic')}</div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
    </div>
  );
});