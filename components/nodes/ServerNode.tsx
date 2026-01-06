import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { Server } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position, useReactFlow } = ReactFlow;

export const ServerNode = memo(({ id, data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
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
      relative min-w-[14rem] max-w-[20rem] h-auto min-h-[8rem] rounded-2xl border-2 transition-all duration-300
      bg-slate-950 group flex flex-col justify-between
      ${selected 
        ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
        : 'border-indigo-500/30 hover:border-indigo-500/60'}
    `}>
      {/* HUD Label */}
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-950 border z-10
        ${selected ? 'text-indigo-400 border-indigo-500' : 'text-indigo-500/70 border-indigo-500/30'}
      `}>
        Compute
      </div>

      <div className="p-5 flex flex-col h-full gap-4">
        <div className="flex items-start justify-between">
            <div className={`p-2 rounded-lg border bg-indigo-500/10 shrink-0 ${selected ? 'border-indigo-500/50 text-indigo-400' : 'border-indigo-500/20 text-indigo-500/60'}`}>
                {logo ? (
                    <img src={logo} alt="" className="w-5 h-5 object-contain" />
                ) : (
                    <Server size={20} />
                )}
            </div>
            <div className="flex gap-1 pt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
        </div>
        
        <div className="min-w-0">
            {data.isEditing ? (
                 <textarea
                    autoFocus
                    defaultValue={data.label}
                    onChange={onLabelChange}
                    onBlur={onBlur}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onBlur(); } }}
                    className="w-full bg-slate-900/50 text-white font-bold font-heading text-lg p-1 rounded resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 border-none overflow-hidden"
                    rows={Math.max(1, Math.ceil(data.label.length / 20))}
                    style={{ minHeight: '1.75rem' }}
                />
            ) : (
                <div className="text-lg font-bold text-white font-heading leading-tight whitespace-normal break-words cursor-text" onDoubleClick={(e) => e.stopPropagation()}>
                    {data.label}
                </div>
            )}
            <div className="text-[10px] text-slate-500 font-mono mt-1">
                4vCPU • 16GB
            </div>
        </div>
      </div>

      {/* Inputs (Left) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-indigo-500 hover:!bg-indigo-500 hover:!scale-125 transition-all !-left-[7px] z-50" 
      />
      
      {/* Outputs (Right) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-slate-950 !border-2 !border-indigo-500 hover:!bg-indigo-500 hover:!scale-125 transition-all !-right-[7px] z-50" 
      />
    </div>
  );
});