import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { FlowData } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Plus, Clock, MoreHorizontal, FileText, Search, ArrowRight, Play, Trash2, Edit, Copy } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { RenameFlowModal } from '../components/modals/RenameFlowModal';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Menu State
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Rename State
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [flowToRename, setFlowToRename] = useState<FlowData | null>(null);

  useEffect(() => {
    fetchFlows();
  }, [user]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchFlows = async () => {
    if (user) {
      try {
        const data = await flowService.getUserFlows(user.uid);
        const hasSeeded = localStorage.getItem('meshwork_guest_seeded');
        
        if (data.length === 0 && user.uid === 'dev-guest-123' && !hasSeeded) {
           // Seed data for guest ONLY if not seeded before
           const seedFlows = [
               { title: 'Welcome Flow', nodes: [], edges: [] },
               { title: 'E-commerce Architecture', nodes: [], edges: [] },
               { title: 'Ride Sharing (Uber)', nodes: [], edges: [] },
               { title: 'Video Streaming (Netflix)', nodes: [], edges: [] }
           ];
           
           const createdFlows = [];
           for (const seed of seedFlows) {
               const f = await flowService.createFlow(user.uid, seed.title);
               createdFlows.push(f);
           }
           setFlows(createdFlows);
           localStorage.setItem('meshwork_guest_seeded', 'true');
        } else {
           setFlows(data);
        }
      } catch (error) {
        console.error("Error fetching flows", error);
      } finally {
        setDataLoading(false);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (window.confirm('Are you sure you want to delete this flow? This action cannot be undone.')) {
        try {
            await flowService.deleteFlow(id);
            // Optimistic update
            setFlows(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error("Failed to delete flow", error);
            alert("Failed to delete flow.");
        }
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, flow: FlowData) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (!user) return;

    try {
        const newFlow = await flowService.duplicateFlow(user.uid, flow);
        setFlows(prev => [newFlow, ...prev]);
    } catch (error) {
        console.error("Failed to duplicate flow", error);
        alert("Failed to duplicate flow.");
    }
  };

  const openRenameModal = (e: React.MouseEvent, flow: FlowData) => {
      e.stopPropagation();
      setFlowToRename(flow);
      setRenameModalOpen(true);
      setOpenMenuId(null);
  };

  const handleRenameSave = async (newTitle: string) => {
      if (flowToRename) {
          try {
              await flowService.renameFlow(flowToRename.id, newTitle);
              // Update local state
              setFlows(prev => prev.map(f => f.id === flowToRename.id ? { ...f, title: newTitle, updatedAt: Date.now() } : f));
          } catch (error) {
              console.error("Failed to rename", error);
          }
      }
  };

  // Logic: Sort by date, separate first as "Active"
  const filteredFlows = flows.filter(f => f.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const sortedFlows = [...filteredFlows].sort((a, b) => b.updatedAt - a.updatedAt);
  
  const activeFlow = sortedFlows.length > 0 ? sortedFlows[0] : null;
  // Use slice(1) to avoid showing the active flow in the recent list, 
  // preventing duplicate render and duplicate context menus for the same ID.
  const recentFlows = sortedFlows.slice(1); 

  const renderContextMenu = (flow: FlowData) => (
    <div 
        ref={menuRef}
        className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] rounded-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right flex flex-col"
        onClick={(e) => e.stopPropagation()}
    >
        <button 
            onClick={(e) => openRenameModal(e, flow)}
            className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-3 transition-colors"
        >
            <Edit size={16} className="text-slate-500" />
            Rename
        </button>
        <button 
            onClick={(e) => handleDuplicate(e, flow)}
            className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-3 transition-colors"
        >
            <Copy size={16} className="text-slate-500" />
            Duplicate
        </button>
        <div className="my-1 border-t-2 border-slate-100"></div>
        <button 
            onClick={(e) => handleDelete(e, flow.id)}
            className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
        >
            <Trash2 size={16} />
            Delete Flow
        </button>
    </div>
  );

  return (
    <PageTransition isLoading={dataLoading} loadingMessage="Loading Canvas...">
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* Rename Modal */}
        <RenameFlowModal 
            isOpen={renameModalOpen}
            onClose={() => setRenameModalOpen(false)}
            initialTitle={flowToRename?.title || ''}
            onSave={handleRenameSave}
        />

        {/* Top Search Bar */}
        <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
            <input 
            type="text" 
            placeholder="Search flows..." 
            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl shadow-[4px_4px_0_0_#cbd5e1] border-2 border-slate-300 focus:border-slate-900 focus:shadow-[4px_4px_0_0_#0f172a] focus:outline-none text-lg transition-all placeholder:text-slate-400 font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Section Header */}
        <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-2">My Canvas</h1>
            <p className="text-slate-500">Manage and edit your workflows.</p>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[320px]">
            {/* Active Workflow Card (Takes 2 cols) - Dark Theme */}
            <div 
                onClick={() => activeFlow && navigate(`/flow/${activeFlow.id}`)}
                className="lg:col-span-2 bg-zinc-900 rounded-3xl border-2 border-zinc-900 shadow-[6px_6px_0_0_#cbd5e1] p-6 md:p-8 flex flex-col relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#94a3b8]"
            >
            {activeFlow ? (
                <>
                    <div className="absolute top-0 right-0 p-8 opacity-[0.1] group-hover:opacity-[0.15] transition-opacity pointer-events-none">
                            {/* Abstract visual background */}
                            <div className="w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center items-start">
                            <div className="w-full flex justify-between items-start mb-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider border border-zinc-700">
                                    Active Workflow
                                </span>

                                {/* Context Menu for Active Flow */}
                                <div className="relative">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(openMenuId === activeFlow.id ? null : activeFlow.id);
                                        }}
                                        className={`
                                            p-2 rounded-full transition-all 
                                            ${openMenuId === activeFlow.id ? 'bg-white text-zinc-900' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}
                                        `}
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>
                                    {openMenuId === activeFlow.id && renderContextMenu(activeFlow)}
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2 tracking-tight line-clamp-1">
                                {activeFlow.title}
                            </h2>
                            <p className="text-zinc-500 font-mono text-xs mb-8 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                ID: {activeFlow.id}
                            </p>
                            
                            <div 
                                className="px-8 py-3 bg-white text-zinc-900 rounded-xl font-bold border-2 border-transparent hover:border-zinc-200 transition-all hover:scale-[1.02] shadow-xl shadow-black/20 flex items-center gap-3 group/btn w-fit text-sm"
                            >
                                <span>Continue Editing</span>
                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                    </div>

                    {/* Mini Visual representation of nodes/edges - Inverted for Dark Mode */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none scale-90 origin-right">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800 flex items-center justify-center">
                                <Play size={20} className="text-emerald-500" fill="currentColor" />
                            </div>
                            <div className="w-12 h-0.5 bg-zinc-700 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-700"></div>
                            </div>
                            <div className="w-14 h-14 rounded-xl border-2 border-zinc-700 bg-zinc-800 shadow-sm flex items-center justify-center">
                                <div className="w-8 h-2 bg-zinc-600 rounded-sm"></div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 ml-16">
                             {/* Branch */}
                             <div className="w-0.5 h-12 bg-zinc-700 -ml-[50px] -mt-[44px] relative"></div>
                             <div className="w-8 h-0.5 bg-zinc-700 -ml-[48px] relative"></div>
                             
                             <div className="w-14 h-14 rounded-xl border-2 border-zinc-700 bg-zinc-800 shadow-sm flex items-center justify-center">
                                <div className="w-6 h-6 rounded-md border-2 border-zinc-600"></div>
                             </div>
                         </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                    <p>No active flows found.</p>
                </div>
            )}
            </div>

            {/* New Flow Card - High Contrast */}
            <Link to="/flow/new" className="bg-white rounded-3xl border-2 border-dashed border-slate-400 hover:border-slate-900 hover:bg-slate-50 transition-all duration-300 group flex flex-col items-center justify-center gap-6 cursor-pointer relative overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-slate-50 border-2 border-slate-200 group-hover:border-slate-900 group-hover:bg-slate-900 flex items-center justify-center transition-all duration-300 z-10">
                    <Plus size={40} className="text-slate-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex flex-col items-center z-10">
                    <span className="font-bold text-slate-900 text-xl mb-1">New Flow</span>
                    <span className="text-sm text-slate-500">Start from scratch or template</span>
                </div>
                
                {/* Dot Pattern Background */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </Link>
        </div>

        {/* Recent Activity Section */}
        <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 mb-6">Recent Activity</h3>
            {recentFlows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentFlows.map(flow => (
                    <div 
                        key={flow.id} 
                        onClick={() => navigate(`/flow/${flow.id}`)}
                        className="bg-white p-4 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] hover:shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-40 cursor-pointer relative"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2.5 bg-slate-900 text-white rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <FileText size={18} />
                            </div>
                            
                            {/* Context Menu Trigger */}
                            <div className="relative">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === flow.id ? null : flow.id);
                                    }}
                                    className={`
                                        p-2 rounded-full transition-all 
                                        ${openMenuId === flow.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}
                                    `}
                                >
                                    <MoreHorizontal size={20} />
                                </button>

                                {/* Dropdown Menu */}
                                {openMenuId === flow.id && renderContextMenu(flow)}
                            </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-base mb-1 truncate leading-tight group-hover:underline decoration-2 underline-offset-2 transition-all">
                                {flow.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-mono">ID: {flow.id.slice(0,8)}</p>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-3 pt-3 border-t-2 border-slate-100 group-hover:border-slate-200">
                            <Clock size={12} />
                            <span>Edited {new Date(flow.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-slate-400 italic text-sm">
                    {flows.length > 0 ? 'No other recent activity.' : 'No recent activity.'}
                </div>
            )}
        </div>
      </div>
    </PageTransition>
  );
};