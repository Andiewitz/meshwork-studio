import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, Sparkles, Loader2, Check, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { templates } from '../data/templates';
import { flowService } from '../services/flowService';
import { useAuth } from '../hooks/useAuth';

export const TemplateSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string>('blank');
  const [isCreating, setIsCreating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (evt: WheelEvent) => {
      // If horizontal scroll is already present (trackpad), let it happen naturally
      // otherwise translate vertical scroll to horizontal
      if (evt.deltaY !== 0) {
         evt.preventDefault();
         container.scrollLeft += evt.deltaY;
      }
    };

    // Passive: false is required to use preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleCreate = async () => {
    if (!user) return;
    setIsCreating(true);
    
    try {
      const flow = await flowService.createFlowFromTemplate(user.uid, selectedId);
      navigate(`/flow/${flow.id}`);
    } catch (error) {
      console.error("Failed to create flow", error);
      setIsCreating(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 340; // Card width + gap approximate
      const scrollAmount = direction === 'right' ? cardWidth : -cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 flex items-center justify-between z-20">
        <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
            <div className="p-2 rounded-full border border-slate-800 bg-slate-900 group-hover:bg-slate-800 transition-colors">
                <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        
        <div className="flex items-center gap-2">
             <span className="text-xs font-mono text-slate-600">MESHWORK STUDIO</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center relative">
        <div className="text-center mb-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
                Initialize Architecture
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
                Select a foundation for your distributed system. Start blank or leverage industry-standard patterns.
            </p>
        </div>

        {/* Carousel Area */}
        <div className="relative w-full">
            {/* Scroll Buttons */}
            <button 
                onClick={() => scroll('left')}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-sm transition-all hidden md:flex"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => scroll('right')}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-sm transition-all hidden md:flex"
            >
                <ChevronRight size={24} />
            </button>

            {/* Scroll Container */}
            <div 
                ref={scrollContainerRef}
                className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-8 md:px-[calc(50vw-180px)] pb-12 pt-4 no-scrollbar items-center"
            >
                {templates.map((template) => {
                    const isSelected = selectedId === template.id;
                    
                    return (
                        <div 
                            key={template.id}
                            onClick={() => setSelectedId(template.id)}
                            className={`
                                relative flex-shrink-0 w-[340px] h-[450px] rounded-3xl snap-center cursor-pointer transition-all duration-500 ease-out group
                                flex flex-col overflow-hidden border
                                ${isSelected 
                                    ? 'scale-100 border-white shadow-[0_0_50px_rgba(255,255,255,0.1)] bg-slate-900 z-10' 
                                    : 'scale-90 opacity-60 hover:opacity-100 border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-600'}
                            `}
                        >
                            {/* Visual Header */}
                            <div className={`
                                h-48 w-full flex items-center justify-center relative overflow-hidden transition-colors duration-500
                                ${isSelected ? template.thumbnailColor.replace('bg-', 'bg-opacity-20 bg-') : 'bg-slate-950'}
                            `}>
                                {/* Abstract Geometric Pattern Background */}
                                <div className="absolute inset-0 opacity-20" 
                                    style={{ 
                                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', 
                                        backgroundSize: '20px 20px' 
                                    }} 
                                />
                                
                                <div className={`
                                    relative z-10 p-6 rounded-2xl bg-slate-950 shadow-2xl border border-slate-800 transition-transform duration-500 flex items-center justify-center
                                    ${isSelected ? 'scale-110' : 'scale-100'}
                                `}>
                                    {template.id === 'blank' ? (
                                        <Layout size={48} className={isSelected ? 'text-white' : 'text-slate-500'} />
                                    ) : template.logo ? (
                                        <img 
                                            src={template.logo} 
                                            alt={template.name} 
                                            className={`w-12 h-12 object-contain transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-60 grayscale'}`}
                                        />
                                    ) : (
                                        <Sparkles size={48} className={isSelected ? 'text-amber-400' : 'text-slate-500'} />
                                    )}
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="flex-1 p-8 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className={`text-xl font-bold font-heading ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                        {template.name}
                                    </h3>
                                    {isSelected && (
                                        <div className="bg-white text-black p-1 rounded-full animate-in zoom-in spin-in-90 duration-300">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                    )}
                                </div>
                                
                                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                    {template.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-slate-800/50">
                                    <div className="flex items-center gap-4 text-xs font-mono text-slate-600 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            <Layout size={12} />
                                            <span>{template.nodes.length} Nodes</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                                        <div>
                                            {template.id === 'blank' ? 'Empty State' : 'Pre-configured'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {/* Spacer for right side scrolling balance */}
                <div className="w-4 flex-shrink-0 md:hidden"></div>
            </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-8 border-t border-slate-900 bg-slate-950 z-20 flex justify-center">
        <button
            onClick={handleCreate}
            disabled={isCreating}
            className={`
                relative overflow-hidden group flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300
                ${isCreating 
                    ? 'bg-slate-800 text-slate-400 cursor-wait' 
                    : 'bg-white text-black hover:bg-slate-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]'}
            `}
        >
            {isCreating ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Constructing...</span>
                </>
            ) : (
                <>
                    <span>Initialize Mesh</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
            )}
        </button>
      </div>
    </div>
  );
};