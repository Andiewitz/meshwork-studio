
import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Loader2, RefreshCw, Download, AlertCircle } from 'lucide-react';
// Correct import from @google/genai
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import * as ReactFlow from 'reactflow';
import { Tooltip, Button, IconButton } from '@mui/material';

interface AsciiExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: ReactFlow.Node[];
  edges: ReactFlow.Edge[];
}

export const AsciiExportModal: React.FC<AsciiExportModalProps> = ({ isOpen, onClose, nodes, edges }) => {
  const [output, setOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAscii = async () => {
    // API key must be obtained exclusively from the environment variable process.env.API_KEY.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      setError("AI Key missing. The API_KEY environment variable is not configured.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setOutput('');

    try {
      // Correct initialization using named parameter
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        You are a senior systems architect.
        Generate a high-quality, strictly ASCII/Unicode art diagram representing the provided system architecture.
        
        GUIDELINES:
        1. Use box-drawing characters (┌ ┐ └ ┘ │ ─) for a clean look.
        2. Arrange the flow logically (e.g., Left-to-Right for pipelines, Top-Down for hierarchies).
        3. Include labels inside the boxes.
        4. Label the connections (arrows) if a label exists.
        5. Do not output Markdown code blocks (no \`\`\`). Return raw text only.
        6. Keep it compact but readable.
        
        DATA:
        Nodes: ${nodes.map(n => `[ID:${n.id} Label:"${n.data.label}" Type:${n.type}]`).join(', ')}
        Connections: ${edges.map(e => `${e.source} --(${e.label || ''})--> ${e.target}`).join(', ')}
      `;

      // Using gemini-3-pro-preview for complex reasoning and rendering tasks
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      // Extracting text from response property (not method)
      let text = response.text || 'No output generated.';
      // Clean up markdown code blocks if the model ignores the instruction
      text = text.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
      
      setOutput(text);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to AI service. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && !output && !isGenerating) {
      generateAscii();
    }
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([output], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `architecture-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white border-2 border-slate-900 rounded-2xl shadow-[12px_12px_0_0_#0f172a] flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b-2 border-slate-900 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 border-2 border-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading leading-none">AI Architecture Export</h2>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Generative ASCII Diagram</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 relative">
          
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/80 backdrop-blur-sm">
              <div className="relative mb-4">
                 <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-75"></div>
                 <div className="relative p-4 bg-indigo-50 border-2 border-indigo-100 rounded-full text-indigo-600">
                    <Loader2 size={32} className="animate-spin" />
                 </div>
              </div>
              <p className="font-bold text-slate-900 text-lg">Analyzing Architecture...</p>
              <p className="text-slate-500 text-sm font-mono">Consulting Gemini Model</p>
            </div>
          ) : null}

          {error ? (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="p-4 bg-red-100 text-red-600 rounded-full mb-4 border-2 border-red-200">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Generation Failed</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">{error}</p>
                <div className="flex gap-3">
                    <Button 
                        variant="outlined" 
                        color="inherit" 
                        onClick={() => { window.location.hash = '/settings'; onClose(); }}
                        sx={{ fontWeight: 'bold', textTransform: 'none', borderRadius: '12px', borderColor: '#cbd5e1' }}
                    >
                        Check Settings
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={generateAscii}
                        startIcon={<RefreshCw size={16} />}
                        sx={{ fontWeight: 'bold', textTransform: 'none', borderRadius: '12px' }}
                    >
                        Retry Connection
                    </Button>
                </div>
             </div>
          ) : (
             <div className="flex-1 flex flex-col p-6 overflow-hidden">
                {/* Terminal Toolbar */}
                <div className="flex items-center justify-between bg-slate-800 rounded-t-xl border-x-2 border-t-2 border-slate-900 p-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5 px-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        </div>
                        <span className="text-slate-400 text-xs font-mono ml-2 border-l border-slate-700 pl-3">
                            bash — export.txt
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Tooltip title="Regenerate">
                            <IconButton 
                                size="small" 
                                onClick={generateAscii}
                                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                            >
                                <RefreshCw size={14} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy Text">
                            <IconButton 
                                size="small" 
                                onClick={copyToClipboard}
                                sx={{ color: copied ? '#4ade80' : 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download File">
                            <IconButton 
                                size="small" 
                                onClick={downloadTxt}
                                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                            >
                                <Download size={14} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                
                {/* Terminal Content */}
                <div className="flex-1 bg-slate-900 border-x-2 border-b-2 border-slate-900 rounded-b-xl overflow-auto p-4 shadow-inner relative group">
                    <pre className="font-mono text-xs md:text-sm text-emerald-400 leading-relaxed whitespace-pre font-medium">
                        {output}
                    </pre>
                    {/* Floating Copy Button for easy access */}
                    <button 
                        onClick={copyToClipboard}
                        className={`
                            absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-lg
                            ${copied 
                                ? 'bg-emerald-500 border-emerald-600 text-white translate-y-0 opacity-100' 
                                : 'bg-slate-800 border-slate-700 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-700 translate-y-1 group-hover:translate-y-0'}
                        `}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-slate-100 bg-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Ready</span>
          </div>
          <div className="flex gap-3">
            <Button 
                onClick={onClose}
                variant="outlined"
                sx={{ 
                    color: 'text.primary', 
                    borderColor: 'divider',
                    borderWidth: 2,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': { borderWidth: 2, borderColor: 'text.primary', bgcolor: 'action.hover' }
                }}
            >
                Close
            </Button>
            <Button 
                onClick={downloadTxt}
                disabled={!output || isGenerating}
                variant="contained"
                startIcon={<Download size={18} />}
                sx={{ 
                    bgcolor: '#0f172a',
                    color: 'white',
                    borderRadius: 3,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    px: 3,
                    boxShadow: '4px 4px 0 0 #94a3b8',
                    border: '2px solid #0f172a',
                    '&:hover': {
                        bgcolor: '#1e293b',
                        boxShadow: '2px 2px 0 0 #94a3b8',
                        transform: 'translate(2px, 2px)'
                    }
                }}
            >
                Download .txt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};