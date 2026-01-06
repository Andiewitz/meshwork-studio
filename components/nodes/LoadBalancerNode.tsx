import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { Split } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position, useReactFlow } = ReactFlow;

export const LoadBalancerNode = memo(({ id, data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
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
      relative min-w-[8rem] max-w-[12rem] h-auto min-h-[8rem] rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group flex flex-col justify-center
      ${selected 
        ? 'border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
        : 'border-sky-500/30 hover:border-sky-500/60'}
    `}>
      <div className={`
        absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border z-10 whitespace-nowrap
        ${selected ? 'text-sky-400 border-sky-500' : 'text-sky-500/70 border-sky-500/30'}
      `}>
        Router
      </div>

      <div className="flex flex-col items-center justify-center p-4 text-center gap-2">
        <div className={`shrink-0 ${selected ? 'text-sky-400' : 'text-sky-600'}`}>
             {logo ? (
                 <img src={logo} alt="" className="w-6 h-6 object-contain" />
             ) : (
                 <Split size={24} />
             )}
        </div>
        <div className="w-full">
            {data.isEditing ? (
                 <textarea
                    autoFocus
                    defaultValue={data.label}
                    onChange={onLabelChange}
                    onBlur={onBlur}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onBlur(); } }}
                    className="w-full bg-slate-900/50 text-white font-bold font-heading text-xs text-center p-1 rounded resize-none focus:outline-none focus:ring-1 focus:ring-sky-500 border-none overflow-hidden"
                    rows={Math.max(1, Math.ceil(data.label.length / 15))}
                />
            ) : (
                <div className="text-xs font-bold text-white font-heading leading-tight whitespace-normal break-words w-full">
                    {data.label}
                </div>
            )}
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