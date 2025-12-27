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
  const btnClass = "p-2 rounded-lg border-2 border-transparent transition-all text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-900";
  const activeBtnClass = "p-2 rounded-lg bg-violet-600 text-white border-2 border-violet-600 shadow-[2px_2px_0_0_#000000] transition-all transform -translate-y-0.5";

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-2 rounded-2xl bg-white border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a]">
        
        {/* Tools Section */}
        <div className="flex items-center gap-1 pr-3 border-r-2 border-slate-100">
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
        <div className="flex items-center gap-1 px-3 border-r-2 border-slate-100">
          <button 
            onClick={onToggleLibrary}
            className={`
                flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-all border-2
                ${isLibraryOpen 
                    ? 'bg-violet-600 text-white border-violet-800 shadow-[2px_2px_0_0_#000000] -translate-y-0.5' 
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-900 hover:shadow-[2px_2px_0_0_#cbd5e1] hover:-translate-y-0.5'}
            `}
          >
            <Plus size={16} strokeWidth={3} />
            <span>Add Node</span>
          </button>
        </div>

        {/* History Section */}
        <div className="flex items-center gap-1 px-3 border-r-2 border-slate-100">
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
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-white text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 shadow-lg">
          Click a line to define protocol
        </div>
      )}
    </div>
  );
};