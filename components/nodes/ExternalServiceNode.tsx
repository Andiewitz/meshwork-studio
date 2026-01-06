import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Globe } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ExternalServiceNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const logo = data.logo as string;
  return (
    <div className="relative w-48 h-24 group">
      <div className="absolute inset-0 bg-slate-200 rounded-xl translate-x-1 translate-y-1" />
      <div className={`
        relative h-full w-full bg-slate-50 border-2 border-dashed border-slate-400 rounded-xl px-4 flex items-center gap-3
        ${selected ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/20' : ''}
      `}>
        <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 overflow-hidden">
          {logo ? (
            <img src={logo} alt="" className="w-full h-full object-contain" />
          ) : (
            <Globe size={18} className="text-slate-300" />
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-600 font-heading truncate">{data.label}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase">External API</div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
    </div>
  );
});