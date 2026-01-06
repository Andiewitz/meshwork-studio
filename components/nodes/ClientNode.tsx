import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { User, Smartphone, Monitor } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ClientNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const isPhone = data.clientType === 'phone';
  const size = isPhone ? "w-32 h-48" : "w-48 h-32";
  const Icon = isPhone ? Smartphone : Monitor;

  return (
    <div className={`relative ${size} group transition-all duration-200 ${selected ? 'scale-[1.02]' : ''}`}>
      <div className={`
        relative w-full h-full bg-white rounded-lg overflow-hidden flex flex-col
        border border-slate-200 shadow-sm transition-all duration-200
        ${selected ? 'ring-2 ring-sky-500 shadow-xl' : 'hover:shadow-md hover:border-sky-300'}
      `}>
        <div className="bg-slate-100 h-6 flex items-center justify-center border-b border-slate-200">
             <div className="w-12 h-1 bg-slate-300 rounded-full" />
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <Icon size={32} className="text-sky-500 mb-2 opacity-80" strokeWidth={1.5} />
            <div className="text-sm font-bold text-slate-900 font-heading leading-tight">
              {data.label}
            </div>
            <span className="mt-1 text-[9px] font-bold text-slate-400 uppercase">
               User Endpoint
            </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-sky-500 !border-2 !border-white transition-all hover:scale-150" />
    </div>
  );
});