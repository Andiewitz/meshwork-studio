import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, signInWithGoogle, loginAsGuest, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (loading) return null;
  
  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2 font-heading">
            Meshwork Studio
          </h1>
          <p className="text-slate-500">Sign in to manage your distributed systems</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="w-6 h-6"
            />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Development</span>
            </div>
          </div>

          <button
            onClick={loginAsGuest}
            className="w-full flex items-center justify-center gap-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium py-3 px-4 rounded-lg transition-all duration-200"
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
  );
};