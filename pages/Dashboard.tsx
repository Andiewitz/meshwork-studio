import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { flowService } from '../services/flowService';
import { FlowData } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Plus, Clock, MoreVertical, FileText } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlows = async () => {
      if (user) {
        try {
          const data = await flowService.getUserFlows(user.uid);
          
          if (data.length === 0 && user.uid === 'dev-guest-123') {
             // For guest users, if no data exists, seed some local data automatically
             // This ensures they persist and work with the new local-id system
             const seedFlows = [
                 { title: 'Welcome Flow', nodes: [], edges: [] },
                 { title: 'E-commerce Architecture', nodes: [], edges: [] }
             ];
             
             // Create them via service to ensure proper ID generation and storage
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
          setLoading(false);
        }
      }
    };

    fetchFlows();
  }, [user]);

  if (loading) {
     return (
        <div className="p-8 flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
     )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading">My Canvas</h1>
            <p className="text-slate-500 mt-1">Manage and edit your workflows.</p>
        </div>
        {/* Redundant button removed; leveraging the Grid Card for creation */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card (Quick Action) */}
        <Link 
            to="/flow/new"
            className="group relative flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
        >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200 mb-3">
                <Plus size={24} className="text-blue-500" />
            </div>
            <span className="font-medium text-slate-600 group-hover:text-blue-600">New Flow</span>
        </Link>

        {/* Flow Cards */}
        {flows.map((flow) => (
            <Link 
                key={flow.id}
                to={`/flow/${flow.id}`}
                className="group bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-48 relative overflow-hidden"
            >
                {/* Decorative background circle */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors duration-300"></div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <FileText size={20} className="text-slate-500 group-hover:text-blue-600" />
                        </div>
                        <button className="text-slate-300 hover:text-slate-600 transition-colors p-1">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 font-heading mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {flow.title}
                    </h3>
                    <p className="text-xs text-slate-400">ID: {flow.id.substring(0,8)}...</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50 group-hover:border-slate-100">
                    <Clock size={12} />
                    <span>Edited {new Date(flow.updatedAt).toLocaleDateString()}</span>
                </div>
            </Link>
        ))}
      </div>
    </div>
  );
};