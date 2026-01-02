
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
  NodeMouseHandler,
  EdgeMouseHandler
} from 'reactflow';
import { ChevronLeft, Save, Clock, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { useAuth } from '../hooks/useAuth';
import { CanvasNav, CanvasTool } from './CanvasNav';
import { NodeLibrary } from './NodeLibrary';
import { ContextMenu } from './ContextMenu';
import { DatabaseSelectorModal, DatabaseOption } from './modals/DatabaseSelectorModal';
import { ConnectionSettingsModal, ConnectionOption } from './modals/ConnectionSettingsModal';
import { EditNodeModal } from './modals/EditNodeModal';
import { ClientConfigModal } from './modals/ClientConfigModal';
import { CacheSelectorModal, CacheOption } from './modals/CacheSelectorModal';
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

  // Editor State
  const [flowTitle, setFlowTitle] = useState('Untitled Mesh');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'unsaved'>('idle');
  const [showGui, setShowGui] = useState(true);
  
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const isDirtyRef = useRef(false);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Menu State
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

  // Keyboard Shortcuts for Tools
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.code === 'Space' && !isSpacePressed) {
        setIsSpacePressed(true);
      }
      
      switch (e.key.toLowerCase()) {
        case 'v': setActiveTool('select'); break;
        case 'h': setActiveTool('pan'); break;
        case 'c': setActiveTool('connect'); break;
        case 'l': setIsLibraryOpen(prev => !prev); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed]);

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
          label: event.dataTransfer.getData('application/label') || `New ${type}`,
          middlewareType: event.dataTransfer.getData('application/middlewareType'),
          clientType: event.dataTransfer.getData('application/clientType'),
          logo: event.dataTransfer.getData('application/logo')
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeDoubleClick: NodeMouseHandler = useCallback((_event, node) => {
    if (node.type === 'database') {
      setConfiguringNodeId(node.id);
      setDbModalOpen(true);
    } else if (node.type === 'client') {
        setConfiguringClientId(node.id);
        setConfiguringClientData({ label: node.data.label, type: (node.data.clientType as string) || 'desktop' });
        setClientModalOpen(true);
    } else if (node.type === 'middleware' && node.data.middlewareType === 'cache') {
        setConfiguringCacheId(node.id);
        setCacheModalOpen(true);
    } else if (node.type !== 'junction') {
        setEditingNodeId(node.id);
        setEditingLabel(node.data.label);
        setEditModalOpen(true);
    }
  }, []);

  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    if (activeTool === 'connect') {
      event.stopPropagation();
      setEditingEdgeId(edge.id);
      setConnectionModalOpen(true);
    }
  }, [activeTool]);

  // Derived ReactFlow props based on active tool
  const rfProps = useMemo(() => {
    const isPanning = activeTool === 'pan' || isSpacePressed;
    const isSelecting = activeTool === 'select' && !isSpacePressed;
    const isConnecting = activeTool === 'connect';

    return {
      nodesDraggable: isSelecting,
      elementsSelectable: isSelecting || isConnecting,
      panOnDrag: isPanning ? true : [1, 2], // Left click pan in Pan mode, right click pan always
      selectionOnDrag: isSelecting,
      panOnScroll: true,
      zoomOnScroll: true,
      selectionMode: SelectionMode.Partial,
    };
  }, [activeTool, isSpacePressed]);

  const canvasCursor = useMemo(() => {
    if (isSpacePressed) return 'grabbing';
    switch (activeTool) {
      case 'pan': return 'grab';
      case 'select': return 'default';
      case 'connect': return 'crosshair';
      default: return 'default';
    }
  }, [activeTool, isSpacePressed]);

  return (
    <div 
      className="w-full h-screen bg-zinc-900 flex flex-col overflow-hidden"
      style={{ cursor: canvasCursor }}
      onMouseMove={handleMouseMove}
    >
      {showGui && (
        <header className="h-16 flex-none bg-white border-b-2 border-slate-900 px-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/')}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                    <h1 className="text-lg font-bold font-heading text-slate-900 leading-none">{flowTitle}</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                        {saveStatus === 'saving' && <span className="text-blue-500 flex items-center gap-1"><Clock size={10} /> Saving...</span>}
                        {saveStatus === 'saved' && <span className="text-emerald-500 flex items-center gap-1"><Check size={10} /> Synced</span>}
                        {saveStatus === 'unsaved' && <span className="text-amber-500 flex items-center gap-1"><AlertTriangle size={10} /> Unsaved</span>}
                    </p>
                </div>
            </div>

            <button 
                onClick={handleSave}
                disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2
                    ${saveStatus === 'unsaved' || saveStatus === 'error'
                        ? 'bg-indigo-600 text-white border-slate-900 shadow-[3px_3px_0_0_#0f172a] hover:-translate-y-0.5' 
                        : 'bg-white text-slate-400 border-slate-200'}
                `}
            >
                <Save size={16} />
                <span>Save</span>
            </button>
        </header>
      )}

      <div className="flex-1 relative overflow-hidden" ref={reactFlowWrapper}>
        <div className="absolute bottom-6 right-6 z-50">
          <button
            onClick={() => setShowGui(!showGui)}
            className="p-3 bg-white text-slate-900 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0_0_#0f172a] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#0f172a] transition-all"
          >
            {showGui ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {showGui && <NodeLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />}
        
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onPaneClick={onPaneClick}
            onPaneContextMenu={onPaneContextMenu}
            onEdgeClick={onEdgeClick}
            onSelectionEnd={onSelectionEnd}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            {...rfProps}
            fitView
        >
            <Background variant={BackgroundVariant.Dots} gap={20} color="#3f3f46" />
            {showGui && (
              <CanvasNav 
                zoomIn={zoomIn} 
                zoomOut={zoomOut}
                onToggleLibrary={() => setIsLibraryOpen(!isLibraryOpen)}
                isLibraryOpen={isLibraryOpen}
                activeTool={activeTool}
                setActiveTool={setActiveTool}
              />
            )}

            {menu && (
              <ContextMenu
                {...menu}
                onDelete={handleMenuDelete}
                onAlign={handleMenuAlign}
                onClose={() => setMenu(null)}
                selectionCount={menu.data?.selectedCount}
              />
            )}
        </ReactFlow>

        <DatabaseSelectorModal 
            isOpen={dbModalOpen} 
            onClose={() => setDbModalOpen(false)} 
            onSelect={(db) => {
              setNodes(nds => nds.map(n => n.id === configuringNodeId ? { ...n, data: { ...n.data, dbType: db.id, dbName: db.name, dbCategory: db.category, dbLogo: db.logo, label: db.name } } : n));
            }} 
        />
        <ClientConfigModal 
            isOpen={clientModalOpen} 
            onClose={() => setClientModalOpen(false)} 
            initialLabel={configuringClientData.label} 
            initialType={configuringClientData.type} 
            onSave={(label, type) => {
              setNodes(nds => nds.map(n => n.id === configuringClientId ? { ...n, data: { ...n.data, label, clientType: type } } : n));
            }} 
        />
        <CacheSelectorModal 
            isOpen={cacheModalOpen} 
            onClose={() => setCacheModalOpen(false)} 
            onSelect={(tech) => {
              setNodes(nds => nds.map(n => n.id === configuringCacheId ? { ...n, data: { ...n.data, techName: tech.name, techLogo: tech.logo, label: tech.name } } : n));
            }} 
        />
        <EditNodeModal 
            isOpen={editModalOpen} 
            onClose={() => setEditModalOpen(false)} 
            initialLabel={editingLabel} 
            onSave={(label) => {
              setNodes(nds => nds.map(n => n.id === editingNodeId ? { ...n, data: { ...n.data, label } } : n));
            }} 
        />
        <ConnectionSettingsModal 
            isOpen={connectionModalOpen} 
            onClose={() => setConnectionModalOpen(false)} 
            currentLabel={edges.find(e => e.id === editingEdgeId)?.label as string}
            onSave={(proto) => {
              setEdges(eds => eds.map(e => e.id === editingEdgeId ? { ...e, label: proto.id, style: { ...e.style, stroke: proto.color } } : e));
            }} 
        />
      </div>
    </div>
  );
};

export const FlowEditor: React.FC = () => (
  <ReactFlowProvider>
    <FlowEditorContent />
  </ReactFlowProvider>
);
