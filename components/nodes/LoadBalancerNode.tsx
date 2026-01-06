import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { Split } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position } = ReactFlow;

export const LoadBalancerNode = memo(({ data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  const logo = data.logo as string;
  
  return (
    <div className={`
      relative w-32 h-32 rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
        : 'border-sky-500/30 hover:border-sky-500/60'}
    `}>
      <div className={`
        absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border
        ${selected ? 'text-sky-400 border-sky-500' : 'text-sky-500/70 border-sky-500/30'}
      `}>
        Router
      </div>

      <div className="flex flex-col items-center justify-center h-full p-3 text-center">
        <div className={`mb-2 ${selected ? 'text-sky-400' : 'text-sky-600'}`}>
             {logo ? (
                 <img src={logo} alt="" className="w-6 h-6 object-contain" />
             ) : (
                 <Split size={24} />
             )}
        </div>
        <div className="text-xs font-bold text-white font-heading leading-tight">
            {data.label}
        </div>
      </div>

      {/* Inputs (Left) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-sky-500 hover:!bg-sky-500 hover:!scale-125 transition-all !-left-[7px] z-50" 
      />
      
      {/* Outputs (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-sky-500 hover:!bg-sky-500 hover:!scale-125 transition-all !-right-[7px] z-50" 
      />
    </div>
  );
});