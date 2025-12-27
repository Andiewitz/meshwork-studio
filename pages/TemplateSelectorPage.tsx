import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    X, 
    Layout, 
    Sparkles, 
    Loader2, 
    CheckCircle2, 
    ArrowRight,
    PenLine,
    ChevronDown
} from 'lucide-react';
import { templates } from '../data/templates';
import { flowService } from '../services/flowService';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/PageTransition';
import { PROJECT_ICONS, DEFAULT_ICON } from '../utils/projectIcons';

export const TemplateSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedId, setSelectedId] = useState<string>('blank');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedIconKey, setSelectedIconKey] = useState<string>(DEFAULT_ICON);
  const [isCreating, setIsCreating] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const iconPickerRef = useRef<HTMLDivElement>(null);

  const selectedTemplate = templates.find(t => t.id === selectedId);

  // Close icon picker on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconPickerRef.current && !iconPickerRef.current.contains(event.target as Node)) {
        setShowIconPicker(false);
      }
    };
    if (showIconPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showIconPicker]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsCreating(true);
    
    try {
      const flow = await flowService.createFlowFromTemplate(
        user.uid, 
        selectedId,
        customTitle || undefined,
        selectedIconKey
      );
      navigate(`/flow/${flow.id}`);
    } catch (error) {
      console.error("Failed to create flow", error);
      setIsCreating(false);
    }
  };

  const SelectedIconComponent = PROJECT_ICONS[selectedIconKey] || Layout;

  return (
    <PageTransition loadingMessage="Loading Studio...">
        <div className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
            
            {/* Fake Dashboard Background (Blurred) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30 select-none overflow-hidden" aria-hidden="true">
                <div className="flex h-full w-full">
                    {/* Fake Sidebar */}
                    <div className="w-64 bg-white border-r-2 border-slate-200 h-full flex flex-col p-4 gap-4 hidden md:flex">
                        <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                        <div className="h-4 w-24 bg-slate-100 rounded"></div>
                        <div className="mt-8 space-y-3">
                            <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
                            <div className="h-10 w-full bg-white border-2 border-slate-100 rounded-xl"></div>
                            <div className="h-10 w-full bg-white border-2 border-slate-100 rounded-xl"></div>
                        </div>
                    </div>
                    {/* Fake Content */}
                    <div className="flex-1 bg-slate-50 p-6 md:p-8 flex flex-col gap-6">
                        <div className="h-16 w-full border-b-2 border-slate-200 mb-2"></div>
                        <div className="h-64 w-full bg-white rounded-3xl border-2 border-slate-200"></div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="h-40 bg-white rounded-3xl border-2 border-slate-200"></div>
                            <div className="h-40 bg-white rounded-3xl border-2 border-slate-200"></div>
                            <div className="h-40 bg-white rounded-3xl border-2 border-slate-200"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop Blur Overlay */}
            <div className="absolute inset-0 z-0 backdrop-blur-md bg-slate-50/40"></div>

            {/* The "Pop Up" Modal */}
            <div className="relative z-10 w-full max-w-2xl bg-white border-2 border-slate-900 rounded-2xl shadow-[12px_12px_0_0_#0f172a] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-5 border-b-2 border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div>
                        <h1 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                           <Layout size={20} className="text-slate-500" />
                           Create New Mesh
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">Configure your new architecture project</p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Left: Template Selection */}
                    <div className="flex-1 border-r-2 border-slate-100 overflow-y-auto bg-slate-50 p-2 md:p-4 min-h-[200px]">
                        <div className="mb-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Select Template
                        </div>
                        <div className="space-y-2">
                            {templates.map((t) => {
                                const isSelected = selectedId === t.id;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedId(t.id)}
                                        className={`
                                            w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200
                                            ${isSelected 
                                                ? 'bg-white border-slate-900 shadow-[4px_4px_0_0_#cbd5e1]' 
                                                : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}
                                        `}
                                    >
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors
                                            ${isSelected ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-400'}
                                        `}>
                                            {t.id === 'blank' ? <Layout size={18} /> : 
                                             t.logo ? <img src={t.logo} alt="" className="w-5 h-5 object-contain" /> : <Sparkles size={18} />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {t.name}
                                            </div>
                                            <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                                {t.id === 'blank' ? 'Empty workspace' : 'Pre-configured'}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="ml-auto flex items-center h-full text-slate-900">
                                                <ArrowRight size={16} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Configuration Form */}
                    <div className="flex-1 flex flex-col p-6 bg-white overflow-y-auto">
                        <form id="create-flow-form" onSubmit={handleCreate} className="flex-1 flex flex-col">
                             
                             {/* Preview Card with Integrated Icon Picker */}
                             <div className="mb-8 p-4 rounded-3xl bg-slate-50 border-2 border-slate-100 flex flex-col items-center text-center shrink-0 relative">
                                 <div className="relative" ref={iconPickerRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowIconPicker(!showIconPicker)}
                                        className={`
                                            w-20 h-20 rounded-3xl flex items-center justify-center mb-3 shadow-md bg-white border-2 border-slate-200 text-slate-900
                                            hover:border-indigo-500 hover:shadow-[4px_4px_0_0_#6366f1] transition-all transform hover:-translate-y-1 active:translate-y-0
                                            group
                                        `}
                                    >
                                        {selectedTemplate?.logo ? (
                                            <img src={selectedTemplate.logo} alt="" className="w-10 h-10 object-contain" />
                                        ) : (
                                            <SelectedIconComponent size={36} />
                                        )}
                                        
                                        {/* Edit Badge */}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronDown size={12} strokeWidth={3} />
                                        </div>
                                    </button>

                                    {/* Small Icon Picker Menu */}
                                    {showIconPicker && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="grid grid-cols-4 gap-2 w-48">
                                                {Object.entries(PROJECT_ICONS).map(([key, Icon]) => {
                                                    const isActive = selectedIconKey === key;
                                                    return (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedIconKey(key);
                                                                setShowIconPicker(false);
                                                            }}
                                                            className={`
                                                                aspect-square rounded-lg flex items-center justify-center border transition-all
                                                                ${isActive 
                                                                    ? 'bg-slate-900 text-white border-slate-900' 
                                                                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'}
                                                            `}
                                                            title={key}
                                                        >
                                                            <Icon size={18} />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                 </div>
                                 
                                 <h3 className="text-xl font-bold text-slate-900 font-heading">{selectedTemplate?.name}</h3>
                                 <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[200px]">
                                     {selectedTemplate?.description}
                                 </p>
                             </div>

                             <div className="space-y-6 mb-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                                        Project Name
                                    </label>
                                    <div className="relative">
                                        <PenLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type="text" 
                                            value={customTitle}
                                            onChange={(e) => setCustomTitle(e.target.value)}
                                            placeholder={selectedTemplate?.name || "Untitled Mesh"}
                                            className="w-full bg-white border-2 border-slate-200 text-slate-900 pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-slate-900 focus:shadow-[4px_4px_0_0_#cbd5e1] font-bold transition-all placeholder:font-normal"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                             </div>

                             {/* Actions */}
                             <div className="pt-6 mt-8 border-t-2 border-slate-100 flex gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="flex-1 px-4 py-3.5 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-700 rounded-2xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-[2] px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all hover:shadow-[4px_4px_0_0_#cbd5e1] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Building...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={18} />
                                            <span>Create Project</span>
                                        </>
                                    )}
                                </button>
                             </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </PageTransition>
  );
};