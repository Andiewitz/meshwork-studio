
import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  Settings as SettingsIcon, 
  Database, 
  Trash2, 
  Download,
  Moon,
  Grid3X3
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '../hooks/useAuth';

type SettingsTab = 'ai' | 'account' | 'preferences' | 'data';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  
  // Preference State
  const [gridSnap, setGridSnap] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const clearData = () => {
    if (confirm('Are you sure? This will delete all local flows and settings.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const TabButton = ({ id, icon: Icon, label }: { id: SettingsTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left mb-2
        ${activeTab === id 
          ? 'bg-slate-900 border-slate-900 text-white shadow-[4px_4px_0_0_#cbd5e1]' 
          : 'bg-white border-transparent hover:bg-slate-100 hover:border-slate-200 text-slate-500'}
      `}
    >
      <Icon size={18} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <PageTransition loadingMessage="Loading Settings...">
      <div className="p-6 md:p-8 max-w-6xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Configure your studio environment and integrations.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Configuration</h3>
              <TabButton id="ai" icon={Sparkles} label="AI Features" />
              <TabButton id="account" icon={User} label="Account" />
              <TabButton id="preferences" icon={SettingsIcon} label="Preferences" />
              <TabButton id="data" icon={Database} label="Data & Storage" />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            
            {/* AI FEATURES TAB */}
            {activeTab === 'ai' && (
              <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 border-b-2 border-slate-100 bg-indigo-50/50">
                  <div className="w-12 h-12 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-sm text-indigo-600">
                    <Sparkles size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-heading">AI Features</h2>
                  <p className="text-slate-500 text-sm mt-1 max-w-lg">
                    Meshwork Studio leverages Google Gemini to provide intelligent architectural suggestions and auto-documentation. 
                  </p>
                </div>

                <div className="p-8">
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold">OK</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-800 text-sm">AI Engine Active</h4>
                            <p className="text-xs text-emerald-600/80 leading-relaxed mt-1">
                                The system is connected to Google Gemini via the platform API. No additional configuration is required.
                            </p>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 border-b-2 border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 font-heading">Account Profile</h2>
                </div>
                <div className="p-8 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl border-2 border-slate-200 flex items-center justify-center text-slate-400">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{user?.displayName || 'Guest User'}</h3>
                      <p className="text-slate-500 font-mono text-sm">{user?.email || 'guest@meshwork.studio'}</p>
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Free Plan
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-slate-100">
                    <h4 className="text-sm font-bold text-red-600 mb-4 uppercase tracking-wider">Danger Zone</h4>
                    <button 
                      onClick={logout}
                      className="px-4 py-2 bg-white border-2 border-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="p-8 border-b-2 border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 font-heading">Preferences</h2>
                </div>
                <div className="p-8 space-y-4">
                  
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600">
                        <Moon size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Dark Mode</div>
                        <div className="text-xs text-slate-500">Switch between light and dark themes</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setDarkMode(!darkMode)}
                      className={`
                        w-12 h-6 rounded-full border-2 transition-colors relative
                        ${darkMode ? 'bg-slate-900 border-slate-900' : 'bg-slate-200 border-slate-300'}
                      `}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Grid Snap */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600">
                        <Grid3X3 size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Snap to Grid</div>
                        <div className="text-xs text-slate-500">Align nodes automatically when dragging</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setGridSnap(!gridSnap)}
                      className={`
                        w-12 h-6 rounded-full border-2 transition-colors relative
                        ${gridSnap ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-200 border-slate-300'}
                      `}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${gridSnap ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* DATA TAB */}
            {activeTab === 'data' && (
               <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 border-b-2 border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 font-heading">Data & Storage</h2>
                </div>
                <div className="p-8 space-y-6">
                  
                  <div className="p-4 bg-amber-50 border-2 border-amber-100 rounded-xl">
                    <h4 className="font-bold text-amber-800 text-sm mb-1">Local Storage Mode</h4>
                    <p className="text-xs text-amber-600/80 leading-relaxed">
                      You are currently using Guest Mode. All flow data, templates, and settings are stored in your browser's local storage. Clearing your cache will lose this data.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white border-2 border-slate-200 hover:border-slate-900 hover:shadow-md rounded-xl transition-all group text-center">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Download size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">Export All Data</div>
                            <div className="text-xs text-slate-500 mt-1">Download JSON backup</div>
                        </div>
                    </button>

                     <button 
                        onClick={clearData}
                        className="flex flex-col items-center justify-center gap-3 p-6 bg-white border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 rounded-xl transition-all group text-center"
                    >
                        <div className="p-3 bg-red-50 text-red-500 rounded-full group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 group-hover:text-red-700">Clear Local Storage</div>
                            <div className="text-xs text-slate-500 group-hover:text-red-400 mt-1">Reset app to factory state</div>
                        </div>
                    </button>
                  </div>

                </div>
               </div>
            )}

          </div>
        </div>
      </div>
    </PageTransition>
  );
};
