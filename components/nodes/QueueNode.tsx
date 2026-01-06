import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { Workflow } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position, useReactFlow } = ReactFlow;

export const QueueNode = memo(({ id, data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
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
      relative min-w-[14rem] max-w-[24rem] h-auto min-h-[5rem] rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
        : 'border-amber-500/30 hover:border-amber-500/60'}
    `}>
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border z-10
        ${selected ? 'text-amber-400 border-amber-500' : 'text-amber-500/70 border-amber-500/30'}
      `}>
        Message Bus
      </div>

      <div className="h-full flex items-center px-5 py-4 gap-3">
        <div className={`p-1.5 rounded-lg border shrink-0 ${selected ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-amber-500/20 bg-transparent text-amber-500/60'}`}>
            {logo ? (
                <img src={logo} alt="" className="w-5 h-5 object-contain" />
            ) : (
                <Workflow size={18} />
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
                    className="w-full bg-slate-900/50 text-white font-bold font-heading text-sm p-1 rounded resize-none focus:outline-none focus:ring-1 focus:ring-amber-500 border-none overflow-hidden"
                    rows={Math.max(1, Math.ceil(data.label.length / 25))}
                />
             ) : (
                <div className="text-sm font-bold text-white font-heading whitespace-normal break-words leading-tight">{data.label}</div>
             )}
             <div className="text-[10px] text-slate-500 font-mono mt-0.5">Stream: active</div>
        </div>
      </div>

      {/* Inputs (Left) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-amber-500 hover:!bg-amber-500 hover:!scale-125 transition-all !-left-[7px] z-50" 
      />
      
      {/* Outputs (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-amber-500 hover:!bg-amber-500 hover:!scale-125 transition-all !-right-[7px] z-50" 
      />
    </div>
  );
});