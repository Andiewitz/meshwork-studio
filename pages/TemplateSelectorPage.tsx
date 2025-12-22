import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, Sparkles, Loader2, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { templates } from '../data/templates';
import { flowService } from '../services/flowService';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/PageTransition';

export const TemplateSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string>('blank');
  const [isCreating, setIsCreating] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 1. Handle Mouse Wheel (Vertical -> Horizontal)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (evt: WheelEvent) => {
      // Map vertical scroll to horizontal if vertical delta is dominant
      if (Math.abs(evt.deltaY) > Math.abs(evt.deltaX)) {
         evt.preventDefault();
         container.scrollLeft += evt.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // 2. Auto-Highlight on Scroll (Center Detection)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + (containerRect.width / 2);
      
      let closestTemplateId = selectedId;
      let minDistance = Infinity;

      // Check distance of each card to the center of the container
      templates.forEach((template, index) => {
        const card = cardsRef.current[index];
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + (cardRect.width / 2);
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
            minDistance = distance;
            closestTemplateId = template.id;
        }
      });

      if (closestTemplateId !== selectedId) {
        setSelectedId(closestTemplateId);
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedId]);


  const handleCreate = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation(); // Prevent card click event
    if (!user) return;
    setIsCreating(true);
    
    try {
      const flow = await flowService.createFlowFromTemplate(user.uid, templateId);
      navigate(`/flow/${flow.id}`);
    } catch (error) {
      console.error("Failed to create flow", error);
      setIsCreating(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Approx card width
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'right' ? scrollAmount : -scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <PageTransition loadingMessage="Loading Templates...">
        <div className="min-h-screen bg-slate-950 flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 flex items-center justify-between z-20">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
                <div className="p-2 rounded-full border border-slate-800 bg-slate-900 group-hover:bg-slate-800 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                <span className="text-sm font-medium hidden md:inline">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-600">MESHWORK STUDIO</span>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center relative pb-12">
            <div className="text-center mb-8 px-4">
                <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3 tracking-tight">
                    Initialize Architecture
                </h1>
                <p className="text-slate-400 max-w-lg mx-auto text-base">
                    Select a foundation for your distributed system.
                </p>
            </div>

            {/* Carousel Area */}
            <div className="relative w-full group/carousel">
                {/* Scroll Buttons */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-sm transition-all hidden md:flex opacity-0 group-hover/carousel:opacity-100"
                >
                    <ChevronLeft size={24} />
                </button>
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-sm transition-all hidden md:flex opacity-0 group-hover/carousel:opacity-100"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Scroll Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-8 no-scrollbar items-center scroll-smooth"
                >
                    {/* Start Spacer: Half screen width minus half card width (approx 160px) */}
                    <div className="shrink-0 w-[10vw] md:w-[calc(50vw-160px)]" />

                    {templates.map((template, index) => {
                        const isSelected = selectedId === template.id;
                        
                        return (
                            <div 
                                key={template.id}
                                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                                onClick={() => {
                                    setSelectedId(template.id);
                                    cardsRef.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                                }}
                                className={`
                                    relative flex-shrink-0 snap-center cursor-pointer transition-all duration-500 ease-out
                                    flex flex-col overflow-hidden border
                                    w-[280px] h-[420px] md:w-[320px] md:h-[460px] rounded-3xl
                                    ${isSelected 
                                        ? 'scale-100 opacity-100 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-900 z-10' 
                                        : 'scale-90 opacity-40 border-slate-800 bg-slate-900/30 hover:opacity-60'}
                                `}
                            >
                                {/* Visual Header */}
                                <div className={`
                                    h-40 md:h-48 w-full flex items-center justify-center relative overflow-hidden transition-colors duration-500
                                    ${isSelected ? template.thumbnailColor.replace('bg-', 'bg-opacity-10 bg-') : 'bg-slate-950'}
                                `}>
                                    <div className="absolute inset-0 opacity-20" 
                                        style={{ 
                                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', 
                                            backgroundSize: '20px 20px' 
                                        }} 
                                    />
                                    
                                    <div className={`
                                        relative z-10 p-4 rounded-2xl bg-slate-950 shadow-2xl border border-slate-800 transition-transform duration-500 flex items-center justify-center
                                        ${isSelected ? 'scale-110 shadow-blue-900/20' : 'scale-100'}
                                    `}>
                                        {template.id === 'blank' ? (
                                            <Layout size={32} className={isSelected ? 'text-white' : 'text-slate-500'} />
                                        ) : template.logo ? (
                                            <img 
                                                src={template.logo} 
                                                alt={template.name} 
                                                className={`w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-60 grayscale'}`}
                                            />
                                        ) : (
                                            <Sparkles size={32} className={isSelected ? 'text-amber-400' : 'text-slate-500'} />
                                        )}
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="flex-1 p-6 md:p-8 flex flex-col relative bg-gradient-to-b from-slate-900 to-slate-950">
                                    <div className="mb-4">
                                        <h3 className={`text-lg md:text-xl font-bold font-heading mb-2 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                            {template.name}
                                        </h3>
                                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-3">
                                            {template.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <Layout size={12} />
                                                <span>{template.nodes.length} Nodes</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                                            <div>
                                                {template.id === 'blank' ? 'Empty' : 'Template'}
                                            </div>
                                        </div>

                                        {/* Create Button */}
                                        <div className={`
                                            transition-all duration-500 ease-out transform
                                            ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                                        `}>
                                            <button
                                                onClick={(e) => handleCreate(e, template.id)}
                                                disabled={isCreating}
                                                className={`
                                                    w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                                                    ${isCreating 
                                                        ? 'bg-slate-800 text-slate-400 cursor-wait' 
                                                        : 'bg-white text-slate-900 hover:bg-slate-200 hover:scale-[1.02] shadow-lg shadow-white/5'}
                                                `}
                                            >
                                                {isCreating && selectedId === template.id ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        <span>Initializing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 size={16} />
                                                        <span>Initialize Mesh</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* End Spacer */}
                    <div className="shrink-0 w-[10vw] md:w-[calc(50vw-160px)]" />
                </div>
            </div>
        </div>
        </div>
    </PageTransition>
  );
};