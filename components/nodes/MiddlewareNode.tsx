import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Layers } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const MiddlewareNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const techLogo = data.techLogo as string;
  const mwType = data.middlewareType || 'Middleware';

  return (
    <div className={`
      relative w-52 h-16 rounded-xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)]' 
        : 'border-fuchsia-500/30 hover:border-fuchsia-500/60'}
    `}>
      {/* Side Pill Label */}
      <div className={`
        absolute -top-2.5 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-950 border
        ${selected ? 'text-fuchsia-400 border-fuchsia-500' : 'text-fuchsia-500/70 border-fuchsia-500/30'}
      `}>
        {mwType}
      </div>

      <div className="flex items-center h-full px-3 gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded bg-fuchsia-500/10">
             {techLogo ? (
                 <img src={techLogo} alt="" className="w-5 h-5 object-contain" />
             ) : (
                 <Layers size={16} className="text-fuchsia-500" />
             )}
        </div>
        <div className="min-w-0">
             <div className="text-xs font-bold text-white font-heading truncate">{data.label}</div>
        </div>
      </div>

      {/* Inputs (Left) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-fuchsia-500 hover:!bg-fuchsia-500 hover:!scale-125 transition-all !-left-[7px] z-50" 
      />
      
      {/* Outputs (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-fuchsia-500 hover:!bg-fuchsia-500 hover:!scale-125 transition-all !-right-[7px] z-50" 
      />
    </div>
  );
});