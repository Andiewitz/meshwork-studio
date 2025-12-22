import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

export const LoginPage: React.FC = () => {
  const { user, signInWithGoogle, loginAsGuest, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (loading) return null; // Initial auth check handled by AuthProvider/ProtectedRoute generally, but good to keep
  
  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <PageTransition loadingMessage="Preparing Environment...">
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2 font-heading">
                Meshwork Studio
            </h1>
            <p className="text-slate-500">Sign in to manage your distributed systems</p>
            </div>

            <div className="space-y-4">
            {/* Disabled Google Button with Red Line Crossing */}
            <div className="relative group cursor-not-allowed">
                <button
                disabled
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-400 font-medium py-3 px-4 rounded-lg transition-all duration-200 opacity-60 pointer-events-none"
                >
                <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google logo" 
                    className="w-6 h-6 grayscale opacity-50"
                />
                Continue with Google
                </button>
                
                {/* Red Crossing Line */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-lg">
                    <div className="w-[120%] h-0.5 bg-red-500/80 rotate-12 shadow-sm"></div>
                </div>
                
                {/* Optional Tooltip/Message */}
                <div className="absolute top-full left-0 right-0 mt-1 text-[10px] text-red-500 font-medium">
                    Auth disabled in demo environment
                </div>
            </div>

            <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Development</span>
                </div>
            </div>

            <button
                onClick={loginAsGuest}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-slate-900/20"
            >
                <Code2 size={20} />
                Enter as Guest (Dev)
            </button>
            </div>
            
            <div className="mt-8 text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
        </div>
        </div>
    </PageTransition>
  );
};