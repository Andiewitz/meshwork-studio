import React, { memo } from 'react';
import * as ReactFlow from 'reactflow';
import { StickyNote } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { useReactFlow, NodeResizer } = ReactFlow;

export const NoteNode = memo(({ id, data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  const { setNodes } = useReactFlow();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setNodes((nds) => nds.map((n) => {
        if (n.id === id) {
            return { ...n, data: { ...n.data, label: newVal } };
        }
        return n;
    }));
  };

  return (
    <div className={`
        relative min-w-[200px] min-h-[160px] h-full w-full
        rounded-md overflow-hidden flex flex-col shadow-md
        transition-all duration-200
        ${selected ? 'shadow-[0_0_15px_rgba(253,224,71,0.5)] ring-2 ring-yellow-400' : 'shadow-lg'}
        bg-yellow-100
    `}>
       <NodeResizer 
        color={selected ? "#eab308" : "transparent"}
        isVisible={selected} 
        minWidth={200} 
        minHeight={160}
      />

      {/* Header */}
      <div className="bg-yellow-200/50 px-3 py-2 flex items-center gap-2 border-b border-yellow-300/50 shrink-0 text-yellow-800">
         <StickyNote size={14} />
         <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Note</span>
      </div>

      <div className="flex-1 w-full h-full nodrag">
         <textarea 
            className="w-full h-full bg-transparent p-4 text-slate-800 text-sm font-medium leading-relaxed resize-none focus:outline-none placeholder:text-yellow-700/30"
            placeholder="Add documentation here..."
            value={data.label}
            onChange={handleChange}
         />
      </div>
    </div>
  );
});