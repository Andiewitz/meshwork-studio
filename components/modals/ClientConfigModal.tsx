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
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white font-heading">Configure Client</h2>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"><X size={18} /></button>
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
                            flex flex-col items-center gap-3 p-4 rounded-xl border transition-all
                            ${isSelected 
                                ? 'bg-sky-600/10 border-sky-500 text-sky-400' 
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}
                        `}
                     >
                        <Icon size={32} />
                        <span className="text-xs font-medium">{type.label}</span>
                     </button>
                 )
             })}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
              Client Name
            </label>
            <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-sky-500"
                placeholder="e.g. iOS App"
                autoFocus
              />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <Check size={16} /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};