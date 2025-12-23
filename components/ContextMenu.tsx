import React, { useEffect, useRef } from 'react';
import { Edit, Copy, Trash2, Unplug, Split } from 'lucide-react';

interface ContextMenuProps {
  top: number;
  left: number;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onSeverConnections?: () => void;
  onSplitConnection?: () => void;
  onDelete: () => void;
  onClose: () => void;
  nodeType?: string; // 'edge' or node type
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ 
  top, 
  left, 
  onEdit, 
  onDuplicate, 
  onSeverConnections,
  onSplitConnection,
  onDelete, 
  onClose,
  nodeType 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const isEdge = nodeType === 'edge';

  return (
    <div
      ref={menuRef}
      style={{ top, left }}
      className="fixed z-[100] w-56 bg-white border-2 border-slate-900 rounded-xl shadow-[6px_6px_0_0_#0f172a] py-1.5 animate-in fade-in zoom-in-95 duration-100 flex flex-col"
    >
      <div className="px-3 py-1.5 border-b-2 border-slate-100 mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {isEdge ? 'Connection Actions' : `${nodeType || 'Node'} Actions`}
        </span>
      </div>

      {!isEdge && onEdit && (
        <button
          onClick={onEdit}
          className="w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-2 group"
        >
          <Edit size={14} className="text-slate-400 group-hover:text-slate-900" />
          Edit Node
        </button>
      )}

      {!isEdge && onDuplicate && (
        <button
          onClick={onDuplicate}
          className="w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-2 group"
        >
          <Copy size={14} className="text-slate-400 group-hover:text-slate-900" />
          Duplicate
        </button>
      )}

      {!isEdge && onSeverConnections && (
        <button
          onClick={onSeverConnections}
          className="w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2 group"
        >
          <Unplug size={14} className="text-slate-400 group-hover:text-orange-500" />
          Sever Connections
        </button>
      )}

      {isEdge && onSplitConnection && (
        <button
          onClick={onSplitConnection}
          className="w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2 group"
        >
          <Split size={14} className="text-slate-400 group-hover:text-blue-600" />
          Insert Junction / Split
        </button>
      )}

      <div className="my-1 border-t-2 border-slate-100" />

      <button
        onClick={onDelete}
        className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 group"
      >
        <Trash2 size={14} className="text-red-500/70 group-hover:text-red-600" />
        Delete
      </button>
    </div>
  );
};