
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
import 'reactflow/dist/style.css';
import type {
  Node,
  Edge,
  Connection,
  NodeTypes,
  ReactFlowInstance,
} from 'reactflow';
import { ChevronLeft, Save, Sparkles, Share2, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { CanvasNav, CanvasTool } from './CanvasNav';
import { NodeLibrary } from './NodeLibrary';
import { LoadingScreen } from './LoadingScreen';
import { ContextMenu } from './ContextMenu';
import { Button, Tooltip, IconButton, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { AsciiExportModal } from './modals/AsciiExportModal';

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
  const [isAsciiModalOpen, setIsAsciiModalOpen] = useState(false);

  // Context Menu State
  const [menu, setMenu] = useState<MenuState | null>(null);

  const isAiEnabled = !!process.env.API_KEY;

  // Load Flow Data
  useEffect(() => {
    const loadData = async () => {
      if (!flowId) return;
      try {
        const data = await flowService.getFlow(flowId);
        if (data) {
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
  }, [flowId, setNodes, setEdges]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      
      switch (e.key.toLowerCase()) {
        case 'v': setActiveTool('select'); break;
        case 'h': setActiveTool('pan'); break;
        case 'c': setActiveTool('connect'); break;
      }
    };

    const handleUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacePressed(false);
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  // Strict Interaction Mapping
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
    setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2 } }, eds));
    setSaveStatus('unsaved');
  }, [setEdges]);

  // Context Menu Handlers
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setMenu({
        x: event.clientX,
        y: event.clientY,
        type: 'node',
        id: node.id,
      });
    },
    [setMenu]
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setMenu({
        x: event.clientX,
        y: event.clientY,
        type: 'edge',
        id: edge.id,
      });
    },
    [setMenu]
  );

  const onSelectionContextMenu = useCallback(
    (event: React.MouseEvent, selectedNodes: Node[]) => {
      event.preventDefault();
      if (selectedNodes.length > 0) {
        setMenu({
          x: event.clientX,
          y: event.clientY,
          type: 'selection',
        });
      }
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  // Action Implementations
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
    setNodes((nds) =>
      nds.map((node) => {
        if (node.selected || node.id === menu?.id) {
          return {
            ...node,
            position: {
              x: Math.round(node.position.x / snapSize) * snapSize,
              y: Math.round(node.position.y / snapSize) * snapSize,
            },
          };
        }
        return node;
      })
    );
    setMenu(null);
    setSaveStatus('unsaved');
  }, [menu, setNodes]);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !rfInstance) return;

    const position = rfInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: event.dataTransfer.getData('application/label') || `New ${type}`,
        logo: event.dataTransfer.getData('application/logo')
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setSaveStatus('unsaved');
  }, [rfInstance, setNodes]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleSave = async () => {
    if (!flowId) return;
    setSaveStatus('saving');
    try {
      await flowService.saveFlow(flowId, nodes, edges);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
    }
  };

  const selectionCount = useMemo(() => nodes.filter(n => n.selected).length + edges.filter(e => e.selected).length, [nodes, edges]);

  if (isLoading) return <LoadingScreen message="Unlocking Secure Workspace..." />;

  return (
    <div 
      className="w-full h-screen bg-zinc-900 flex flex-col overflow-hidden"
      style={{ cursor: interactionProps.cursor }}
    >
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '2px solid #0f172a',
          zIndex: 50
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Exit to Dashboard">
              <IconButton 
                onClick={() => navigate('/')} 
                sx={{ 
                  color: 'slate.900', 
                  bgcolor: 'transparent',
                  '&:hover': { bgcolor: 'slate.50' },
                  border: '2px solid transparent'
                }}
              >
                <ChevronLeft size={24} strokeWidth={3} />
              </IconButton>
            </Tooltip>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'slate.900', lineHeight: 1, fontFamily: 'Plus Jakarta Sans' }}>
                {flowTitle}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'slate.400', mt: 0.5, display: 'block' }}>
                {saveStatus === 'saved' ? 'Project Synced' : saveStatus === 'unsaved' ? 'Unsaved Edits' : 'Persisting...'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title={isAiEnabled ? "AI Docs (ASCII Art)" : "API Key Required"}>
              <span>
                <Button 
                  variant="outlined"
                  disabled={!isAiEnabled}
                  onClick={() => setIsAsciiModalOpen(true)}
                  startIcon={<Download size={18} />}
                  sx={{
                    border: '2px solid #0f172a',
                    borderRadius: '12px',
                    fontWeight: 800,
                    color: '#0f172a',
                    px: { xs: 1.5, sm: 2.5 },
                    py: 1,
                    boxShadow: isAiEnabled ? '3px 3px 0 0 #0f172a' : 'none',
                    '&:hover': {
                      border: '2px solid #0f172a',
                      backgroundColor: 'slate.50',
                      boxShadow: '1px 1px 0 0 #0f172a',
                      transform: 'translate(2px, 2px)'
                    },
                    '&.Mui-disabled': {
                      border: '2px solid #e2e8f0',
                      color: '#94a3b8'
                    }
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>AI Docs</Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>AI</Box>
                </Button>
              </span>
            </Tooltip>

            <Button 
              variant="contained"
              disableElevation
              onClick={handleSave}
              startIcon={<Save size={18} />}
              sx={{
                backgroundColor: '#4f46e5',
                boxShadow: '4px 4px 0 0 #000',
                border: '2px solid #000',
                borderRadius: '12px',
                fontWeight: 800,
                px: { xs: 2, sm: 3 },
                py: 1,
                '&:hover': {
                  backgroundColor: '#4338ca',
                  boxShadow: '2px 2px 0 0 #000',
                  transform: 'translate(2px, 2px)'
                }
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Save Mesh</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Save</Box>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <div className="flex-1 relative overflow-hidden">
        <NodeLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
        
        <AsciiExportModal 
          isOpen={isAsciiModalOpen} 
          onClose={() => setIsAsciiModalOpen(false)} 
          nodes={nodes} 
          edges={edges} 
        />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
             onNodesChange(changes);
             setSaveStatus('unsaved');
          }}
          onEdgesChange={(changes) => {
             onEdgesChange(changes);
             setSaveStatus('unsaved');
          }}
          onConnect={onConnect}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onSelectionContextMenu={onSelectionContextMenu}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          selectionMode={SelectionMode.Partial}
          {...interactionProps}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={20} color="#3f3f46" />
          
          {menu && (
            <ContextMenu
              onClick={onPaneClick}
              top={menu.y}
              left={menu.x}
              nodeType={menu.type || undefined}
              selectionCount={selectionCount}
              onDelete={deleteSelected}
              onDuplicate={duplicateSelected}
              onAlign={alignToGrid}
              onClose={() => setMenu(null)}
            />
          )}

          <CanvasNav 
            zoomIn={zoomIn} 
            zoomOut={zoomOut}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            onToggleLibrary={() => setIsLibraryOpen(!isLibraryOpen)}
            isLibraryOpen={isLibraryOpen}
          />
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
