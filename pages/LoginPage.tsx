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

  return (
    <PageTransition loadingMessage="Preparing Environment...">
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
             {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="max-w-md w-full bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] p-8 text-center relative z-10 animate-in zoom-in-95 duration-300">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-[4px_4px_0_0_#94a3b8] mx-auto mb-6">
                        <span className="font-bold font-heading text-3xl">M</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 font-heading tracking-tight">
                        Meshwork Studio
                    </h1>
                    <p className="text-slate-500 font-medium">Sign in to manage your distributed systems</p>
                </div>

                <div className="space-y-4">
                    {/* Disabled Google Button */}
                    <div className="relative group cursor-not-allowed">
                        <button
                            disabled
                            onClick={signInWithGoogle}
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-400 font-bold py-3 px-4 rounded-xl transition-all duration-200 opacity-60 pointer-events-none"
                        >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google logo" 
                            className="w-5 h-5 grayscale opacity-50"
                        />
                        Continue with Google
                        </button>
                        
                        {/* Red Crossing Line */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-xl">
                            <div className="w-[120%] h-0.5 bg-red-500/80 rotate-6 shadow-sm"></div>
                        </div>
                        
                        <div className="absolute top-full left-0 right-0 mt-2 text-[10px] text-red-500 font-bold uppercase tracking-wider">
                            Auth disabled in demo
                        </div>
                    </div>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t-2 border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                            <span className="bg-white px-3 text-slate-400">Development Mode</span>
                        </div>
                    </div>

                    <button
                        onClick={loginAsGuest}
                        className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl border-2 border-slate-900 hover:bg-slate-800 hover:shadow-[4px_4px_0_0_#94a3b8] hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <Code2 size={20} />
                        Enter as Guest Architect
                    </button>
                </div>
                
                <div className="mt-8 text-xs text-slate-400 font-medium max-w-xs mx-auto">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>
        </div>
    </PageTransition>
  );
};