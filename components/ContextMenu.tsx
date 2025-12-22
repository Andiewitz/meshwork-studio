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
      className="fixed z-[100] w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl py-1.5 animate-in fade-in zoom-in-95 duration-100 flex flex-col"
    >
      <div className="px-3 py-1.5 border-b border-zinc-800 mb-1">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          {isEdge ? 'Connection Actions' : `${nodeType || 'Node'} Actions`}
        </span>
      </div>

      {!isEdge && onEdit && (
        <button
          onClick={onEdit}
          className="w-full text-left px-3 py-2 text-sm text-zinc-200 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <Edit size={14} className="text-zinc-400 group-hover:text-white" />
          Edit Node
        </button>
      )}

      {!isEdge && onDuplicate && (
        <button
          onClick={onDuplicate}
          className="w-full text-left px-3 py-2 text-sm text-zinc-200 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <Copy size={14} className="text-zinc-400 group-hover:text-white" />
          Duplicate
        </button>
      )}

      {!isEdge && onSeverConnections && (
        <button
          onClick={onSeverConnections}
          className="w-full text-left px-3 py-2 text-sm text-zinc-200 hover:bg-orange-600/20 hover:text-orange-400 transition-colors flex items-center gap-2 group"
        >
          <Unplug size={14} className="text-zinc-400 group-hover:text-orange-400" />
          Sever Connections
        </button>
      )}

      {isEdge && onSplitConnection && (
        <button
          onClick={onSplitConnection}
          className="w-full text-left px-3 py-2 text-sm text-zinc-200 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <Split size={14} className="text-zinc-400 group-hover:text-white" />
          Insert Junction / Split
        </button>
      )}

      <div className="my-1 border-t border-zinc-800" />

      <button
        onClick={onDelete}
        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 group"
      >
        <Trash2 size={14} className="text-red-400 group-hover:text-red-400" />
        Delete
      </button>
    </div>
  );
};