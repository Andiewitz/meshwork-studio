import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { GitCommit, Terminal, Settings2 } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { Handle, Position, useReactFlow } = ReactFlow;

export const PipelineNode = memo(({ id, data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  const logo = data.logo as string;
  const subType = (data.subType || 'Step') as string;
  const techName = (data.techName as string) || 'Config';
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
      relative min-w-[180px] max-w-[300px] h-auto rounded-lg border-2 transition-all duration-200
      bg-slate-950 group
      ${selected ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-slate-700 hover:border-slate-500'}
    `}>
      {/* Header: Definition Type */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-900/50 rounded-t-lg">
        <div className="flex items-center gap-1.5">
            <Terminal size={10} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {subType}
            </span>
        </div>
        <Settings2 size={10} className="text-slate-600" />
      </div>

      {/* Body: Tool & Name */}
      <div className="p-3 flex items-start gap-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 shadow-sm shrink-0">
             {logo ? (
                 <img src={logo} alt="" className="w-5 h-5 object-contain" />
             ) : (
                 <GitCommit size={18} className="text-slate-400" />
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
                    className="w-full bg-slate-900/50 text-white font-bold font-mono text-sm p-1 rounded resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 border-none overflow-hidden mb-1"
                    rows={Math.max(1, Math.ceil(data.label.length / 25))}
                />
             ) : (
                <div className="text-sm font-bold text-white font-mono leading-tight mb-1.5 whitespace-normal break-words">
                    {data.label}
                </div>
             )}
             {/* Tech Tag */}
             <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                <span className="text-[9px] font-medium text-slate-400 truncate max-w-[120px]">
                    {techName}
                </span>
             </div>
        </div>
      </div>

      {/* Handles - Standard Layout */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2 !h-2 !bg-slate-950 !border-2 !border-slate-600 hover:!bg-indigo-500 transition-all !-left-[5px]" 
      />
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2 !h-2 !bg-slate-950 !border-2 !border-slate-600 hover:!bg-indigo-500 transition-all !-right-[5px]" 
      />
    </div>
  );
});