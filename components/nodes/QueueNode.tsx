import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Workflow } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const QueueNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className="relative w-48 h-20 group">
      <div className="absolute inset-0 bg-slate-900 rounded-xl translate-x-1 translate-y-1" />
      <div className={`
        relative h-full w-full bg-white border-2 border-slate-900 rounded-xl px-4 flex items-center gap-3
        ${selected ? 'border-amber-500 ring-2 ring-amber-500/20' : ''}
      `}>
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
          <Workflow size={18} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-900 font-heading uppercase truncate">{data.label}</div>
          <div className="text-[9px] font-mono text-slate-400">BUS://STREAM</div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
    </div>
  );
});