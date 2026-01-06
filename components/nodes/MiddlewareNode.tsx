import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Layers } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const MiddlewareNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const techLogo = data.techLogo as string;
  const mwType = data.middlewareType || 'Middleware';

  return (
    <div className={`relative w-64 h-16 group transition-all duration-200 ${selected ? 'scale-[1.02]' : ''}`}>
      <div className={`
        relative w-full h-full bg-white rounded-lg overflow-hidden flex items-center
        border border-slate-200 shadow-sm transition-all duration-200
        ${selected ? 'ring-2 ring-amber-500 shadow-xl' : 'hover:shadow-md hover:border-amber-300'}
      `}>
        {/* Side Indicator */}
        <div className="w-1.5 h-full bg-amber-500 shrink-0" />

        <div className="flex-1 flex items-center px-4 gap-3">
             <div className="w-8 h-8 flex items-center justify-center shrink-0">
                {techLogo ? (
                    <img src={techLogo} alt="" className="w-full h-full object-contain" />
                ) : (
                    <div className="bg-amber-100 p-1.5 rounded text-amber-600">
                        <Layers size={16} />
                    </div>
                )}
             </div>
             
             <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 font-heading truncate">
                    {data.label}
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {mwType}
                </div>
             </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-amber-500 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-amber-500 !border-2 !border-white transition-all hover:scale-150" />
    </div>
  );
});