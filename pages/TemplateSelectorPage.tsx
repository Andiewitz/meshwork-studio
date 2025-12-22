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

  // 1. Handle Mouse Wheel (Vertical -> Horizontal)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (evt: WheelEvent) => {
      if (evt.deltaY !== 0) {
         evt.preventDefault();
         // Slower, smoother scroll
         container.scrollLeft += evt.deltaY * 0.8;
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
      const containerCenter = container.scrollLeft + (container.clientWidth / 2);
      
      let closestTemplateId = selectedId;
      let minDistance = Infinity;

      // Iterate through child nodes (cards) to find which is closest to center
      Array.from(container.children).forEach((child, index) => {
        // Skip the spacers
        if (child.className.includes('w-4')) return;
        
        const card = child as HTMLElement;
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
            minDistance = distance;
            // The template array index corresponds to the child index
            if (templates[index]) {
                closestTemplateId = templates[index].id;
            }
        }
      });

      if (closestTemplateId !== selectedId) {
        setSelectedId(closestTemplateId);
      }
    };

    container.addEventListener('scroll', handleScroll);
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
      const cardWidth = 340; 
      const scrollAmount = direction === 'right' ? cardWidth : -cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <PageTransition loadingMessage="Loading Templates...">
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
        <div className="flex-1 flex flex-col justify-center relative pb-12">
            <div className="text-center mb-8 px-4">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
                    Initialize Architecture
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto text-lg">
                    Select a foundation for your distributed system.
                </p>
            </div>

            {/* Carousel Area */}
            <div className="relative w-full group/carousel">
                {/* Scroll Buttons */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-sm transition-all hidden md:flex opacity-0 group-hover/carousel:opacity-100"
                >
                    <ChevronLeft size={24} />
                </button>
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-sm transition-all hidden md:flex opacity-0 group-hover/carousel:opacity-100"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Scroll Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-8 md:px-[calc(50vw-180px)] py-12 no-scrollbar items-center"
                >
                    {templates.map((template) => {
                        const isSelected = selectedId === template.id;
                        
                        return (
                            <div 
                                key={template.id}
                                // On click, we manually set it, though scroll will also catch it
                                onClick={() => {
                                    setSelectedId(template.id);
                                    if (scrollContainerRef.current) {
                                        // Smooth scroll to this element to center it perfectly
                                        const index = templates.findIndex(t => t.id === template.id);
                                        // rough calculation: gap(32) + width(340) = 372
                                        const targetX = index * 372; 
                                        scrollContainerRef.current.scrollTo({ left: targetX, behavior: 'smooth' });
                                    }
                                }}
                                className={`
                                    relative flex-shrink-0 w-[340px] h-[480px] rounded-3xl snap-center cursor-pointer transition-all duration-500 ease-out
                                    flex flex-col overflow-hidden border
                                    ${isSelected 
                                        ? 'scale-105 border-white shadow-[0_0_50px_rgba(255,255,255,0.15)] bg-slate-900 z-10' 
                                        : 'scale-90 opacity-50 border-slate-800 bg-slate-900/50 hover:opacity-80'}
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
                                        relative z-10 p-5 rounded-2xl bg-slate-950 shadow-2xl border border-slate-800 transition-transform duration-500 flex items-center justify-center
                                        ${isSelected ? 'scale-110' : 'scale-100'}
                                    `}>
                                        {template.id === 'blank' ? (
                                            <Layout size={40} className={isSelected ? 'text-white' : 'text-slate-500'} />
                                        ) : template.logo ? (
                                            <img 
                                                src={template.logo} 
                                                alt={template.name} 
                                                className={`w-10 h-10 object-contain transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-60 grayscale'}`}
                                            />
                                        ) : (
                                            <Sparkles size={40} className={isSelected ? 'text-amber-400' : 'text-slate-500'} />
                                        )}
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="flex-1 p-8 flex flex-col relative">
                                    <div className="mb-4">
                                        <h3 className={`text-xl font-bold font-heading mb-2 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                            {template.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            {template.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4">
                                        <div className="flex items-center gap-4 text-xs font-mono text-slate-600 uppercase tracking-widest mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <Layout size={12} />
                                                <span>{template.nodes.length} Nodes</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                                            <div>
                                                {template.id === 'blank' ? 'Empty' : 'Pre-built'}
                                            </div>
                                        </div>

                                        {/* Create Button - Integrated into Card */}
                                        <div className={`
                                            transition-all duration-500 ease-in-out transform
                                            ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                                        `}>
                                            <button
                                                onClick={(e) => handleCreate(e, template.id)}
                                                disabled={isCreating}
                                                className={`
                                                    w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                                                    ${isCreating 
                                                        ? 'bg-slate-800 text-slate-400' 
                                                        : 'bg-white text-black hover:bg-slate-200 hover:scale-[1.02] shadow-lg shadow-white/10'}
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
                    
                    {/* Spacer */}
                    <div className="w-4 flex-shrink-0 md:hidden"></div>
                </div>
            </div>
        </div>
        </div>
    </PageTransition>
  );
};