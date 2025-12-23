import React, { useState, useEffect } from 'react';
import { X, Check, Type } from 'lucide-react';

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLabel: string;
  onSave: (newLabel: string) => void;
}

export const EditNodeModal: React.FC<EditNodeModalProps> = ({ 
  isOpen, 
  onClose, 
  initialLabel, 
  onSave 
}) => {
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    setLabel(initialLabel);
  }, [initialLabel, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(label);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-slate-900">
          <h2 className="text-lg font-bold text-slate-900 font-heading">Edit Node</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Node Label
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-slate-900 focus:shadow-[2px_2px_0_0_#0f172a] placeholder:text-slate-400 font-bold"
                placeholder="Enter node name..."
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-700 rounded-lg font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Check size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};