import React, { memo } from 'react';
import { NodeResizer, NodeProps } from 'reactflow';
import { Network } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const BoundaryNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const isSubnet = data.subType === 'subnet';
  return (
    <div className="relative w-full h-full min-w-[200px] min-h-[150px]">
      <NodeResizer 
        color="#0f172a" 
        isVisible={selected} 
        minWidth={200} 
        minHeight={150} 
        lineStyle={{ border: '2px solid #0f172a' }}
        handleStyle={{ width: 10, height: 10, border: '2px solid #0f172a', backgroundColor: 'white', borderRadius: '2px' }}
      />
      
      <div 
        className={`
          w-full h-full rounded-xl border-2 shadow-[4px_4px_0_0_#0f172a]
          ${isSubnet ? 'border-dashed border-slate-400 bg-slate-50/20' : 'border-slate-900 bg-slate-50/50'}
          transition-all duration-200 pointer-events-none
        `}
      />

      <div className={`
        absolute -top-3 left-4 px-3 py-1 rounded-lg border-2 border-slate-900 
        bg-white text-slate-900 shadow-[2px_2px_0_0_#0f172a]
        flex items-center gap-2 z-10
      `}>
        <Network size={12} strokeWidth={3} className="text-indigo-500" />
        <span className="text-[9px] font-black uppercase tracking-widest">
          {data.label || 'Network Zone'}
        </span>
      </div>
    </div>
  );
});