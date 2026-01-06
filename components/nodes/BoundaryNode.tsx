import React, { memo, useMemo } from 'react';
import * as ReactFlow from 'reactflow';
import { Network, Shield, Maximize2, Box } from 'lucide-react';
import { FlowNodeData } from '../../types';

// We need to import the node types for the preview render
// To avoid circular deps in a real large app we might use a registry, 
// but importing the lightweight components here is fine or we can use default nodes for preview.
import { ServerNode } from './ServerNode';
import { DatabaseNode } from './DatabaseNode';
import { ServiceNode } from './ServiceNode';
import { ClientNode } from './ClientNode';

const { NodeResizer, ReactFlowProvider, Background } = ReactFlow;
const ReactFlowComponent = ReactFlow.default || ReactFlow;

const previewNodeTypes = {
  server: ServerNode,
  database: DatabaseNode,
  service: ServiceNode,
  client: ClientNode,
  // Fallback for others to simple boxes in preview if needed, or import all
};

export const BoundaryNode = memo(({ data, selected, id }: ReactFlow.NodeProps<FlowNodeData>) => {
  const isSubnet = data.subType === 'subnet';
  const label = data.label || (isSubnet ? 'Private Subnet' : 'VPC Network');
  const hasSubFlow = data.subFlow && data.subFlow.nodes && data.subFlow.nodes.length > 0;

  // Memoize preview props to prevent flickering
  const previewFlow = useMemo(() => {
    if (!hasSubFlow) return null;
    return (
      <ReactFlowProvider>
        {/* @ts-ignore */}
        <ReactFlowComponent
          nodes={data.subFlow!.nodes}
          edges={data.subFlow!.edges}
          nodeTypes={previewNodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnDrag={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          preventScrolling={true}
          style={{ pointerEvents: 'none' }} // Pass clicks through to parent
        >
          <Background gap={20} size={1} color={isSubnet ? '#334155' : '#4f46e5'} style={{ opacity: 0.2 }} />
        </ReactFlowComponent>
      </ReactFlowProvider>
    );
  }, [data.subFlow, hasSubFlow, isSubnet]);
  
  return (
    <div className="relative w-full h-full min-w-[200px] min-h-[150px] group">
      <NodeResizer 
        color={selected ? "#6366f1" : "transparent"}
        isVisible={selected} 
        minWidth={250} 
        minHeight={200} 
        lineStyle={{ border: '1px solid #6366f1' }}
        handleStyle={{ width: 8, height: 8, border: '1px solid #6366f1', borderRadius: '2px', backgroundColor: '#0f172a' }}
      />
      
      {/* Container Frame */}
      <div 
        className={`
          w-full h-full rounded-2xl border-[2px] overflow-hidden flex flex-col
          ${selected ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : (isSubnet ? 'border-dashed border-slate-700 bg-slate-900/40' : 'border-slate-800 bg-slate-900/60')}
          transition-all duration-200
        `}
      >
        {/* Header Bar */}
        <div className={`
           px-3 py-2 flex items-center justify-between border-b
           ${isSubnet ? 'border-slate-800 bg-slate-900/50' : 'border-slate-800 bg-slate-900'}
        `}>
           <div className="flex items-center gap-2">
              {isSubnet ? <Network size={14} className="text-slate-500" /> : <Shield size={14} className="text-indigo-500" />}
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isSubnet ? 'text-slate-400' : 'text-indigo-400'}`}>
                {label}
              </span>
           </div>
           
           {/* Expand Hint */}
           <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase bg-slate-800 px-1.5 py-0.5 rounded">
             <Maximize2 size={10} />
             <span>Double Click</span>
           </div>
        </div>

        {/* Content Area / Mini Canvas */}
        <div className="flex-1 relative bg-slate-950/50">
            {hasSubFlow ? (
                <div className="absolute inset-0 w-full h-full transform scale-95 origin-center opacity-80 hover:opacity-100 transition-opacity">
                    {previewFlow}
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 gap-2">
                    <Box size={24} strokeWidth={1.5} className="opacity-50" />
                    <span className="text--[10px] font-bold uppercase tracking-wider opacity-70">Empty Container</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
});