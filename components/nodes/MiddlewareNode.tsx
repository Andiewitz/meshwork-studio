import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { Layers } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position, useReactFlow } = ReactFlow;

export const MiddlewareNode = memo(({ id, data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  // Support both generic 'logo' (from library) and specific 'techLogo' (from modal)
  const logo = (data.logo || data.techLogo) as string;
  const mwType = (data.middlewareType as string) || 'Middleware';
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
      relative min-w-[13rem] max-w-[20rem] h-auto min-h-[4rem] rounded-xl border-2 transition-all duration-300
      bg-slate-950 group
      ${selected 
        ? 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)]' 
        : 'border-fuchsia-500/30 hover:border-fuchsia-500/60'}
    `}>
      {/* Side Pill Label */}
      <div className={`
        absolute -top-2.5 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-950 border z-10
        ${selected ? 'text-fuchsia-400 border-fuchsia-500' : 'text-fuchsia-500/70 border-fuchsia-500/30'}
      `}>
        {mwType}
      </div>

      <div className="flex items-center h-full px-3 py-3 gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded bg-fuchsia-500/10 shrink-0">
             {logo ? (
                 <img src={logo} alt="" className="w-5 h-5 object-contain" />
             ) : (
                 <Layers size={16} className="text-fuchsia-500" />
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
                    className="w-full bg-slate-900/50 text-white font-bold font-heading text-xs p-1 rounded resize-none focus:outline-none focus:ring-1 focus:ring-fuchsia-500 border-none overflow-hidden"
                    rows={Math.max(1, Math.ceil(data.label.length / 25))}
                />
             ) : (
                <div className="text-xs font-bold text-white font-heading whitespace-normal break-words leading-tight">{data.label}</div>
             )}
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