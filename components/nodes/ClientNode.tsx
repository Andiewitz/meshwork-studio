import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { User, Smartphone, Monitor } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position } = ReactFlow;

export const ClientNode = memo(({ data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  const isPhone = data.clientType === 'phone';
  // Use min-dimensions but allow growing
  const minDimensions = isPhone ? "min-w-[8rem] min-h-[12rem]" : "min-w-[12rem] min-h-[8rem]";
  const Icon = isPhone ? Smartphone : Monitor;

  return (
    <div className={`
      relative ${minDimensions} max-w-[16rem] rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group flex flex-col
      ${selected 
        ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
        : 'border-rose-500/30 hover:border-rose-500/60'}
    `}>
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border z-10
        ${selected ? 'text-rose-400 border-rose-500' : 'text-rose-500/70 border-rose-500/30'}
      `}>
        Client
      </div>

      <div className="flex flex-col items-center justify-center flex-1 p-5 text-center gap-3">
        <Icon size={32} className={`shrink-0 ${selected ? 'text-rose-400' : 'text-rose-600'}`} strokeWidth={1.5} />
        <div className="text-sm font-bold text-white font-heading whitespace-normal break-words leading-tight w-full">
            {data.label}
        </div>
      </div>

      {/* Inputs (Left) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-rose-500 hover:!bg-rose-500 hover:!scale-125 transition-all !-left-[7px] z-50" 
      />

      {/* Outputs (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-rose-500 hover:!bg-rose-500 hover:!scale-125 transition-all !-right-[7px] z-50" 
      />
    </div>
  );
});