
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
  ConnectionMode,
  SelectionMode,
} from 'reactflow';
import type {
  Node,
  Edge,
  Connection,
  NodeTypes,
  ReactFlowInstance,
} from 'reactflow';
import { ChevronLeft, Save, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { useAuth } from '../hooks/useAuth';
import { CanvasNav, CanvasTool } from './CanvasNav';
import { NodeLibrary } from './NodeLibrary';
import { ContextMenu } from './ContextMenu';
import { DatabaseSelectorModal } from './modals/DatabaseSelectorModal';
import { ConnectionSettingsModal } from './modals/ConnectionSettingsModal';
import { EditNodeModal } from './modals/EditNodeModal';
import { ClientConfigModal } from './modals/ClientConfigModal';
import { CacheSelectorModal } from './modals/CacheSelectorModal';
import { LoadingScreen } from './LoadingScreen';

// Custom Distributed System Nodes
import { ServerNode } from './nodes/ServerNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { QueueNode } from './nodes/QueueNode';
import { ServiceNode } from './nodes/ServiceNode';
import { LoadBalancerNode } from './nodes/LoadBalancerNode';
import { MiddlewareNode } from './nodes/MiddlewareNode';
import { ClientNode } from './nodes/ClientNode';
import { JunctionNode } from './nodes/JunctionNode';
import { ExternalServiceNode } from './nodes/ExternalServiceNode';

/**
 * Internal component that uses React Flow hooks.
 * Must be rendered inside a ReactFlowProvider.
 */
const FlowEditorContent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { flowId } = useParams();
  const { zoomIn, zoomOut, screenToFlowPosition } = useReactFlow();
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);

  const mousePos = useRef({ x: 0, y: 0 });

  const [flowTitle, setFlowTitle] = useState('Untitled Mesh');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'unsaved'>('idle');
  const [showGui, setShowGui] = useState(true);
  
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const isDirtyRef = useRef(false);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');

  const [menu, setMenu] = useState<{ 
      id: string; 
      top: number; 
      left: number; 
      type: string;
      data?: any; 
  } | null>(null);

  // Modal States
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [configuringNodeId, setConfiguringNodeId] = useState<string | null>(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [configuringClientId, setConfiguringClientId] = useState<string | null>(null);
  const [configuringClientData, setConfiguringClientData] = useState<{label: string, type: string}>({label: '', type: 'desktop'});
  const [cacheModalOpen, setCacheModalOpen] = useState(false);
  const [configuringCacheId, setConfiguringCacheId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [connectionModalOpen, setConnectionModalOpen] = useState(false);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);

  const nodeTypes = useMemo<NodeTypes>(() => ({
    server: ServerNode,
    database: DatabaseNode,
    queue: QueueNode,
    service: ServiceNode,
    loadBalancer: LoadBalancerNode,
    middleware: MiddlewareNode,
    client: ClientNode,
    junction: JunctionNode,
    external: ExternalServiceNode,
  }), []);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
    if (!isLoading) {
        isDirtyRef.current = true;
        if (saveStatus === 'saved' || saveStatus === 'idle') {
            setSaveStatus('unsaved');
        }
    }
  }, [nodes, edges, isLoading, saveStatus]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onSelectionEnd = useCallback(() => {
    if (activeTool !== 'select') return;
    setTimeout(() => {
        const selectedNodes = nodesRef.current.filter(n => n.selected);
        if (selectedNodes.length > 1) {
            setMenu({
                id: 'multi-select',
                top: mousePos.current.y,
                left: mousePos.current.x,
                type: 'selection',
                data: { selectedCount: selectedNodes.length }
            });
        }
    }, 50);
  }, [activeTool]);

  useEffect(() => {
    const loadFlow = async () => {
      if (!flowId) return;
      setIsLoading(true);
      try {
        const flowData = await flowService.getFlow(flowId);
        if (flowData) {
          setNodes(flowData.nodes);
          setEdges(flowData.edges);
          setFlowTitle(flowData.title);
          setLastSaved(new Date(flowData.updatedAt));
          isDirtyRef.current = false;
          setSaveStatus('saved');
        }
      } catch (error) {
        console.error("Error loading flow", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    loadFlow();
  }, [flowId, setNodes, setEdges]);

  const handleSave = useCallback(async () => {
    if (!flowId) return;
    setSaveStatus('saving');
    try {
        await flowService.saveFlow(flowId, nodesRef.current, edgesRef.current);
        setSaveStatus('saved');
        setLastSaved(new Date());
        isDirtyRef.current = false;
    } catch (e) {
        console.error("Save failed", e);
        setSaveStatus('error');
    }
  }, [flowId]);

  useEffect(() => {
    const interval = setInterval(() => {
        if (isDirtyRef.current && flowId && !isLoading) {
            handleSave();
        }
    }, 30000);
    return () => clearInterval(interval);
  }, [flowId, handleSave, isLoading]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ 
        ...params, 
        animated: true, 
        style: { stroke: '#71717a', strokeWidth: 2 },
        type: 'default' 
    }, eds));
  }, [setEdges]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      event.stopPropagation();
      const currentNode = nodes.find(n => n.id === node.id) || node;
      const selectedNodes = nodes.filter(n => n.selected);
      const isMultiSelection = selectedNodes.length > 1 && currentNode.selected;

      setMenu({
        id: currentNode.id,
        top: event.clientY,
        left: event.clientX,
        type: isMultiSelection ? 'selection' : (currentNode.type || 'node'),
        data: { selectedCount: isMultiSelection ? selectedNodes.length : 1 }
      });
    },
    [nodes]
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      event.stopPropagation();
      const canvasPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      setMenu({
        id: edge.id,
        top: event.clientY,
        left: event.clientX,
        type: 'edge',
        data: {
             source: edge.source,
             target: edge.target,
             splitPosition: canvasPosition
        }
      });
    },
    [screenToFlowPosition]
  );

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
      event.preventDefault();
      setMenu(null);
  }, []);

  const onPaneClick = useCallback(() => setMenu(null), []);

  const handleMenuDelete = useCallback(() => {
    if (menu) {
      if (menu.type === 'edge') {
          setEdges((eds) => eds.filter((e) => e.id !== menu.id));
      } else if (menu.type === 'selection') {
          const selectedNodeIds = nodes.filter(n => n.selected).map(n => n.id);
          setNodes((nds) => nds.filter((n) => !n.selected));
          setEdges((eds) => eds.filter((e) => !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)));
      } else {
          setNodes((nds) => nds.filter((n) => n.id !== menu.id));
          setEdges((eds) => eds.filter((e) => e.source !== menu.id && e.target !== menu.id));
      }
      setMenu(null);
    }
  }, [menu, setNodes, setEdges, nodes]);

  const handleMenuAlign = useCallback(() => {
    const GRID_SIZE = 20;
    setNodes((nds) => nds.map((node) => {
      if (node.selected || node.id === menu?.id) {
        return {
          ...node,
          position: {
            x: Math.round(node.position.x / GRID_SIZE) * GRID_SIZE,
            y: Math.round(node.position.y / GRID_SIZE) * GRID_SIZE,
          }
        };
      }
      return node;
    }));
    setMenu(null);
  }, [menu, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');
      const middlewareType = event.dataTransfer.getData('application/middlewareType');
      const clientType = event.dataTransfer.getData('application/clientType');
      const logo = event.dataTransfer.getData('application/logo');

      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: label || `New ${type}`,
          middlewareType,
          clientType,
          logo
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
      if (node.type === 'database') {
          setConfiguringNodeId(node.id);
          setDbModalOpen(true);
      } else if (node.type === 'client') {
          setConfiguringClientId(node.id);
          setConfiguringClientData({ label: node.data.label, type: node.data.clientType || 'desktop' });
          setClientModalOpen(true);
      } else if (node.type === 'middleware' && node.data.middlewareType === 'cache') {
          setConfiguringCacheId(node.id);
          setCacheModalOpen(true);
      } else {
          setEditingNodeId(node.id);
          setEditingLabel(node.data.label);
          setEditModalOpen(true);
      }
  }, []);

  if (isLoading) return <LoadingScreen message="Unrolling Canvas..." />;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Editor Header */}
      <header className="h-16 bg-white border-b-2 border-slate-900 flex items-center justify-between px-6 z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-900 font-heading leading-tight">{flowTitle}</h1>
            <div className="flex items-center gap-2">
               <span className={`text-[10px] font-bold uppercase tracking-widest ${saveStatus === 'saved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Synced' : 'Draft'}
               </span>
               {lastSaved && (
                 <span className="text-[10px] text-slate-400">
                    • Last saved {lastSaved.toLocaleTimeString()}
                 </span>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowGui(!showGui)}
             className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-slate-900 text-sm font-bold hover:bg-slate-50 transition-all shadow-[2px_2px_0_0_#0f172a] active:shadow-none active:translate-y-0.5"
           >
             {showGui ? <EyeOff size={16} /> : <Eye size={16} />}
             <span>{showGui ? 'Hide Tools' : 'Show UI'}</span>
           </button>
           <button 
             onClick={handleSave}
             disabled={saveStatus === 'saving' || saveStatus === 'saved'}
             className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-bold border-2 border-slate-900 hover:bg-indigo-700 transition-all shadow-[2px_2px_0_0_#0f172a] active:shadow-none active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Save size={16} />
             <span>{saveStatus === 'saving' ? 'Syncing...' : 'Save Draft'}</span>
           </button>
        </div>
      </header>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneClick={onPaneClick}
          onPaneContextMenu={onPaneContextMenu}
          onSelectionEnd={onSelectionEnd}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeClick={(_e, edge) => {
              if (activeTool === 'connect') {
                  setEditingEdgeId(edge.id);
                  setConnectionModalOpen(true);
              }
          }}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          selectionMode={SelectionMode.Partial}
          onMouseMove={handleMouseMove}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={20} color="#cbd5e1" />
          
          {showGui && (
            <>
              <CanvasNav 
                zoomIn={zoomIn} 
                zoomOut={zoomOut} 
                onToggleLibrary={() => setIsLibraryOpen(!isLibraryOpen)}
                isLibraryOpen={isLibraryOpen}
                activeTool={activeTool}
                setActiveTool={setActiveTool}
              />
              <NodeLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
            </>
          )}

          {menu && (
            <ContextMenu 
              {...menu} 
              onClose={() => setMenu(null)} 
              onDelete={handleMenuDelete}
              onAlign={handleMenuAlign}
              nodeType={menu.type}
              selectionCount={menu.data?.selectedCount}
              onEdit={() => {
                const node = nodes.find(n => n.id === menu.id);
                if (node) {
                    onNodeDoubleClick({} as any, node);
                }
                setMenu(null);
              }}
              onSplitConnection={() => {
                 if (menu.type === 'edge') {
                    const position = menu.data.splitPosition;
                    const junctionId = `junction-${Date.now()}`;
                    const newNode = {
                        id: junctionId,
                        type: 'junction',
                        position,
                        data: { label: '' }
                    };
                    const oldEdge = edges.find(e => e.id === menu.id);
                    if (oldEdge) {
                        setNodes(nds => [...nds, newNode]);
                        setEdges(eds => [
                            ...eds.filter(e => e.id !== menu.id),
                            { id: `e-${Date.now()}-1`, source: oldEdge.source, target: junctionId, animated: oldEdge.animated },
                            { id: `e-${Date.now()}-2`, source: junctionId, target: oldEdge.target, animated: oldEdge.animated }
                        ]);
                    }
                    setMenu(null);
                 }
              }}
            />
          )}
        </ReactFlow>

        {/* Configuration Modals */}
        <DatabaseSelectorModal 
            isOpen={dbModalOpen} 
            onClose={() => setDbModalOpen(false)}
            onSelect={(db) => {
                setNodes(nds => nds.map(n => n.id === configuringNodeId ? { 
                    ...n, 
                    data: { ...n.data, dbType: db.id, dbName: db.name, dbCategory: db.category, dbLogo: db.logo } 
                } : n));
                setDbModalOpen(false);
            }}
        />

        <ClientConfigModal 
            isOpen={clientModalOpen}
            onClose={() => setClientModalOpen(false)}
            initialLabel={configuringClientData.label}
            initialType={configuringClientData.type}
            onSave={(label, type) => {
                setNodes(nds => nds.map(n => n.id === configuringClientId ? { 
                    ...n, 
                    data: { ...n.data, label, clientType: type } 
                } : n));
                setClientModalOpen(false);
            }}
        />

        <CacheSelectorModal 
            isOpen={cacheModalOpen}
            onClose={() => setCacheModalOpen(false)}
            onSelect={(tech) => {
                setNodes(nds => nds.map(n => n.id === configuringCacheId ? { 
                    ...n, 
                    data: { ...n.data, techName: tech.name, techLogo: tech.logo, label: tech.name } 
                } : n));
                setCacheModalOpen(false);
            }}
        />

        <EditNodeModal 
            isOpen={editModalOpen} 
            onClose={() => setEditModalOpen(false)}
            initialLabel={editingLabel}
            onSave={(newLabel) => {
                setNodes(nds => nds.map(n => n.id === editingNodeId ? { ...n, data: { ...n.data, label: newLabel } } : n));
                setEditModalOpen(false);
            }}
        />

        <ConnectionSettingsModal 
            isOpen={connectionModalOpen}
            onClose={() => setConnectionModalOpen(false)}
            currentLabel={edges.find(e => e.id === editingEdgeId)?.label as string}
            onSave={(protocol) => {
                setEdges(eds => eds.map(e => e.id === editingEdgeId ? { 
                    ...e, 
                    label: protocol.id, 
                    style: { ...e.style, stroke: protocol.color } 
                } : e));
                setConnectionModalOpen(false);
            }}
        />
      </div>
    </div>
  );
};

/**
 * Main FlowEditor export wrapped in the ReactFlowProvider.
 * This is the entry point used in App.tsx.
 */
export const FlowEditor: React.FC = () => (
  <ReactFlowProvider>
    <FlowEditorContent />
  </ReactFlowProvider>
);
