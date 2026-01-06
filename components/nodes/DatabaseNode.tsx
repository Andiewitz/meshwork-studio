import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Database } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const DatabaseNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const dbLogo = data.dbLogo as string;
  return (
    <div className="relative w-36 h-36 group">
      <div className="absolute inset-0 bg-slate-900 rounded-xl translate-x-1 translate-y-1" />
      <div className={`
        relative h-full w-full bg-white border-2 border-slate-900 rounded-xl p-4 flex flex-col items-center justify-center text-center
        ${selected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : ''}
      `}>
        <div className="w-12 h-12 mb-3 flex items-center justify-center">
          {dbLogo ? (
            <img src={dbLogo} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
              <Database size={24} />
            </div>
          )}
        </div>
        <div className="text-xs font-bold text-slate-900 font-heading line-clamp-2 leading-tight">
          {data.label}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-white !border-2 !border-slate-900" />
    </div>
  );
});