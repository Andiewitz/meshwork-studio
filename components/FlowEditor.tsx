import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import 'reactflow/dist/style.css';
import type {
  Node,
  Edge,
  Connection,
  NodeTypes,
  ReactFlowInstance,
} from 'reactflow';
import { ChevronLeft, Save, Download, Cpu, Infinity as InfinityIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { CanvasNav, CanvasTool } from './CanvasNav';
import { NodeLibrary } from './NodeLibrary';
import { LoadingScreen } from './LoadingScreen';
import { ContextMenu } from './ContextMenu';
import { Button, Tooltip, IconButton, AppBar, Toolbar, Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { CanvasLayer } from '../types';

// Modals
import { AsciiExportModal } from './modals/AsciiExportModal';
import { EditNodeModal } from './modals/EditNodeModal';
import { DatabaseSelectorModal, DatabaseOption } from './modals/DatabaseSelectorModal';
import { ClientConfigModal } from './modals/ClientConfigModal';
import { CacheSelectorModal, CacheOption } from './modals/CacheSelectorModal';
import { ConnectionSettingsModal, ConnectionOption } from './modals/ConnectionSettingsModal';

// Custom Nodes
import { ServerNode } from './nodes/ServerNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { QueueNode } from './nodes/QueueNode';
import { ServiceNode } from './nodes/ServiceNode';
import { LoadBalancerNode } from './nodes/LoadBalancerNode';
import { MiddlewareNode } from './nodes/MiddlewareNode';
import { ClientNode } from './nodes/ClientNode';
import { JunctionNode } from './nodes/JunctionNode';
import { ExternalServiceNode } from './nodes/ExternalServiceNode';
import { BoundaryNode } from './nodes/BoundaryNode';

const nodeTypes: NodeTypes = {
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
};

interface MenuState {
  x: number;
  y: number;
  type: 'node' | 'edge' | 'selection' | null;
  id?: string;
}

const FlowEditorContent: React.FC = () => {
  const navigate = useNavigate();
  const { flowId } = useParams();
  const { zoomIn, zoomOut } = useReactFlow();
  
  // Layer State
  const [activeLayer, setActiveLayer] = useState<CanvasLayer>('backend');
  
  // Storage for both canvases
  const [backendNodes, setBackendNodes] = useState<Node[]>([]);
  const [backendEdges, setBackendEdges] = useState<Edge[]>([]);
  const [devopsNodes, setDevopsNodes] = useState<Node[]>([]);
  const [devopsEdges, setDevopsEdges] = useState<Edge[]>([]);

  // Current Active State for React Flow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  
  // Interaction State
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'unsaved'>('idle');
  const [flowTitle, setFlowTitle] = useState('Workspace');
  
  // Modal States
  const [isAsciiModalOpen, setIsAsciiModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCacheModalOpen, setIsCacheModalOpen] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  
  // Selection Data for Modals
  const [selectedNodeData, setSelectedNodeData] = useState<{ id: string, data: any } | null>(null);
  const [selectedEdgeData, setSelectedEdgeData] = useState<{ id: string, label?: string } | null>(null);

  // Context Menu State
  const [menu, setMenu] = useState<MenuState | null>(null);

  // AI is enabled strictly via the environment variable
  const isAiEnabled = !!process.env.API_KEY;

  // Load Flow Data
  useEffect(() => {
    const loadData = async () => {
      if (!flowId) return;
      try {
        const data = await flowService.getFlow(flowId);
        if (data) {
          setBackendNodes(data.nodes || []);
          setBackendEdges(data.edges || []);
          setDevopsNodes(data.devopsNodes || []);
          setDevopsEdges(data.devopsEdges || []);
          
          // Set initial view
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
          
          setFlowTitle(data.title);
          setSaveStatus('saved');
        }
      } catch (err) {
        console.error("Load failed", err);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    loadData();
  }, [flowId]);

  // Sync current hook state to specific layer buffers when they change
  useEffect(() => {
    if (activeLayer === 'backend') {
      setBackendNodes(nodes);
      setBackendEdges(edges);
    } else {
      setDevopsNodes(nodes);
      setDevopsEdges(edges);
    }
  }, [nodes, edges, activeLayer]);

  // Handle layer switching
  const handleLayerChange = (event: React.MouseEvent<HTMLElement>, newLayer: CanvasLayer | null) => {
    if (newLayer !== null && newLayer !== activeLayer) {
      if (activeLayer === 'backend') {
        setBackendNodes(nodes);
        setBackendEdges(edges);
      } else {
        setDevopsNodes(nodes);
        setDevopsEdges(edges);
      }

      setActiveLayer(newLayer);
      
      if (newLayer === 'backend') {
        setNodes(backendNodes);
        setEdges(backendEdges);
      } else {
        setNodes(devopsNodes);
        setEdges(devopsEdges);
      }
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') { e.preventDefault(); setIsSpacePressed(true); }
      switch (e.key.toLowerCase()) {
        case 'v': setActiveTool('select'); break;
        case 'h': setActiveTool('pan'); break;
        case 'c': setActiveTool('connect'); break;
      }
    };
    const handleUp = (e: KeyboardEvent) => { if (e.code === 'Space') setIsSpacePressed(false); };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  const interactionProps = useMemo(() => {
    const isPanning = isSpacePressed || activeTool === 'pan';
    return {
      nodesDraggable: isPanning,
      panOnDrag: isPanning ? true : [1, 2],
      selectionOnDrag: activeTool === 'select' && !isSpacePressed,
      cursor: isSpacePressed ? 'grabbing' : isPanning ? 'grab' : activeTool === 'connect' ? 'crosshair' : 'default',
      elementsSelectable: true,
      zoomOnScroll: true,
      panOnScroll: true,
    };
  }, [activeTool, isSpacePressed]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2, stroke: '#94a3b8' } }, eds));
    setSaveStatus('unsaved');
  }, [setEdges]);

  // --- Double Click Handlers ---
  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeData({ id: node.id, data: node.data });
    if (node.type === 'database') setIsDbModalOpen(true);
    else if (node.type === 'client') setIsClientModalOpen(true);
    else if (node.type === 'middleware' && node.data.middlewareType === 'cache') setIsCacheModalOpen(true);
    else setIsEditModalOpen(true);
    setMenu(null);
  }, []);

  const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeData({ id: edge.id, label: edge.label as string });
    setIsConnectionModalOpen(true);
    setMenu(null);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY, type: 'node', id: node.id });
  }, [setMenu]);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY, type: 'edge', id: edge.id });
  }, [setMenu]);

  const onSelectionContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    if (nodes.some(n => n.selected) || edges.some(e => e.selected)) {
      setMenu({ x: event.clientX, y: event.clientY, type: 'selection' });
    }
  }, [setMenu, nodes, edges]);

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  // --- Actions ---
  const deleteSelected = useCallback(() => {
    if (menu?.type === 'node' && menu.id) {
      setNodes((nds) => nds.filter((n) => n.id !== menu.id));
      setEdges((eds) => eds.filter((e) => e.source !== menu.id && e.target !== menu.id));
    } else if (menu?.type === 'edge' && menu.id) {
      setEdges((eds) => eds.filter((e) => e.id !== menu.id));
    } else if (menu?.type === 'selection') {
      const nodeIds = nodes.filter((n) => n.selected).map((n) => n.id);
      setNodes((nds) => nds.filter((n) => !n.selected));
      setEdges((eds) => eds.filter((e) => !e.selected && !nodeIds.includes(e.source) && !nodeIds.includes(e.target)));
    }
    setMenu(null);
    setSaveStatus('unsaved');
  }, [menu, nodes, edges, setNodes, setEdges]);

  const duplicateSelected = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected || n.id === menu?.id);
    if (selectedNodes.length === 0) return;
    const newNodes = selectedNodes.map((node) => ({
      ...node,
      id: `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: false,
    }));
    setNodes((nds) => nds.concat(newNodes));
    setMenu(null);
    setSaveStatus('unsaved');
  }, [menu, nodes, setNodes]);

  const alignToGrid = useCallback(() => {
    const snapSize = 20;
    setNodes((nds) => nds.map((node) => {
      if (node.selected || node.id === menu?.id) {
        return { ...node, position: { x: Math.round(node.position.x / snapSize) * snapSize, y: Math.round(node.position.y / snapSize) * snapSize } };
      }
      return node;
    }));
    setMenu(null);
    setSaveStatus('unsaved');
  }, [menu, setNodes]);

  const severConnections = useCallback(() => {
    if (menu?.type === 'node' && menu.id) {
      setEdges((eds) => eds.filter(e => e.source !== menu.id && e.target !== menu.id));
      setMenu(null);
      setSaveStatus('unsaved');
    }
  }, [menu, setEdges]);

  const splitEdge = useCallback(() => {
    if (menu?.type === 'edge' && menu.id) {
      const edge = edges.find(e => e.id === menu.id);
      if (edge) {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
          const midX = (source.position.x + target.position.x) / 2;
          const midY = (source.position.y + target.position.y) / 2;
          const junctionId = `junction-${Date.now()}`;
          const junctionNode: Node = { id: junctionId, type: 'junction', position: { x: midX, y: midY }, data: { label: '' } };
          const edge1 = { ...edge, id: `${edge.source}-${junctionId}`, target: junctionId };
          const edge2 = { ...edge, id: `${junctionId}-${edge.target}`, source: junctionId, sourceHandle: undefined, targetHandle: edge.targetHandle };
          setNodes(nds => nds.concat(junctionNode));
          setEdges(eds => eds.filter(e => e.id !== menu.id).concat([edge1, edge2]));
          setSaveStatus('unsaved');
        }
      }
      setMenu(null);
    }
  }, [menu, edges, nodes, setNodes, setEdges]);

  const handleEditTrigger = useCallback(() => {
    if (menu?.type === 'node' && menu.id) {
      const node = nodes.find(n => n.id === menu.id);
      if (node) onNodeDoubleClick({} as any, node);
    }
  }, [menu, nodes, onNodeDoubleClick]);

  // --- Modal Saves ---
  const handleNodeSave = (newLabel: string) => {
    if (selectedNodeData) {
      setNodes((nds) => nds.map((n) => (n.id === selectedNodeData.id ? { ...n, data: { ...n.data, label: newLabel } } : n)));
      setSaveStatus('unsaved');
    }
  };

  const handleDbSelect = (db: DatabaseOption) => {
    if (selectedNodeData) {
      setNodes((nds) => nds.map((n) => (n.id === selectedNodeData.id ? { ...n, data: { ...n.data, label: db.name, dbType: db.id, dbName: db.name, dbCategory: db.category, dbLogo: db.logo } } : n)));
      setSaveStatus('unsaved');
    }
  };

  const handleClientSave = (label: string, type: string) => {
    if (selectedNodeData) {
      setNodes((nds) => nds.map((n) => (n.id === selectedNodeData.id ? { ...n, data: { ...n.data, label, clientType: type } } : n)));
      setSaveStatus('unsaved');
    }
  };

  const handleCacheSelect = (tech: CacheOption) => {
    if (selectedNodeData) {
      setNodes((nds) => nds.map((n) => (n.id === selectedNodeData.id ? { ...n, data: { ...n.data, label: tech.name, techName: tech.name, techLogo: tech.logo } } : n)));
      setSaveStatus('unsaved');
    }
  };

  const handleConnectionSave = (proto: ConnectionOption) => {
    if (selectedEdgeData) {
      setEdges((eds) => eds.map((e) => (e.id === selectedEdgeData.id ? { ...e, label: proto.label, style: { stroke: proto.color, strokeWidth: 2 }, animated: proto.id !== 'JDBC', data: { ...e.data, protocol: proto.id } } : e)));
      setSaveStatus('unsaved');
    }
  };

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !rfInstance) return;
    const position = rfInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: event.dataTransfer.getData('application/label') || `New ${type}`,
        logo: event.dataTransfer.getData('application/logo'),
        middlewareType: event.dataTransfer.getData('application/middlewareType'),
        clientType: event.dataTransfer.getData('application/clientType'),
        subType: event.dataTransfer.getData('application/subType'),
        layer: activeLayer
      },
      style: type === 'boundary' ? { width: 400, height: 300 } : undefined
    };
    setNodes((nds) => nds.concat(newNode));
    setSaveStatus('unsaved');
  }, [rfInstance, setNodes, activeLayer]);

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []);

  const handleSave = async () => {
    if (!flowId) return;
    setSaveStatus('saving');
    try {
      const finalBackendNodes = activeLayer === 'backend' ? nodes : backendNodes;
      const finalBackendEdges = activeLayer === 'backend' ? edges : backendEdges;
      const finalDevopsNodes = activeLayer === 'devops' ? nodes : devopsNodes;
      const finalDevopsEdges = activeLayer === 'devops' ? edges : devopsEdges;

      await flowService.saveFlow(flowId, finalBackendNodes, finalBackendEdges, finalDevopsNodes, finalDevopsEdges);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
    }
  };

  const selectionCount = useMemo(() => nodes.filter(n => n.selected).length + edges.filter(e => e.selected).length, [nodes, edges]);

  if (isLoading) return <LoadingScreen message="Loading Canvas..." />;

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden" style={{ cursor: interactionProps.cursor }}>
      {/* Dark Mode Header */}
      <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #1e293b', zIndex: 50 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 }, minHeight: '64px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Exit to Dashboard">
              <IconButton onClick={() => navigate('/')} sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc', bgcolor: '#1e293b' } }}>
                <ChevronLeft size={24} strokeWidth={2.5} />
              </IconButton>
            </Tooltip>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', lineHeight: 1, fontFamily: 'Plus Jakarta Sans', fontSize: '1.1rem' }}>
                {flowTitle}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748b', mt: 0.5, display: 'block' }}>
                {saveStatus === 'saved' ? 'Synced' : saveStatus === 'unsaved' ? 'Unsaved' : 'Saving...'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={activeLayer}
              exclusive
              onChange={handleLayerChange}
              sx={{
                bgcolor: '#020617',
                p: 0.5,
                borderRadius: '12px',
                border: '1px solid #1e293b',
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: '#64748b',
                  '&.Mui-selected': {
                    bgcolor: '#1e293b',
                    color: '#f8fafc',
                    '&:hover': { bgcolor: '#334155' }
                  }
                }
              }}
            >
              <ToggleButton value="backend">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Cpu size={14} />
                  Logic
                </Box>
              </ToggleButton>
              <ToggleButton value="devops">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfinityIcon size={14} />
                  Ops
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button 
              variant="contained"
              disableElevation
              onClick={handleSave}
              startIcon={<Save size={16} />}
              sx={{
                backgroundColor: '#6366f1',
                borderRadius: '10px',
                fontWeight: 700,
                textTransform: 'none',
                px: 2.5,
                py: 0.8,
                '&:hover': { backgroundColor: '#4f46e5' }
              }}
            >
              Save
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <div className="flex-1 relative overflow-hidden bg-slate-950">
        <NodeLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} activeLayer={activeLayer} />
        
        {/* Modals remain the same structure but update internal styles if needed in their own files */}
        <AsciiExportModal isOpen={isAsciiModalOpen} onClose={() => setIsAsciiModalOpen(false)} nodes={nodes} edges={edges} />
        <EditNodeModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialLabel={selectedNodeData?.data?.label || ''} onSave={handleNodeSave} />
        <DatabaseSelectorModal isOpen={isDbModalOpen} onClose={() => setIsDbModalOpen(false)} onSelect={handleDbSelect} />
        <ClientConfigModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} initialLabel={selectedNodeData?.data?.label || ''} initialType={selectedNodeData?.data?.clientType || 'desktop'} onSave={handleClientSave} />
        <CacheSelectorModal isOpen={isCacheModalOpen} onClose={() => setIsCacheModalOpen(false)} onSelect={handleCacheSelect} />
        <ConnectionSettingsModal isOpen={isConnectionModalOpen} onClose={() => setIsConnectionModalOpen(false)} currentLabel={selectedEdgeData?.label} onSave={handleConnectionSave} />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => { onNodesChange(changes); setSaveStatus('unsaved'); }}
          onEdgesChange={(changes) => { onEdgesChange(changes); setSaveStatus('unsaved'); }}
          onConnect={onConnect}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onSelectionContextMenu={onSelectionContextMenu}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          selectionMode={SelectionMode.Partial}
          {...interactionProps}
          fitView
        >
          {/* Dark Dots Background */}
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#334155" />
          
          {menu && (
            <ContextMenu
              top={menu.y}
              left={menu.x}
              nodeType={menu.type || undefined}
              selectionCount={selectionCount}
              onDelete={deleteSelected}
              onDuplicate={duplicateSelected}
              onAlign={alignToGrid}
              onEdit={handleEditTrigger}
              onSeverConnections={severConnections}
              onSplitConnection={splitEdge}
              onClose={() => setMenu(null)}
            />
          )}
          <CanvasNav zoomIn={zoomIn} zoomOut={zoomOut} activeTool={activeTool} setActiveTool={setActiveTool} onToggleLibrary={() => setIsLibraryOpen(!isLibraryOpen)} isLibraryOpen={isLibraryOpen} />
        </ReactFlow>
      </div>
    </div>
  );
};

export const FlowEditor: React.FC = () => (
  <ReactFlowProvider>
    <FlowEditorContent />
  </ReactFlowProvider>
);