import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { Cpu } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position, useReactFlow } = ReactFlow;

export const ServiceNode = memo(({ id, data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  const logo = data.logo as string;
  const { setNodes } = useReactFlow();

  const onLabelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newLabel = e.target.value;
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n)));
  };

  const onBlur = () => {
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, isEditing: false } } : n)));
  };
  
  return (
    <div className={`
      relative min-w-[12rem] max-w-[18rem] h-auto min-h-[7rem] rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
        : 'border-violet-500/30 hover:border-violet-500/60'}
    `}>
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border z-10
        ${selected ? 'text-violet-400 border-violet-500' : 'text-violet-500/70 border-violet-500/30'}
      `}>
        Service
      </div>

      <div className="p-4 h-full flex flex-col justify-center gap-2">
        <div className="flex items-start gap-3">
             <div className="shrink-0 pt-0.5">
                {logo ? (
                    <img src={logo} alt="" className="w-5 h-5 object-contain" />
                ) : (
                    <Cpu size={18} className="text-violet-500" />
                )}
             </div>
             <div className="min-w-0 flex-1">
                {data.isEditing ? (
                    <textarea
                        autoFocus
                        defaultValue={data.label}
                        onChange={onLabelChange}
                        onBlur={onBlur}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onBlur(); } }}
                        className="w-full bg-slate-900/50 text-white font-bold font-heading text-sm p-1 rounded resize-none focus:outline-none focus:ring-1 focus:ring-violet-500 border-none overflow-hidden"
                        rows={Math.max(1, Math.ceil(data.label.length / 20))}
                    />
                ) : (
                    <div className="text-sm font-bold text-white font-heading whitespace-normal break-words leading-tight">
                        {data.label}
                    </div>
                )}
             </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
             <div className="px-1.5 py-0.5 rounded border border-violet-500/30 bg-violet-500/10 text-[9px] font-bold text-violet-300 whitespace-nowrap">
                v1.0
             </div>
             <div className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-[9px] font-bold text-slate-400 whitespace-nowrap">
                HTTP
             </div>
        </div>
      </div>

      {/* Inputs (Left) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-violet-500 hover:!bg-violet-500 hover:!scale-125 transition-all !-left-[7px] z-50" 
      />
      
      {/* Outputs (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-violet-500 hover:!bg-violet-500 hover:!scale-125 transition-all !-right-[7px] z-50" 
      />
    </div>
  );
});