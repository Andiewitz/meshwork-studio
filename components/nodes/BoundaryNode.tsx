import React, { memo } from 'react';
import { NodeResizer, NodeProps } from 'reactflow';
import { Network, Shield } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const BoundaryNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const isSubnet = data.subType === 'subnet';
  const label = data.label || (isSubnet ? 'Private Subnet' : 'VPC Network');
  
  return (
    <div className="relative w-full h-full min-w-[200px] min-h-[150px]">
      <NodeResizer 
        color={selected ? "#6366f1" : "transparent"}
        isVisible={selected} 
        minWidth={200} 
        minHeight={150} 
        lineStyle={{ border: '1px solid #6366f1' }}
        handleStyle={{ width: 8, height: 8, border: '1px solid #6366f1', borderRadius: '2px' }}
      />
      
      {/* Container Frame */}
      <div 
        className={`
          w-full h-full rounded-lg border-2
          ${isSubnet ? 'border-dashed border-slate-300 bg-slate-50/30' : 'border-indigo-100 bg-indigo-50/20'}
          transition-all duration-200 pointer-events-none
        `}
      />

      {/* Professional Label Tag */}
      <div className={`
        absolute -top-3 left-4 px-3 py-1 rounded border shadow-sm
        bg-white flex items-center gap-2 z-10
        ${isSubnet ? 'border-slate-300 text-slate-600' : 'border-indigo-200 text-indigo-700'}
      `}>
        {isSubnet ? <Network size={12} /> : <Shield size={12} />}
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
    </div>
  );
});