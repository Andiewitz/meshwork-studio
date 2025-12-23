import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { FlowData } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Plus, Clock, MoreHorizontal, FileText, Search, ArrowRight, Play } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFlows = async () => {
      if (user) {
        try {
          const data = await flowService.getUserFlows(user.uid);
          
          if (data.length === 0 && user.uid === 'dev-guest-123') {
             // Seed data for guest
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

    fetchFlows();
  }, [user]);

  // Logic: Sort by date, separate first as "Active"
  const filteredFlows = flows.filter(f => f.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const sortedFlows = [...filteredFlows].sort((a, b) => b.updatedAt - a.updatedAt);
  
  const activeFlow = sortedFlows.length > 0 ? sortedFlows[0] : null;
  // Recent flows can include the active one or exclude it. 
  const recentFlows = sortedFlows; 

  return (
    <PageTransition isLoading={dataLoading} loadingMessage="Loading Canvas...">
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Top Search Bar */}
        <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={20} />
            <input 
            type="text" 
            placeholder="Search flows..." 
            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 text-lg transition-all placeholder:text-slate-400"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[340px]">
            {/* Active Workflow Card (Takes 2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col relative overflow-hidden group">
            {activeFlow ? (
                <>
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                            {/* Abstract visual background */}
                            <div className="w-96 h-96 bg-slate-900 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center items-start">
                            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-6 border border-slate-200">
                                Active Workflow
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-3 tracking-tight line-clamp-1">
                                {activeFlow.title}
                            </h2>
                            <p className="text-slate-400 font-mono text-xs mb-8">ID: {activeFlow.id}</p>
                            
                            <Link 
                            to={`/flow/${activeFlow.id}`}
                            className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl shadow-slate-900/10 flex items-center gap-3 group/btn"
                            >
                            <span>Continue Editing</span>
                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                    </div>

                    {/* Mini Visual representation of nodes/edges */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none scale-90 origin-right">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                                <Play size={20} className="text-emerald-500" fill="currentColor" />
                            </div>
                            <div className="w-12 h-0.5 bg-slate-300 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                            </div>
                            <div className="w-14 h-14 rounded-xl border-2 border-slate-300 bg-white shadow-sm flex items-center justify-center">
                                <div className="w-8 h-2 bg-slate-200 rounded-sm"></div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 ml-16">
                             {/* Branch */}
                             <div className="w-0.5 h-12 bg-slate-300 -ml-[50px] -mt-[44px] relative"></div>
                             <div className="w-8 h-0.5 bg-slate-300 -ml-[48px] relative"></div>
                             
                             <div className="w-14 h-14 rounded-xl border-2 border-slate-300 bg-white shadow-sm flex items-center justify-center">
                                <div className="w-6 h-6 rounded-md border-2 border-slate-200"></div>
                             </div>
                         </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <p>No active flows found.</p>
                </div>
            )}
            </div>

            {/* New Flow Card */}
            <Link to="/flow/new" className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-300 hover:border-slate-800 hover:bg-slate-100 transition-all duration-300 group flex flex-col items-center justify-center gap-6 cursor-pointer relative overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg shadow-slate-200/50 border border-white flex items-center justify-center group-hover:scale-110 transition-transform duration-500 z-10">
                <Plus size={40} className="text-slate-400 group-hover:text-slate-900 transition-colors duration-300" />
                </div>
                <div className="flex flex-col items-center z-10">
                    <span className="font-bold text-slate-600 group-hover:text-slate-900 text-xl mb-1">New Flow</span>
                    <span className="text-sm text-slate-400">Start from scratch or template</span>
                </div>
                
                {/* Dot Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </Link>
        </div>

        {/* Recent Activity Section */}
        <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 mb-6">Recent Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentFlows.map(flow => (
                <Link key={flow.id} to={`/flow/${flow.id}`} className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 group flex flex-col h-48">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                            <FileText size={22} />
                        </div>
                        <button className="text-slate-300 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-all">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg mb-1 truncate leading-tight group-hover:text-blue-600 transition-colors">{flow.title}</h4>
                        <p className="text-xs text-slate-400 font-mono">ID: {flow.id.slice(0,8)}</p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-4 pt-4 border-t border-slate-50 group-hover:border-slate-100">
                        <Clock size={14} />
                        <span>Edited {new Date(flow.updatedAt).toLocaleDateString()}</span>
                    </div>
                </Link>
            ))}
            </div>
        </div>
      </div>
    </PageTransition>
  );
};