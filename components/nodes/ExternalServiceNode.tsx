import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Globe, Cloud } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ExternalServiceNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const logo = data.logo as string;
  
  return (
    <div className={`relative w-56 h-20 group transition-all duration-200 ${selected ? 'scale-[1.02]' : ''}`}>
      <div className={`
        relative w-full h-full bg-slate-50/50 rounded-lg overflow-hidden flex items-center
        border-2 border-dashed border-slate-300 shadow-sm transition-all duration-200
        ${selected ? 'border-sky-500 bg-sky-50/30 shadow-lg' : 'hover:border-slate-400 hover:bg-white'}
      `}>
         <div className="flex-1 flex items-center px-4 gap-3">
             <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 p-1.5 shadow-sm">
                {logo ? (
                    <img src={logo} alt="" className="w-full h-full object-contain" />
                ) : (
                    <Cloud size={20} className="text-slate-400" />
                )}
             </div>
             
             <div className="min-w-0">
                <div className="text-xs font-bold text-slate-700 font-heading truncate">
                    {data.label}
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Globe size={10} />
                    External API
                </div>
             </div>
         </div>
      </div>

      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-slate-400 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-slate-400 !border-2 !border-white transition-all hover:scale-150" />
    </div>
  );
});