import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { User } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ClientNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const isPhone = data.clientType === 'phone';
  const size = isPhone ? "w-32 h-48" : "w-48 h-32";
  return (
    <div className={`relative ${size} group`}>
      <div className="absolute inset-0 bg-slate-900 rounded-xl translate-x-1 translate-y-1" />
      <div className={`
        relative h-full w-full bg-white border-2 border-slate-900 rounded-xl p-4 flex flex-col items-center justify-center text-center
        ${selected ? 'border-sky-500 ring-2 ring-sky-500/20' : ''}
      `}>
        <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg border border-sky-100 mb-3">
          <User size={24} />
        </div>
        <div className="text-sm font-bold text-slate-900 font-heading leading-tight">{data.label}</div>
        <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">Client</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
    </div>
  );
});