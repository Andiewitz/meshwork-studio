import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { templates } from '../data/templates';
import { flowService } from '../services/flowService';
import { useAuth } from '../hooks/useAuth';

export const TemplateSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string>('blank');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!user) return;
    setIsCreating(true);
    
    try {
      // Create flow in Firestore (or mock)
      const flow = await flowService.createFlowFromTemplate(user.uid, selectedId);
      // Navigate to editor with the new ID
      navigate(`/flow/${flow.id}`);
    } catch (error) {
      console.error("Failed to create flow", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 font-heading">Start New Mesh</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-3 font-heading">Choose a starting point</h2>
                <p className="text-slate-500 max-w-lg mx-auto">
                    Start from a blank canvas or jumpstart your architecture with one of our industry-standard templates.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {templates.map((template) => (
                    <div 
                        key={template.id}
                        onClick={() => setSelectedId(template.id)}
                        className={`
                            relative group cursor-pointer rounded-2xl border-2 transition-all duration-200 overflow-hidden bg-white
                            ${selectedId === template.id 
                                ? 'border-blue-600 shadow-xl shadow-blue-900/10 ring-2 ring-blue-600/20' 
                                : 'border-slate-200 hover:border-blue-400 hover:shadow-lg'}
                        `}
                    >
                        {/* Thumbnail Area */}
                        <div className={`h-32 ${template.thumbnailColor} flex items-center justify-center border-b border-slate-100`}>
                            {template.id === 'blank' ? (
                                <Layout size={48} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                            ) : (
                                <Sparkles size={48} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900">{template.name}</h3>
                                {selectedId === template.id && (
                                    <CheckCircle2 size={20} className="text-blue-600" />
                                )}
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {template.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {isCreating ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Creating Workspace...
                        </>
                    ) : (
                        <>
                            Create Mesh
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};