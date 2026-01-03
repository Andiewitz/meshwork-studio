
import React from 'react';
import { 
  MousePointer2, 
  Hand, 
  Minus, 
  Plus,
  Link2,
  LayoutGrid
} from 'lucide-react';
import { Tooltip } from '@mui/material';

export type CanvasTool = 'select' | 'pan' | 'connect';

interface CanvasNavProps {
  zoomIn: () => void;
  zoomOut: () => void;
  onToggleLibrary: () => void;
  isLibraryOpen: boolean;
  activeTool: CanvasTool;
  setActiveTool: (tool: CanvasTool) => void;
}

export const CanvasNav: React.FC<CanvasNavProps> = ({ 
  zoomIn, 
  zoomOut, 
  onToggleLibrary,
  isLibraryOpen,
  activeTool,
  setActiveTool
}) => {
  const btnBase = "p-2.5 rounded-xl border-2 transition-all flex items-center justify-center relative";
  const inactiveBtn = "bg-white border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900 shadow-sm";
  const activeBtn = "bg-slate-900 border-slate-900 text-white shadow-[4px_4px_0_0_#000] -translate-y-0.5";

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      <div className="flex items-center gap-2 p-2 bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#000]">
        
        {/* Main Tools Group */}
        <div className="flex items-center gap-2 pr-4 border-r-2 border-slate-100">
          <Tooltip title="Select Tool (V) - Movement Locked" placement="top" arrow>
            <button 
              onClick={() => setActiveTool('select')}
              className={`${btnBase} ${activeTool === 'select' ? activeBtn : inactiveBtn}`}
            >
              <MousePointer2 size={18} strokeWidth={2.5} />
            </button>
          </Tooltip>
          
          <Tooltip title="Hand Tool (H) - Drag & Pan" placement="top" arrow>
            <button 
              onClick={() => setActiveTool('pan')}
              className={`${btnBase} ${activeTool === 'pan' ? activeBtn : inactiveBtn}`}
            >
              <Hand size={18} strokeWidth={2.5} />
            </button>
          </Tooltip>

          <Tooltip title="Connect Tool (C)" placement="top" arrow>
            <button 
              onClick={() => setActiveTool('connect')}
              className={`${btnBase} ${activeTool === 'connect' ? activeBtn : inactiveBtn}`}
            >
              <Link2 size={18} strokeWidth={2.5} />
            </button>
          </Tooltip>
        </div>

        {/* Viewport Control Group */}
        <div className="flex items-center gap-2 px-2 border-r-2 border-slate-100">
          <Tooltip title="Zoom Out" placement="top" arrow>
            <button onClick={zoomOut} className={`${btnBase} ${inactiveBtn}`}>
              <Minus size={18} strokeWidth={2.5} />
            </button>
          </Tooltip>
          <Tooltip title="Zoom In" placement="top" arrow>
            <button onClick={zoomIn} className={`${btnBase} ${inactiveBtn}`}>
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </Tooltip>
        </div>

        {/* Global Action Group */}
        <div className="pl-2">
            <button 
            onClick={onToggleLibrary}
            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all
                ${isLibraryOpen 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-[4px_4px_0_0_#000] -translate-y-0.5' 
                    : 'bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-500 hover:text-white hover:shadow-md'}
            `}
            >
            <LayoutGrid size={18} />
            <span>Library</span>
            </button>
        </div>
      </div>
    </div>
  );
};
