import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
  Panel,
  NodeTypes,
  ReactFlowInstance,
  NodeMouseHandler,
  ConnectionMode,
  EdgeMouseHandler
} from 'reactflow';
import { ChevronLeft } from 'lucide-react';
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

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  
  // Tool State
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');

  // Menu State
  const [menu, setMenu] = useState<{ 
      id: string; 
      top: number; 
      left: number; 
      type: string;
      data?: any; // To store edge data or coordinates for splitting
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
        }
      } catch (error) {
        console.error("Error loading flow", error);
      } finally {
        // Small delay to show off the loading animation even if data is instant local
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    loadFlow();
  }, [flowId, setNodes, setEdges]);

  // Auto-Save (Simple debounce implementation)
  useEffect(() => {
    if (isLoading || !flowId) return;
    
    const saveTimeout = setTimeout(() => {
       flowService.saveFlow(flowId, nodes, edges);
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [nodes, edges, flowId, isLoading]);

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
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
        type: node.type || 'node'
      });
    },
    [setMenu]
  );

  // Handle Edge Right Click (Context Menu)
  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      event.stopPropagation(); // Stop propagation to canvas
      
      // Calculate position for potential split
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

  // Handle Menu Actions
  const handleMenuDelete = useCallback(() => {
    if (menu) {
      if (menu.type === 'edge') {
          setEdges((eds) => eds.filter((e) => e.id !== menu.id));
      } else {
          setNodes((nds) => nds.filter((n) => n.id !== menu.id));
          setEdges((eds) => eds.filter((e) => e.source !== menu.id && e.target !== menu.id));
      }
      setMenu(null);
    }
  }, [menu, setNodes, setEdges]);

  const handleMenuDuplicate = useCallback(() => {
    if (menu && menu.type !== 'edge') {
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
        // Deselect original
        setNodes((nds) => nds.map(n => ({...n, selected: false})).concat(newNode));
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

  // Insert Junction Node Logic
  const handleSplitConnection = useCallback(() => {
      if (menu && menu.type === 'edge' && menu.data && menu.data.splitPosition) {
          const edgeId = menu.id;
          const { source, target, splitPosition } = menu.data;
          
          // 1. Create Junction Node
          const junctionId = `junction-${Date.now()}`;
          const junctionNode: Node = {
              id: junctionId,
              type: 'junction',
              position: { 
                  x: splitPosition.x - 8, // Center it (16px width)
                  y: splitPosition.y - 8 
              },
              data: { label: '' }
          };

          // 2. Remove old edge
          setEdges((eds) => eds.filter(e => e.id !== edgeId));

          // 3. Add new nodes and 2 new edges
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
    if (menu && menu.type !== 'edge') {
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

  // Handle Generic Edit Save
  const handleEditSave = (newLabel: string) => {
    if (editingNodeId) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === editingNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
              },
            };
          }
          return node;
        })
      );
    }
  };

  // Handle Client Save
  const handleClientSave = (label: string, type: string) => {
      if (configuringClientId) {
          setNodes((nds) => nds.map((node) => {
              if (node.id === configuringClientId) {
                  return {
                      ...node,
                      data: {
                          ...node.data,
                          label,
                          clientType: type
                      }
                  };
              }
              return node;
          }));
      }
  };

  // Handle Cache Select
  const handleCacheSelect = (tech: CacheOption) => {
    if (configuringCacheId) {
        setNodes((nds) => nds.map((node) => {
            if (node.id === configuringCacheId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: node.data.label === 'Cache / CDN' || node.data.label === 'New middleware' ? tech.name : node.data.label,
                        techName: tech.name,
                        techLogo: tech.logo
                    }
                };
            }
            return node;
        }));
    }
  };

  // Handle Node Double Click to Open Config
  const onNodeDoubleClick: NodeMouseHandler = useCallback((event, node) => {
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
    } else if (node.type !== 'junction') {
        // Allow double click edit for other nodes too (except junction)
        setEditingNodeId(node.id);
        setEditingLabel(node.data.label);
        setEditModalOpen(true);
    }
  }, []);

  // Handle Edge Click for Definition
  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    if (activeTool === 'connect') {
      event.stopPropagation(); // Prevent selection
      setEditingEdgeId(edge.id);
      setConnectionModalOpen(true);
    }
  }, [activeTool]);

  const handleDbSelect = (dbInfo: DatabaseOption) => {
    if (!configuringNodeId) return;

    setNodes((nds) => nds.map((node) => {
      if (node.id === configuringNodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            dbType: dbInfo.id,
            dbName: dbInfo.name,
            dbCategory: dbInfo.category,
            dbLogo: dbInfo.logo,
            label: node.data.label === 'New database' ? dbInfo.name : node.data.label
          }
        };
      }
      return node;
    }));
  };

  const handleConnectionSave = (protocol: ConnectionOption) => {
    if (!editingEdgeId) return;

    setEdges((eds) => eds.map((edge) => {
      if (edge.id === editingEdgeId) {
        return {
          ...edge,
          label: protocol.id,
          style: { 
            ...edge.style, 
            stroke: protocol.color,
            strokeWidth: 2
          },
          labelStyle: { 
            fill: '#9ca3af', // gray-400
            fontSize: 11, 
            fontWeight: 500,
            fontFamily: 'monospace',
            letterSpacing: '0.05em'
          },
          labelBgStyle: { 
            fill: '#18181b', // zinc-900
            fillOpacity: 0.9,
            stroke: '#27272a', // zinc-800
            strokeWidth: 1,
          },
          labelBgPadding: [6, 4],
          labelBgBorderRadius: 6,
          animated: protocol.id !== 'JDBC' && protocol.id !== 'TCP',
          data: { ...edge.data, protocol: protocol.id }
        };
      }
      return edge;
    }));
  };

  // Drag and Drop Handlers
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

      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

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
            middlewareType: mwType || undefined,
            clientType: type === 'client' ? 'desktop' : undefined 
        },
      };

      setNodes((nds) => nds.concat(newNode));
      
      if (type === 'database') {
        setTimeout(() => {
            setConfiguringNodeId(newNode.id);
            setDbModalOpen(true);
        }, 100);
      } else if (type === 'client') {
          setTimeout(() => {
            setConfiguringClientId(newNode.id);
            setConfiguringClientData({
                label: newNode.data.label,
                type: 'desktop'
            });
            setClientModalOpen(true);
          }, 100);
      } else if (type === 'middleware' && mwType === 'cache') {
          // Optional: Auto open modal for new cache nodes
          setTimeout(() => {
              setConfiguringCacheId(newNode.id);
              setCacheModalOpen(true);
          }, 100);
      }
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="w-full h-screen bg-zinc-900 relative overflow-hidden" ref={reactFlowWrapper}>
      {/* Minimal Exit Button - Top Left */}
      <div className="absolute top-4 left-4 z-50">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-slate-300 hover:text-white rounded-lg backdrop-blur-sm transition-all border border-white/5 shadow-sm group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Exit</span>
        </button>
      </div>

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[60] bg-zinc-900 flex items-center justify-center animate-out fade-out duration-700">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-zinc-800"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-white font-heading font-bold text-lg tracking-wide">Meshwork Studio</span>
                    <span className="text-zinc-500 text-xs font-mono mt-1">Initializing Environment...</span>
                </div>
            </div>
        </div>
      )}

      {/* Prototype Version Label */}
      <div className="absolute top-5 right-6 z-40 pointer-events-none select-none opacity-60">
        <span className="text-xs font-mono text-zinc-500">alpha v1.2.2</span>
      </div>

      {/* Node Library Sidebar */}
      <NodeLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
      
      {/* Database Selector Modal */}
      <DatabaseSelectorModal 
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
        onSelect={handleDbSelect}
      />
      
      {/* Client Configuration Modal */}
      <ClientConfigModal 
        isOpen={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        initialLabel={configuringClientData.label}
        initialType={configuringClientData.type}
        onSave={handleClientSave}
      />

      {/* Cache / CDN Selector Modal */}
      <CacheSelectorModal
        isOpen={cacheModalOpen}
        onClose={() => setCacheModalOpen(false)}
        onSelect={handleCacheSelect}
      />
      
      {/* Generic Edit Node Modal */}
      <EditNodeModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialLabel={editingLabel}
        onSave={handleEditSave}
      />

      {/* Connection Settings Modal */}
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
          onDelete={handleMenuDelete}
          onClose={() => setMenu(null)}
          nodeType={menu.type}
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
      </ReactFlow>
    </div>
  );
};

export const FlowEditor: React.FC = () => {
  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <FlowEditorContent />
      </ReactFlowProvider>
    </div>
  );
};