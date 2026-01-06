import React, { memo, useState, useCallback } from 'react';
import * as ReactFlow from 'reactflow';
import Editor from '@monaco-editor/react';
import { Code2, GripHorizontal } from 'lucide-react';
import { FlowNodeData } from '../../types';

const { NodeResizer, useReactFlow } = ReactFlow;

export const CodeNode = memo(({ id, data, selected }: ReactFlow.NodeProps<FlowNodeData>) => {
  const [code, setCode] = useState(data.code as string || '// Write your snippet here\n\nfunction handler(event) {\n  console.log("Hello Meshwork");\n}');
  const { setNodes } = useReactFlow();

  const handleEditorChange = useCallback((value: string | undefined) => {
    const newVal = value || '';
    setCode(newVal);
    // Debounce save to flow data could happen here, but for now we update directly
    // Ideally we debounce this in a real app to prevent excessive renders
    setNodes((nds) => nds.map((n) => {
        if (n.id === id) {
            return { ...n, data: { ...n.data, code: newVal } };
        }
        return n;
    }));
  }, [id, setNodes]);

  return (
    <div className={`
        relative min-w-[300px] min-h-[200px] h-full w-full
        rounded-xl overflow-hidden flex flex-col
        border-2 transition-all duration-200 bg-[#1e1e1e]
        ${selected ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-slate-800'}
    `}>
      <NodeResizer 
        color={selected ? "#3b82f6" : "transparent"}
        isVisible={selected} 
        minWidth={300} 
        minHeight={200}
      />

      {/* Header (Drag Handle) */}
      <div className="bg-[#2d2d2d] px-3 py-2 flex items-center justify-between border-b border-black shrink-0 drag-handle">
         <div className="flex items-center gap-2 text-slate-400">
            <Code2 size={14} />
            <span className="text-xs font-bold font-mono uppercase">Snippet.js</span>
         </div>
         <GripHorizontal size={14} className="text-slate-600" />
      </div>

      {/* Editor Container */}
      <div className="flex-1 w-full h-full nodrag cursor-text relative">
        <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            onChange={handleEditorChange}
            options={{
                minimap: { enabled: false },
                fontSize: 12,
                fontFamily: "'Fira Code', monospace",
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden'
                },
                padding: { top: 10, bottom: 10 }
            }}
        />
      </div>
      
      {/* Footer Info */}
      <div className="bg-[#2d2d2d] px-3 py-1 border-t border-black shrink-0 flex justify-end">
          <span className="text-[9px] text-slate-500 font-mono">JS / JSON</span>
      </div>
    </div>
  );
});