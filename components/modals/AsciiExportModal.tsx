
import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Loader2, FileText, Terminal } from 'lucide-react';
// Fix: Added proper type import GenerateContentResponse as per guidelines
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import type { Node, Edge } from 'reactflow';

interface AsciiExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
}

export const AsciiExportModal: React.FC<AsciiExportModalProps> = ({ isOpen, onClose, nodes, edges }) => {
  const [output, setOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAscii = async () => {
    // Fix: Using process.env.API_KEY directly for initialization as per strict guidelines
    if (!process.env.API_KEY) {
      setError("AI Key missing in environment settings.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      // Fix: Direct initialization using process.env.API_KEY in a named parameter object
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Convert the following system architecture into a professional and clean ASCII art diagram for technical documentation.
        Use standard box-drawing characters if possible, or standard text characters (-, |, +, >).
        
        ARCHITECTURE DATA:
        Nodes: ${nodes.map(n => `[${n.data.label} (${n.type})]`).join(', ')}
        Connections: ${edges.map(e => `${nodes.find(n => n.id === e.source)?.data.label} -> ${nodes.find(n => n.id === e.target)?.data.label} (${e.label || 'connect'})`).join(', ')}
        
        REQUIREMENT: Return ONLY the ASCII art diagram. No preamble, no explanation. Just the text block.
      `;

      // Fix: Use GenerateContentResponse type for consistency with latest SDK examples
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Fix: accessing .text property directly (not calling as a function)
      setOutput(response.text || 'Failed to generate diagram.');
    } catch (err) {
      console.error(err);
      setError("Failed to reach Gemini AI. Check your connection or API key.");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white border-2 border-slate-900 rounded-2xl shadow-[12px_12px_0_0_#0f172a] flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 border-2 border-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">AI Documentation Export</h2>
              <p className="text-xs font-bold text-slate-500 mt-0.5 uppercase tracking-wider">ASCII Architecture Diagram</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {isGenerating ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 size={40} className="animate-spin text-indigo-600" />
              <div className="text-center">
                 <p className="font-bold text-slate-900">Consulting Architect...</p>
                 <p className="text-sm">Gemini is rendering your mesh into text.</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 bg-red-50 border-2 border-red-200 rounded-2xl text-center">
              <p className="font-bold text-red-600 mb-2">{error}</p>
              <button onClick={generateAscii} className="text-sm font-bold text-red-700 underline underline-offset-4">Try Again</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                    <Terminal size={14} />
                    <span>Diagram Output</span>
                 </div>
                 <button 
                  onClick={copyToClipboard}
                  className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-lg border-2 font-bold text-xs transition-all
                    ${copied ? 'bg-emerald-500 border-slate-900 text-white' : 'bg-white border-slate-900 text-slate-900 hover:bg-slate-100'}
                  `}
                 >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                 </button>
              </div>
              <pre className="p-6 bg-slate-900 text-emerald-400 rounded-xl border-2 border-slate-900 shadow-inner overflow-x-auto font-mono text-sm leading-relaxed min-h-[300px]">
                {output}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-slate-100 bg-white flex justify-between items-center shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Gemini 3 Flash</p>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold border-2 border-slate-200 hover:border-slate-900 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
