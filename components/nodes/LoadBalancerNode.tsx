import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Split } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const LoadBalancerNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className="relative w-32 h-32 group">
      <div className="absolute inset-0 bg-slate-900 rounded-xl translate-x-1 translate-y-1" />
      <div className={`
        relative h-full w-full bg-white border-2 border-slate-900 rounded-xl p-3 flex flex-col items-center justify-center text-center
        ${selected ? 'border-violet-500 ring-2 ring-violet-500/20' : ''}
      `}>
        <div className="p-2 bg-violet-50 text-violet-600 rounded-lg border border-violet-100 mb-2">
          <Split size={20} />
        </div>
        <div className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{data.label}</div>
      </div>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
    </div>
  );
});