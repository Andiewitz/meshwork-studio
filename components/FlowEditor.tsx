import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
  Panel,
  ConnectionMode,
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
import { ChevronLeft, Save, Cloud, Check, Clock, AlertTriangle, Menu, Download, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { useAuth } from '../hooks/useAuth';
import { CanvasNav, CanvasTool } from './CanvasNav';
import { NodeLibrary } from './NodeLibrary';
import { FlowNodeData } from '../types';
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
  const { zoomIn, zoomOut } = useReactFlow();
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Editor State
  const [flowTitle, setFlowTitle] = useState('Untitled Mesh');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'unsaved'>('idle');
  const [showGui, setShowGui] = useState(true);
  
  // Refs for Auto-Save
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const isDirtyRef = useRef(false);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  
  // Tool State
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');

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

  // Memoize node types
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

  // Sync Refs
  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
    if (!isLoading) {
        isDirtyRef.current = true;
        if (saveStatus === 'saved' || saveStatus === 'idle') {
            setSaveStatus('unsaved');
        }
    }
  }, [nodes, edges, isLoading]);

  // Load Flow Data
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
          // Reset dirty flag after load
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

  // Save Function
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

  // Auto-Save Interval (30s)
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

  // Handle Node Right Click (Context Menu)
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      
      // Check if we are right-clicking a selected node while others are also selected
      const selectedNodes = nodes.filter(n => n.selected);
      const isMultiSelection = selectedNodes.length > 1 && node.selected;

      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
        type: isMultiSelection ? 'selection' : (node.type || 'node'),
        data: { selectedCount: isMultiSelection ? selectedNodes.length : 1 }
      });
    },
    [setMenu, nodes]
  );

  // Handle Edge Right Click (Context Menu)
  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      event.stopPropagation();
      const canvasPosition = reactFlowInstance?.screenToFlowPosition({
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
    [reactFlowInstance]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  // Menu Handlers
  const handleMenuDelete = useCallback(() => {
    if (menu) {
      if (menu.type === 'edge') {
          setEdges((eds) => eds.filter((e) => e.id !== menu.id));
      } else if (menu.type === 'selection') {
          // Delete all selected nodes and their connections
          const selectedNodeIds = nodes.filter(n => n.selected).map(n => n.id);
          setNodes((nds) => nds.filter((n) => !n.selected));
          setEdges((eds) => eds.filter((e) => !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)));
      } else {
          // Delete single node
          setNodes((nds) => nds.filter((n) => n.id !== menu.id));
          setEdges((eds) => eds.filter((e) => e.source !== menu.id && e.target !== menu.id));
      }
      setMenu(null);
    }
  }, [menu, setNodes, setEdges, nodes]);

  const handleMenuAlign = useCallback(() => {
    const GRID_SIZE = 20; // Define grid size
    
    setNodes((nds) => nds.map((node) => {
      // Align selected nodes (or the single context menu node if nothing selected)
      if (node.selected || (menu && node.id === menu.id)) {
        return {
          ...node,
          position: {
            x: Math.round(node.position.x / GRID_SIZE) * GRID_SIZE,
            y: Math.round(node.position.y / GRID_SIZE) * GRID_SIZE,
          },
        };
      }
      return node;
    }));
    setMenu(null);
  }, [menu, setNodes]);

  const handleMenuDuplicate = useCallback(() => {
    if (menu && menu.type !== 'edge') {
      if (menu.type === 'selection') {
          // Duplicate all selected nodes
          const selectedNodes = nodes.filter(n => n.selected);
          const newNodes: Node[] = selectedNodes.map(node => ({
              ...node,
              id: `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              position: {
                  x: node.position.x + 50,
                  y: node.position.y + 50,
              },
              data: {
                  ...node.data,
                  label: `${node.data.label} (Copy)`,
              },
              selected: true
          }));
          // Deselect originals, add new ones
          setNodes(nds => [...nds.map(n => ({...n, selected: false})), ...newNodes]);

      } else {
          const nodeToDuplicate = nodes.find((n) => n.id === menu.id);
          if (nodeToDuplicate) {
            const newNode: Node = {
              ...nodeToDuplicate,
              id: `${nodeToDuplicate.type}-${Date.now()}`,
              position: {
                x: nodeToDuplicate.position.x + 50,
                y: nodeToDuplicate.position.y + 50,
              },
              data: {
                ...nodeToDuplicate.data,
                label: `${nodeToDuplicate.data.label} (Copy)`,
              },
              selected: true,
            };
            setNodes((nds) => [...nds.map(n => ({...n, selected: false})), newNode]);
          }
      }
      setMenu(null);
    }
  }, [menu, nodes, setNodes]);

  const handleMenuSeverConnections = useCallback(() => {
    if (menu && menu.type !== 'edge') {
      setEdges((eds) => eds.filter((e) => e.source !== menu.id && e.target !== menu.id));
      setMenu(null);
    }
  }, [menu, setEdges]);

  const handleSplitConnection = useCallback(() => {
      if (menu && menu.type === 'edge' && menu.data && menu.data.splitPosition) {
          const edgeId = menu.id;
          const { source, target, splitPosition } = menu.data;
          
          const junctionId = `junction-${Date.now()}`;
          const junctionNode: Node = {
              id: junctionId,
              type: 'junction',
              position: { 
                  x: splitPosition.x - 8,
                  y: splitPosition.y - 8 
              },
              data: { label: '' }
          };

          setEdges((eds) => eds.filter(e => e.id !== edgeId));
          setNodes((nds) => nds.concat(junctionNode));
          
          setTimeout(() => {
            setEdges((eds) => [
                ...eds,
                { 
                    id: `e-${source}-${junctionId}`, 
                    source: source, 
                    target: junctionId, 
                    animated: true, 
                    style: { stroke: '#71717a', strokeWidth: 2 },
                    type: 'default' 
                },
                { 
                    id: `e-${junctionId}-${target}`, 
                    source: junctionId, 
                    target: target, 
                    animated: true, 
                    style: { stroke: '#71717a', strokeWidth: 2 },
                    type: 'default' 
                }
            ]);
          }, 10);
          
          setMenu(null);
      }
  }, [menu, setNodes, setEdges]);

  const handleMenuEdit = useCallback(() => {
    if (menu && menu.type !== 'edge' && menu.type !== 'selection') {
      const node = nodes.find((n) => n.id === menu.id);
      if (node) {
        if (node.type === 'database') {
          setConfiguringNodeId(node.id);
          setDbModalOpen(true);
        } else if (node.type === 'client') {
            setConfiguringClientId(node.id);
            setConfiguringClientData({
                label: node.data.label,
                type: (node.data.clientType as string) || 'desktop'
            });
            setClientModalOpen(true);
        } else if (node.type === 'middleware' && node.data.middlewareType === 'cache') {
            setConfiguringCacheId(node.id);
            setCacheModalOpen(true);
        } else {
          setEditingNodeId(node.id);
          setEditingLabel(node.data.label);
          setEditModalOpen(true);
        }
      }
      setMenu(null);
    }
  }, [menu, nodes]);

  const handleEditSave = (newLabel: string) => {
    if (editingNodeId) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === editingNodeId) {
            return { ...node, data: { ...node.data, label: newLabel } };
          }
          return node;
        })
      );
    }
  };

  const handleClientSave = (label: string, type: string) => {
      if (configuringClientId) {
          setNodes((nds) => nds.map((node) => {
              if (node.id === configuringClientId) {
                  return { ...node, data: { ...node.data, label, clientType: type } };
              }
              return node;
          }));
      }
  };

  const handleCacheSelect = (tech: CacheOption) => {
    if (configuringCacheId) {
        setNodes((nds) => nds.map((node) => {
            if (node.id === configuringCacheId) {
                return { ...node, data: { ...node.data, label: node.data.label === 'Cache / CDN' || node.data.label === 'New middleware' ? tech.name : node.data.label, techName: tech.name, techLogo: tech.logo } };
            }
            return node;
        }));
    }
  };

  const onNodeDoubleClick: NodeMouseHandler = useCallback((event, node) => {
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

  const handleDbSelect = (dbInfo: DatabaseOption) => {
    if (!configuringNodeId) return;
    setNodes((nds) => nds.map((node) => {
      if (node.id === configuringNodeId) {
        return { ...node, data: { ...node.data, dbType: dbInfo.id, dbName: dbInfo.name, dbCategory: dbInfo.category, dbLogo: dbInfo.logo, label: node.data.label === 'New database' ? dbInfo.name : node.data.label } };
      }
      return node;
    }));
  };

  const handleConnectionSave = (protocol: ConnectionOption) => {
    if (!editingEdgeId) return;
    setEdges((eds) => eds.map((edge) => {
      if (edge.id === editingEdgeId) {
        return { ...edge, label: protocol.id, style: { ...edge.style, stroke: protocol.color, strokeWidth: 2 }, labelStyle: { fill: '#9ca3af', fontSize: 11, fontWeight: 500, fontFamily: 'monospace', letterSpacing: '0.05em' }, labelBgStyle: { fill: '#18181b', fillOpacity: 0.9, stroke: '#27272a', strokeWidth: 1 }, labelBgPadding: [6, 4], labelBgBorderRadius: 6, animated: protocol.id !== 'JDBC' && protocol.id !== 'TCP', data: { ...edge.data, protocol: protocol.id } };
      }
      return edge;
    }));
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const mwType = event.dataTransfer.getData('application/middlewareType');
      const label = event.dataTransfer.getData('application/label');
      const logo = event.dataTransfer.getData('application/logo');

      if (typeof type === 'undefined' || !type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
            label: label || `New ${type}`, 
            middlewareType: mwType || undefined, 
            clientType: type === 'client' ? 'desktop' : undefined,
            logo: logo || undefined
        },
      };

      setNodes((nds) => nds.concat(newNode));
      
      if (type === 'database') {
        setTimeout(() => { setConfiguringNodeId(newNode.id); setDbModalOpen(true); }, 100);
      } else if (type === 'client') {
          setTimeout(() => { setConfiguringClientId(newNode.id); setConfiguringClientData({ label: newNode.data.label, type: 'desktop' }); setClientModalOpen(true); }, 100);
      } else if (type === 'middleware' && mwType === 'cache') {
          setTimeout(() => { setConfiguringCacheId(newNode.id); setCacheModalOpen(true); }, 100);
      }
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="w-full h-screen bg-zinc-900 flex flex-col overflow-hidden">
      
      {/* Top Navbar */}
      {showGui && (
        <div className="h-16 flex-none bg-white border-b-2 border-slate-900 px-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/')}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                    title="Back to Dashboard"
                >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                
                <div className="h-6 w-px bg-slate-200"></div>

                <div>
                    <h1 className="text-lg font-bold font-heading text-slate-900 leading-none">{flowTitle}</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                        {saveStatus === 'saving' && <span className="text-blue-500 flex items-center gap-1"><Clock size={10} /> Saving...</span>}
                        {saveStatus === 'saved' && <span className="text-emerald-500 flex items-center gap-1"><Check size={10} /> Saved {lastSaved && `at ${lastSaved.toLocaleTimeString()}`}</span>}
                        {saveStatus === 'unsaved' && <span className="text-amber-500 flex items-center gap-1"><AlertTriangle size={10} /> Unsaved Changes</span>}
                        {saveStatus === 'error' && <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={10} /> Save Error</span>}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Auto-save: 30s</span>
                </div>
                
                <button 
                    onClick={handleSave}
                    disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2
                        ${saveStatus === 'unsaved' || saveStatus === 'error'
                            ? 'bg-indigo-600 text-white border-slate-900 shadow-[3px_3px_0_0_#0f172a] hover:-translate-y-0.5' 
                            : 'bg-white text-slate-400 border-slate-200 cursor-default'}
                    `}
                >
                    <Save size={16} />
                    <span>Save</span>
                </button>
            </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 relative overflow-hidden" ref={reactFlowWrapper}>
        
        {/* Toggle GUI Button */}
        <div className="absolute bottom-6 right-6 z-50">
          <button
            onClick={() => setShowGui(!showGui)}
            className={`
              p-3 rounded-xl border-2 transition-all duration-200 font-bold flex items-center gap-2
              ${showGui 
                ? 'bg-white text-slate-900 border-slate-900 shadow-[4px_4px_0_0_#0f172a] hover:shadow-[2px_2px_0_0_#0f172a] hover:translate-y-[2px]' 
                : 'bg-indigo-600 text-white border-white shadow-[4px_4px_0_0_#000] hover:bg-indigo-700 opacity-90 hover:opacity-100'}
            `}
            title={showGui ? "Hide Interface" : "Show Interface"}
          >
            {showGui ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Loading State Overlay */}
        {isLoading && (
            <div className="absolute inset-0 z-[60] bg-zinc-900 animate-out fade-out duration-500 fill-mode-forwards pointer-events-none">
                <LoadingScreen message="Initializing Environment..." fullScreen={false} />
            </div>
        )}

        {/* Node Library Sidebar */}
        {showGui && <NodeLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />}
        
        {/* Modals */}
        <DatabaseSelectorModal 
            isOpen={dbModalOpen}
            onClose={() => setDbModalOpen(false)}
            onSelect={handleDbSelect}
        />
        
        <ClientConfigModal 
            isOpen={clientModalOpen}
            onClose={() => setClientModalOpen(false)}
            initialLabel={configuringClientData.label}
            initialType={configuringClientData.type}
            onSave={handleClientSave}
        />

        <CacheSelectorModal
            isOpen={cacheModalOpen}
            onClose={() => setCacheModalOpen(false)}
            onSelect={handleCacheSelect}
        />
        
        <EditNodeModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            initialLabel={editingLabel}
            onSave={handleEditSave}
        />

        <ConnectionSettingsModal
            isOpen={connectionModalOpen}
            onClose={() => setConnectionModalOpen(false)}
            onSave={handleConnectionSave}
            currentLabel={editingEdgeId ? edges.find(e => e.id === editingEdgeId)?.label as string : null}
        />

        {/* Context Menu */}
        {menu && (
            <ContextMenu
            top={menu.top}
            left={menu.left}
            onEdit={handleMenuEdit}
            onDuplicate={handleMenuDuplicate}
            onSeverConnections={handleMenuSeverConnections}
            onSplitConnection={handleSplitConnection}
            onAlign={handleMenuAlign}
            onDelete={handleMenuDelete}
            onClose={() => setMenu(null)}
            nodeType={menu.type}
            selectionCount={menu.data?.selectedCount}
            />
        )}

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
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={2}
            className="touch-none"
            connectionRadius={50}
            connectionMode={ConnectionMode.Loose}
            panOnDrag={activeTool === 'pan'}
            selectionOnDrag={activeTool === 'select'}
            elementsSelectable={activeTool !== 'pan'}
        >
            <Background 
            color="#ffffff" 
            variant={BackgroundVariant.Dots} 
            gap={24} 
            size={1.5}
            className="opacity-50" 
            />
            
            {showGui && (
              <CanvasNav 
                zoomIn={zoomIn} 
                zoomOut={zoomOut}
                onUndo={() => console.log('undo')}
                onRedo={() => console.log('redo')}
                onToggleLibrary={() => setIsLibraryOpen(!isLibraryOpen)}
                isLibraryOpen={isLibraryOpen}
                activeTool={activeTool}
                setActiveTool={setActiveTool}
              />
            )}
        </ReactFlow>
      </div>
    </div>
  );
};

export const FlowEditor: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowEditorContent />
    </ReactFlowProvider>
  );
};