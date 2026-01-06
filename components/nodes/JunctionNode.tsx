import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { FlowNodeData } from '../../types';

export const JunctionNode = memo(({ selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`relative group w-5 h-5 flex items-center justify-center transition-all duration-200`}>
      <div className={`
        w-full h-full rounded-md border-[2.5px] border-slate-900 
        ${selected ? 'bg-blue-500 scale-125' : 'bg-white group-hover:bg-slate-100'}
        transition-all z-10 shadow-sm
      `} />

      <Handle id="t" type="target" position={Position.Top} className="!w-2 !h-2 !opacity-0" />
      <Handle id="b" type="source" position={Position.Bottom} className="!w-2 !h-2 !opacity-0" />
      <Handle id="l" type="target" position={Position.Left} className="!w-2 !h-2 !opacity-0" />
      <Handle id="r" type="source" position={Position.Right} className="!w-2 !h-2 !opacity-0" />
    </div>
  );
});