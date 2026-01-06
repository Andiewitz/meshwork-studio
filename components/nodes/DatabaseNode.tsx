import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { Database } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position } = ReactFlow;

export const DatabaseNode = memo(({ data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  // Support both generic 'logo' (from library) and specific 'dbLogo' (from modal)
  const logo = (data.logo || data.dbLogo) as string;
  const dbName = (data.dbName as string) || data.label;

  return (
    <div className={`
      relative w-40 h-40 rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
        : 'border-emerald-500/30 hover:border-emerald-500/60'}
    `}>
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border
        ${selected ? 'text-emerald-400 border-emerald-500' : 'text-emerald-500/70 border-emerald-500/30'}
      `}>
        Storage
      </div>

      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className={`
            w-12 h-12 mb-3 rounded-xl border flex items-center justify-center bg-emerald-500/5
            ${selected ? 'border-emerald-500/50' : 'border-emerald-500/20'}
        `}>
            {logo ? (
                <img src={logo} alt="" className="w-8 h-8 object-contain" />
            ) : (
                <Database size={24} className={selected ? 'text-emerald-400' : 'text-emerald-600'} />
            )}
        </div>
        <div className="text-sm font-bold text-white font-heading leading-tight line-clamp-2">
            {dbName}
        </div>
      </div>

      {/* Inputs (Left) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-emerald-500 hover:!bg-emerald-500 hover:!scale-125 transition-all !-left-[7px] z-50" 
      />
      
      {/* Outputs (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-emerald-500 hover:!bg-emerald-500 hover:!scale-125 transition-all !-right-[7px] z-50" 
      />
    </div>
  );
});