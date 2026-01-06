import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { Globe, Cloud } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position } = ReactFlow;

export const ExternalServiceNode = memo(({ data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  const logo = data.logo as string;
  
  return (
    <div className={`
      relative w-52 h-24 rounded-2xl border-2 border-dashed transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.3)]' 
        : 'border-slate-700 hover:border-slate-500'}
    `}>
      <div className="absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border border-slate-700 text-slate-400">
        External
      </div>

      <div className="flex items-center h-full px-5 gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
            {logo ? (
                <img src={logo} alt="" className="w-6 h-6 object-contain" />
            ) : (
                <Globe size={20} className="text-slate-500" />
            )}
        </div>
        <div className="min-w-0">
            <div className="text-sm font-bold text-slate-200 font-heading truncate">{data.label}</div>
            <div className="text-[10px] text-slate-600 font-bold uppercase">SaaS / API</div>
        </div>
      </div>

      {/* Inputs (Left) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-slate-500 hover:!bg-slate-500 hover:!scale-125 transition-all !-left-[7px] z-50" 
      />
      
      {/* Outputs (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-slate-500 hover:!bg-slate-500 hover:!scale-125 transition-all !-right-[7px] z-50" 
      />
    </div>
  );
});