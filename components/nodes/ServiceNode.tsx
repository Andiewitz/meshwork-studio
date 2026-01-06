import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Cpu } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ServiceNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className="relative w-40 h-24 group">
      <div className="absolute inset-0 bg-slate-900 rounded-xl translate-x-1 translate-y-1" />
      <div className={`
        relative h-full w-full bg-white border-2 border-slate-900 rounded-xl p-4 flex flex-col justify-center gap-2
        ${selected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''}
      `}>
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-emerald-500" />
          <div className="text-xs font-bold text-slate-900 font-heading truncate">{data.label}</div>
        </div>
        <div className="flex gap-1">
          <div className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded border border-emerald-100 uppercase">Service</div>
          <div className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[8px] font-bold rounded border border-slate-100 uppercase tracking-tighter">Healthy</div>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
    </div>
  );
});