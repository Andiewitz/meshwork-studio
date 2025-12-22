import React from 'react';
import { 
  MousePointer2, 
  Hand, 
  Undo, 
  Redo, 
  Minus, 
  Plus,
  Link2
} from 'lucide-react';

export type CanvasTool = 'select' | 'pan' | 'connect';

interface CanvasNavProps {
  zoomIn: () => void;
  zoomOut: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onToggleLibrary: () => void;
  isLibraryOpen: boolean;
  activeTool: CanvasTool;
  setActiveTool: (tool: CanvasTool) => void;
}

export const CanvasNav: React.FC<CanvasNavProps> = ({ 
  zoomIn, 
  zoomOut, 
  onUndo, 
  onRedo, 
  onToggleLibrary,
  isLibraryOpen,
  activeTool,
  setActiveTool
}) => {
  const btnClass = "p-2 rounded-lg transition-colors text-slate-600 hover:bg-blue-50 hover:text-blue-600";
  const activeBtnClass = "p-2 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/30 transition-colors";

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl shadow-slate-200/50">
        
        {/* Tools Section */}
        <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
          <button 
            onClick={() => setActiveTool('select')}
            className={activeTool === 'select' ? activeBtnClass : btnClass} 
            title="Select Mode"
          >
            <MousePointer2 size={18} />
          </button>
          <button 
            onClick={() => setActiveTool('pan')}
            className={activeTool === 'pan' ? activeBtnClass : btnClass} 
            title="Pan Mode"
          >
            <Hand size={18} />
          </button>
          <button 
            onClick={() => setActiveTool('connect')}
            className={activeTool === 'connect' ? activeBtnClass : btnClass} 
            title="Define Connections"
          >
            <Link2 size={18} />
          </button>
        </div>

        {/* Add Nodes Button */}
        <div className="flex items-center gap-1 px-3 border-r border-slate-200">
          <button 
            onClick={onToggleLibrary}
            className={`
                flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${isLibraryOpen ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
            `}
          >
            <Plus size={16} />
            <span>Add Node</span>
          </button>
        </div>

        {/* History Section */}
        <div className="flex items-center gap-1 px-3 border-r border-slate-200">
          <button onClick={onUndo} className={btnClass}>
            <Undo size={18} />
          </button>
          <button onClick={onRedo} className={btnClass}>
            <Redo size={18} />
          </button>
        </div>

        {/* Zoom Section */}
        <div className="flex items-center gap-1 pl-2">
          <button onClick={zoomOut} className={btnClass}>
            <Minus size={16} />
          </button>
          <button onClick={zoomIn} className={btnClass}>
            <Plus size={16} />
          </button>
        </div>

      </div>
      
      {/* Tooltip for Define Connection Mode */}
      {activeTool === 'connect' && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
          Click a line to define protocol
        </div>
      )}
    </div>
  );
};