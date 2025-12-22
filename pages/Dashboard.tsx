import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { FlowData } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Plus, Clock, MoreVertical, FileText } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchFlows = async () => {
      if (user) {
        try {
          const data = await flowService.getUserFlows(user.uid);
          
          if (data.length === 0 && user.uid === 'dev-guest-123') {
             // For guest users, if no data exists, seed some local data automatically
             const seedFlows = [
                 { title: 'Welcome Flow', nodes: [], edges: [] },
                 { title: 'E-commerce Architecture', nodes: [], edges: [] }
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

  return (
    <PageTransition isLoading={dataLoading} loadingMessage="Loading Canvas...">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
              <h1 className="text-3xl font-bold text-slate-900 font-heading">My Canvas</h1>
              <p className="text-slate-500 mt-1">Manage and edit your workflows.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card (Quick Action) */}
          <Link 
              to="/flow/new"
              className="group relative flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 hover:bg-slate-100 transition-all duration-300 cursor-pointer"
          >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 group-hover:border-slate-900 group-hover:bg-slate-900 transition-all duration-300 mb-3">
                  <Plus size={24} className="text-slate-900 group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="font-bold text-slate-600 group-hover:text-slate-900 tracking-tight">New Flow</span>
          </Link>

          {/* Flow Cards */}
          {flows.map((flow) => (
              <Link 
                  key={flow.id}
                  to={`/flow/${flow.id}`}
                  className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between h-48 relative overflow-hidden"
              >
                  {/* Decorative background circle */}
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-slate-100 transition-colors duration-300"></div>

                  <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                          <div className="p-2.5 bg-slate-100 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                              <FileText size={20} className="text-slate-500 group-hover:text-white" />
                          </div>
                          <button className="text-slate-300 hover:text-slate-600 transition-colors p-1">
                              <MoreVertical size={16} />
                          </button>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 font-heading mb-1 line-clamp-1 group-hover:text-slate-700 transition-colors">
                          {flow.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">ID: {flow.id.substring(0,8)}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50 group-hover:border-slate-100">
                      <Clock size={12} />
                      <span>Edited {new Date(flow.updatedAt).toLocaleDateString()}</span>
                  </div>
              </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};