import React, { memo, useMemo } from 'react';
import * as ReactFlow from 'reactflow';
import { Network, Shield, Maximize2, Box } from 'lucide-react';
import { FlowNodeData } from '../../types';

// We need to import the node types for the preview render
import { ServerNode } from './ServerNode';
import { DatabaseNode } from './DatabaseNode';
import { ServiceNode } from './ServiceNode';
import { ClientNode } from './ClientNode';
import { QueueNode } from './QueueNode';
import { LoadBalancerNode } from './LoadBalancerNode';
import { MiddlewareNode } from './MiddlewareNode';
import { JunctionNode } from './JunctionNode';
import { ExternalServiceNode } from './ExternalServiceNode';

const { NodeResizer, ReactFlowProvider, Background } = ReactFlow;
// Handle namespace import compatibility
// @ts-ignore
const ReactFlowComponent = ReactFlow.default || ReactFlow;

const previewNodeTypes = {
  server: ServerNode,
  database: DatabaseNode,
  service: ServiceNode,
  client: ClientNode,
  queue: QueueNode,
  loadBalancer: LoadBalancerNode,
  middleware: MiddlewareNode,
  junction: JunctionNode,
  external: ExternalServiceNode,
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
          // Force downscaling: High padding and low maxZoom ensure it looks like a "map"
          fitViewOptions={{ padding: 0.4, minZoom: 0.05, maxZoom: 0.6 }}
          minZoom={0.05}
          maxZoom={0.6}
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
          <Background gap={40} size={2} color={isSubnet ? '#94a3b8' : '#6366f1'} style={{ opacity: 0.1 }} />
        </ReactFlowComponent>
      </ReactFlowProvider>
    );
  }, [data.subFlow, hasSubFlow, isSubnet]);
  
  return (
    <div className="relative w-full h-full min-w-[300px] min-h-[200px] group">
      <NodeResizer 
        color={selected ? "#6366f1" : "transparent"}
        isVisible={selected} 
        minWidth={300} 
        minHeight={200} 
        lineStyle={{ border: '1px solid #6366f1' }}
        handleStyle={{ width: 8, height: 8, border: '1px solid #6366f1', borderRadius: '2px', backgroundColor: '#0f172a' }}
      />
      
      {/* Container Frame */}
      <div 
        className={`
          w-full h-full rounded-2xl border-[2px] overflow-hidden flex flex-col
          ${selected ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : (isSubnet ? 'border-dashed border-slate-700 bg-slate-900/40' : 'border-slate-800 bg-slate-900/60')}
          transition-all duration-200 backdrop-blur-sm
        `}
      >
        {/* Header Bar */}
        <div className={`
           px-3 py-2 flex items-center justify-between border-b shrink-0
           ${isSubnet ? 'border-slate-800 bg-slate-900/50' : 'border-slate-800 bg-slate-900'}
        `}>
           <div className="flex items-center gap-2">
              {isSubnet ? <Network size={14} className="text-slate-500" /> : <Shield size={14} className="text-indigo-500" />}
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isSubnet ? 'text-slate-400' : 'text-indigo-400'}`}>
                {label}
              </span>
           </div>
           
           {/* Expand Hint */}
           <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
             <Maximize2 size={10} />
             <span>Double Click</span>
           </div>
        </div>

        {/* Content Area / Mini Canvas */}
        <div className="flex-1 relative bg-slate-950/30 overflow-hidden">
            {hasSubFlow ? (
                <div className="absolute inset-0 w-full h-full opacity-80 hover:opacity-100 transition-opacity grayscale-[0.3] hover:grayscale-0">
                    {previewFlow}
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 gap-3">
                    <div className="p-3 rounded-full border-2 border-dashed border-slate-800 bg-slate-900/50">
                        <Box size={24} strokeWidth={1.5} className="opacity-50" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Empty Container</span>
                </div>
            )}
            
            {/* Overlay to catch events if pointer-events isn't enough, and provide a 'glass' look */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-b-xl" />
        </div>
      </div>
    </div>
  );
});