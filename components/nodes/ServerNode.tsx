import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Server } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative w-48 h-28 group transition-all`}>
      <div className={`absolute inset-0 bg-slate-900 rounded-xl translate-x-1 translate-y-1`} />
      <div className={`
        relative h-full w-full bg-white border-2 border-slate-900 rounded-xl p-4 flex flex-col justify-between
        ${selected ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
      `}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <Server size={18} />
          </div>
          <div className="text-sm font-bold text-slate-900 truncate font-heading">{data.label}</div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Compute</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
    </div>
  );
});