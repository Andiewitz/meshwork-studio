import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Database } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const DatabaseNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const dbLogo = data.dbLogo as string;
  const dbType = data.dbCategory || 'Database';

  return (
    <div className={`relative w-40 h-40 group transition-all duration-200 ${selected ? 'scale-[1.02]' : ''}`}>
      <div className={`
        relative w-full h-full bg-white rounded-lg overflow-hidden flex flex-col
        border border-slate-200 shadow-sm transition-all duration-200
        ${selected ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-md hover:border-blue-300'}
      `}>
        {/* Header */}
        <div className="bg-blue-600 h-1.5 w-full shrink-0" />

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 p-2">
              {dbLogo ? (
                <img src={dbLogo} alt="" className="w-full h-full object-contain" />
              ) : (
                <Database size={24} className="text-blue-600" />
              )}
            </div>
            
            <div className="text-sm font-bold text-slate-900 font-heading leading-tight line-clamp-2 px-1">
              {data.label}
            </div>
            
            <span className="mt-2 inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
               {dbType}
            </span>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-blue-600 !border-2 !border-white transition-all hover:scale-150" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-blue-600 !border-2 !border-white transition-all hover:scale-150" />
    </div>
  );
});