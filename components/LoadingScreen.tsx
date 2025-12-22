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
    <div className={`${fullScreen ? 'fixed inset-0 z-50 bg-white' : 'h-full w-full py-12'} flex items-center justify-center`}>
         <div className="flex flex-col items-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100"></div>
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-slate-900 border-t-transparent animate-spin"></div>
                {/* Inner dot pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col items-center gap-1 animate-pulse">
                <span className="text-slate-900 font-heading font-bold text-lg tracking-wide">Meshwork Studio</span>
                <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">{message}</span>
            </div>
        </div>
    </div>
  );
};