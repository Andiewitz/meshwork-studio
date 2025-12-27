import React from 'react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Initializing...", 
  fullScreen = true 
}) => {
  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-[100] bg-slate-50' : 'h-full w-full min-h-[400px] flex items-center justify-center bg-transparent'} flex items-center justify-center overflow-hidden`}>
         
         {/* Background Pattern for Full Screen */}
         {fullScreen && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7c3aed 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
         )}

         <div className="relative bg-white border-2 border-slate-900 p-8 rounded-2xl shadow-[8px_8px_0_0_#0f172a] flex flex-col items-center gap-8 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
            
            {/* Brutalist Loader: Rotating Square with Static Center */}
            <div className="relative w-20 h-20">
                {/* Static Ghost */}
                <div className="absolute inset-0 bg-violet-50 rounded-xl border-2 border-violet-200 transform rotate-45"></div>
                
                {/* Spinning Element */}
                <div className="absolute inset-0 bg-violet-600 rounded-xl animate-spin shadow-sm z-10" style={{ animationDuration: '3s' }}></div>
                
                {/* Static Overlay to create 'border' effect */}
                <div className="absolute inset-3 bg-white rounded-lg border-2 border-slate-900 z-20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-violet-600 rounded-sm animate-pulse"></div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 text-center z-20">
                <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
                    Meshwork Studio
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-violet-50 rounded-full border border-violet-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-violet-600 text-xs font-mono font-bold uppercase tracking-widest">
                        {message}
                    </span>
                </div>
            </div>

            {/* Decorative Corner Accents */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
        </div>
    </div>
  );
};