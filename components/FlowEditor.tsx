
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
import { ChevronLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { CanvasNav, CanvasTool } from './CanvasNav';
import { NodeLibrary } from './NodeLibrary';
import { LoadingScreen } from './LoadingScreen';
import { Button, Tooltip } from '@mui/material';

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

const FlowEditorContent: React.FC = () => {
  const navigate = useNavigate();
  const { flowId } = useParams();
  const { zoomIn, zoomOut } = useReactFlow();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  // Interaction State
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'unsaved'>('idle');
  const [flowTitle, setFlowTitle] = useState('Workspace');

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
      // 1. Hand tool allows dragging nodes and panning canvas with left-click
      nodesDraggable: isPanning,
      panOnDrag: isPanning ? true : [1, 2], // Only left-click pan in Pan mode
      
      // 2. Select tool allows marquee selection
      selectionOnDrag: activeTool === 'select' && !isSpacePressed,
      
      // Visual feedback
      cursor: isSpacePressed ? 'grabbing' : isPanning ? 'grab' : activeTool === 'connect' ? 'crosshair' : 'default',
      
      // Defaults
      elementsSelectable: true,
      zoomOnScroll: true,
      panOnScroll: true,
    };
  }, [activeTool, isSpacePressed]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2 } }, eds));
    setSaveStatus('unsaved');
  }, [setEdges]);

  const onDrop = useCallback((event: React.DragEvent) => {
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
        logo: event.dataTransfer.getData('application/logo')
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setSaveStatus('unsaved');
  }, [reactFlowInstance, setNodes]);

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

  if (isLoading) return <LoadingScreen message="Unlocking Secure Workspace..." />;

  return (
    <div 
      className="w-full h-screen bg-zinc-900 flex flex-col overflow-hidden"
      style={{ cursor: interactionProps.cursor }}
    >
      <header className="h-16 flex-none bg-white border-b-2 border-slate-900 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Tooltip title="Exit to Dashboard">
            <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-slate-100 transition-all border-2 border-transparent hover:border-slate-200">
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
          </Tooltip>
          <div>
            <h1 className="text-lg font-bold font-heading text-slate-900 leading-none">{flowTitle}</h1>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              {saveStatus === 'saved' ? 'Project Synced' : saveStatus === 'unsaved' ? 'Unsaved Edits' : 'Persisting Changes...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              padding: '8px 24px',
              '&:hover': {
                backgroundColor: '#4338ca',
                boxShadow: '2px 2px 0 0 #000',
                transform: 'translate(2px, 2px)'
              }
            }}
          >
            Save Mesh
          </Button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <NodeLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
        
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
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          selectionMode={SelectionMode.Partial}
          {...interactionProps}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={20} color="#3f3f46" />
          
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
