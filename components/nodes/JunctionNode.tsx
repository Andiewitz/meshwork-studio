import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { FlowNodeData } from '../../types';

export const JunctionNode = memo(({ selected }: NodeProps<FlowNodeData>) => {
  return (
    <div className={`
      relative group w-4 h-4
      flex items-center justify-center
      transition-all duration-200
    `}>
      {/* Glow */}
      <div className={`
        absolute -inset-2 bg-blue-500 rounded-full blur opacity-0 transition-opacity
        ${selected ? 'opacity-50' : 'group-hover:opacity-20'}
      `} />

      {/* The Dot */}
      <div className={`
        w-3 h-3 rounded-full border-2 
        ${selected ? 'bg-blue-500 border-white' : 'bg-zinc-800 border-zinc-600 group-hover:border-blue-500 group-hover:bg-blue-500/50'}
        transition-colors z-10
      `} />

      {/* 4-way handles allowed for routing nodes */}
      <Handle id="top" type="target" position={Position.Top} className="!w-2 !h-2 !opacity-0" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!w-2 !h-2 !opacity-0" />
      <Handle id="left" type="target" position={Position.Left} className="!w-2 !h-2 !opacity-0" />
      <Handle id="right" type="source" position={Position.Right} className="!w-2 !h-2 !opacity-0" />
    </div>
  );
});