import React, { useState, useEffect } from 'react';
import { X, Check, Smartphone, Laptop, Monitor } from 'lucide-react';

interface ClientConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLabel: string;
  initialType: string;
  onSave: (label: string, type: string) => void;
}

export const ClientConfigModal: React.FC<ClientConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  initialLabel, 
  initialType,
  onSave 
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [selectedType, setSelectedType] = useState(initialType || 'desktop');

  useEffect(() => {
    setLabel(initialLabel);
    setSelectedType(initialType || 'desktop');
  }, [initialLabel, initialType, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(label, selectedType);
    onClose();
  };

  if (!isOpen) return null;

  const types = [
    { id: 'phone', label: 'Mobile App', icon: Smartphone },
    { id: 'laptop', label: 'Web / Laptop', icon: Laptop },
    { id: 'desktop', label: 'Desktop App', icon: Monitor },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-slate-900">
          <h2 className="text-lg font-bold text-slate-900 font-heading">Configure Client</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          
          <div className="grid grid-cols-3 gap-3">
             {types.map((type) => {
                 const Icon = type.icon;
                 const isSelected = selectedType === type.id;
                 return (
                     <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`
                            flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all
                            ${isSelected 
                                ? 'bg-slate-50 border-slate-900 text-slate-900 shadow-[2px_2px_0_0_#0f172a] -translate-y-0.5' 
                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600'}
                        `}
                     >
                        <Icon size={32} strokeWidth={1.5} />
                        <span className="text-xs font-bold">{type.label}</span>
                     </button>
                 )
             })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Client Name
            </label>
            <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 text-slate-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-slate-900 focus:shadow-[2px_2px_0_0_#0f172a] font-bold transition-all"
                placeholder="e.g. iOS App"
                autoFocus
              />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-700 rounded-lg font-bold transition-all">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg">
              <Check size={16} /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};