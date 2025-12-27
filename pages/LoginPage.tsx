import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

export const LoginPage: React.FC = () => {
  const { user, signInWithGoogle, loginAsGuest, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (loading) return null;
  
  if (user) {
    return <Navigate to={from} replace />;
  }

  const LetterBlock = ({ char, color, rotate, textColor = 'text-white' }: { char: string, color: string, rotate: string, textColor?: string }) => (
    <div className={`
      w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]
      flex items-center justify-center text-xl md:text-2xl font-black font-heading
      ${color} ${rotate} ${textColor} hover:-translate-y-1 transition-transform cursor-default select-none
    `}>
      {char}
    </div>
  );

  return (
    <PageTransition loadingMessage="Preparing Environment...">
        {/* Updated Background to Creamy White */}
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-4 relative overflow-hidden font-sans">
             {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.05]" 
                 style={{ 
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                 }}>
            </div>

            <div className="max-w-xl w-full flex flex-col items-center relative z-10">
                
                {/* Colorful Logo Section */}
                <div className="mb-10 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        <LetterBlock char="M" color="bg-orange-600" rotate="-rotate-3" />
                        <LetterBlock char="E" color="bg-emerald-400" rotate="rotate-2" textColor="text-black" />
                        <LetterBlock char="S" color="bg-amber-400" rotate="-rotate-2" textColor="text-black" />
                        <LetterBlock char="H" color="bg-blue-500" rotate="rotate-1" />
                        <LetterBlock char="W" color="bg-rose-500" rotate="-rotate-3" />
                        <LetterBlock char="O" color="bg-yellow-400" rotate="rotate-2" textColor="text-black" />
                        <LetterBlock char="R" color="bg-cyan-400" rotate="-rotate-1" textColor="text-black" />
                        <LetterBlock char="K" color="bg-green-500" rotate="rotate-3" />
                    </div>
                    
                    <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[3px_3px_0_0_rgba(0,0,0,1)] transform rotate-2">
                        <span className="font-bold font-mono text-xs tracking-[0.2em]">STUDIO</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0_0_#000000] p-8 md:p-10 text-center animate-in zoom-in-95 duration-300">
                    <h1 className="text-2xl font-bold text-black mb-2 font-heading tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 font-medium mb-8 text-sm">Sign in to architect your distributed systems</p>

                    <div className="space-y-4">
                        {/* Disabled Google Button */}
                        <div className="relative group cursor-not-allowed grayscale opacity-60 hover:opacity-100 transition-opacity">
                            <button
                                disabled
                                onClick={signInWithGoogle}
                                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-400 font-bold py-3.5 px-4 rounded-xl transition-all duration-200 pointer-events-none"
                            >
                            <img 
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                                alt="Google logo" 
                                className="w-5 h-5 opacity-50"
                            />
                            Continue with Google
                            </button>
                            
                            {/* Beta Tag */}
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-lg border-2 border-black transform rotate-12 shadow-sm">
                                SOON
                            </div>
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t-2 border-slate-100" />
                            </div>
                            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                                <span className="bg-white px-3 text-slate-400">Beta Access</span>
                            </div>
                        </div>

                        <button
                            onClick={loginAsGuest}
                            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-4 px-4 rounded-xl border-2 border-black hover:bg-slate-800 shadow-[4px_4px_0_0_#000000] hover:shadow-[2px_2px_0_0_#000000] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all duration-200"
                        >
                            <Code2 size={20} strokeWidth={2.5} />
                            Start Building
                        </button>
                    </div>
                    
                    <div className="mt-8 text-xs text-slate-400 font-bold max-w-xs mx-auto">
                        v1.4.0-alpha • Local Storage Only
                    </div>
                </div>
            </div>
        </div>
    </PageTransition>
  );
};