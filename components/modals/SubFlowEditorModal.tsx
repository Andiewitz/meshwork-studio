import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, * as ReactFlowRenderer from 'reactflow';
import { X, Save, Maximize2, Box } from 'lucide-react';
import { NodeLibrary } from '../NodeLibrary';
import { ContextMenu } from '../ContextMenu';

// Reuse existing node types
import { ServerNode } from '../nodes/ServerNode';
import { DatabaseNode } from '../nodes/DatabaseNode';
import { QueueNode } from '../nodes/QueueNode';
import { ServiceNode } from '../nodes/ServiceNode';
import { LoadBalancerNode } from '../nodes/LoadBalancerNode';
import { MiddlewareNode } from '../nodes/MiddlewareNode';
import { ClientNode } from '../nodes/ClientNode';
import { JunctionNode } from '../nodes/JunctionNode';
import { ExternalServiceNode } from '../nodes/ExternalServiceNode';
import { BoundaryNode } from '../nodes/BoundaryNode';
import { PipelineNode } from '../nodes/PipelineNode';

const { Background, addEdge, useNodesState, useEdgesState, ReactFlowProvider, BackgroundVariant, ConnectionMode } = ReactFlowRenderer;

const nodeTypes: ReactFlowRenderer.NodeTypes = {
  server: ServerNode,
  database: DatabaseNode,
  queue: QueueNode,
  service: ServiceNode,
  loadBalancer: LoadBalancerNode,
  middleware: MiddlewareNode,
  client: ClientNode,
  junction: JunctionNode,
  external: ExternalServiceNode,
  boundary: BoundaryNode,
  pipeline: PipelineNode,
};

interface SubFlowEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentNodeId: string;
  parentLabel: string;
  initialNodes: ReactFlowRenderer.Node[];
  initialEdges: ReactFlowRenderer.Edge[];
  onSave: (nodes: ReactFlowRenderer.Node[], edges: ReactFlowRenderer.Edge[]) => void;
}

const GRID_SIZE = 10;

export const SubFlowEditorModal: React.FC<SubFlowEditorModalProps> = ({
  isOpen,
  onClose,
  parentNodeId,
  parentLabel,
  initialNodes,
  initialEdges,
  onSave,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowRenderer.ReactFlowInstance | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; id?: string; type: string } | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true); // Open by default in modal

  // Reset state when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [isOpen, initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback((params: ReactFlowRenderer.Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2, stroke: '#94a3b8' } }, eds));
  }, [setEdges]);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !rfInstance) return;
    
    const position = rfInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    
    const snappedPos = {
        x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(position.y / GRID_SIZE) * GRID_SIZE
    };

    const newNode: ReactFlowRenderer.Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: snappedPos,
      data: { 
        label: event.dataTransfer.getData('application/label') || `New ${type}`,
        logo: event.dataTransfer.getData('application/logo'),
        middlewareType: event.dataTransfer.getData('application/middlewareType'),
        clientType: event.dataTransfer.getData('application/clientType'),
        subType: event.dataTransfer.getData('application/subType'),
        status: event.dataTransfer.getData('application/status'),
      },
      style: type === 'boundary' ? { width: 400, height: 300 } : undefined
    };
    setNodes((nds) => nds.concat(newNode));
  }, [rfInstance, setNodes]);

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: ReactFlowRenderer.Node) => {
    event.preventDefault();
    // Calculate position relative to the modal viewport
    setMenu({ x: event.clientX, y: event.clientY, type: 'node', id: node.id });
  }, []);

  const onPaneClick = useCallback(() => setMenu(null), []);

  const deleteNode = useCallback(() => {
    if (menu?.id) {
      setNodes((nds) => nds.filter((n) => n.id !== menu.id));
      setEdges((eds) => eds.filter((e) => e.source !== menu.id && e.target !== menu.id));
      setMenu(null);
    }
  }, [menu, setNodes, setEdges]);

  const handleSave = () => {
    onSave(nodes, edges);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[95vw] h-[90vh] bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
               <Box className="text-indigo-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                {parentLabel}
                <span className="text-slate-500 text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Container View</span>
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button
               onClick={handleSave}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-900/20"
             >
               <Save size={18} />
               Save & Close
             </button>
             <button 
               onClick={onClose}
               className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
             >
               <X size={24} />
             </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative bg-slate-950 flex">
           
           {/* Reusing Node Library with absolute positioning override or just standard layout */}
           <div className="relative z-10 h-full">
              <NodeLibrary 
                isOpen={isLibraryOpen} 
                onClose={() => setIsLibraryOpen(false)} 
                activeLayer="backend" // Defaulting to backend components for subflows
              />
              {!isLibraryOpen && (
                 <button 
                    onClick={() => setIsLibraryOpen(true)}
                    className="absolute top-4 left-4 p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white shadow-xl z-20"
                 >
                    <Maximize2 size={20} />
                 </button>
              )}
           </div>

           <div className="flex-1 h-full relative">
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onInit={setRfInstance}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onNodeContextMenu={onNodeContextMenu}
                  onPaneClick={onPaneClick}
                  nodeTypes={nodeTypes}
                  connectionMode={ConnectionMode.Loose}
                  fitView
                  snapToGrid
                  snapGrid={[GRID_SIZE, GRID_SIZE]}
                  className="bg-slate-950"
                >
                  <Background variant={BackgroundVariant.Lines} color="#1e293b" gap={GRID_SIZE} />
                </ReactFlow>
              </ReactFlowProvider>

              {menu && (
                <ContextMenu
                  top={menu.y}
                  left={menu.x}
                  onDelete={deleteNode}
                  onClose={() => setMenu(null)}
                  nodeType={menu.type}
                />
              )}
           </div>
        </div>
      </div>
    </div>
  );
};