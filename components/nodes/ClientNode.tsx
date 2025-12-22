import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Smartphone, Laptop, Monitor } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const ClientNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const clientType = (data.clientType as string) || 'desktop';

  const getIcon = () => {
    switch (clientType) {
      case 'phone': return Smartphone;
      case 'laptop': return Laptop;
      case 'desktop': return Monitor;
      default: return Monitor;
    }
  };

  const Icon = getIcon();

  // Dimensions and Shape based on type
  // Phone: Taller, narrower (Portrait Rectangle)
  // Laptop/Desktop: Wider (Landscape Rectangle)
  const isPhone = clientType === 'phone';
  
  const containerClasses = isPhone 
    ? "w-28 h-48 rounded-[2rem]" 
    : "w-48 h-32 rounded-2xl";

  // Icon size: Scaled down to prevent overcrowding
  const iconSize = isPhone ? 42 : 56;

  return (
    <div className={`
      relative group ${containerClasses}
      transition-all duration-300 ease-in-out
      ${selected ? 'scale-105' : 'hover:scale-102'}
    `}>
      {/* Selection Glow */}
      <div className={`
        absolute -inset-1 bg-sky-500 rounded-[inherit] blur-md opacity-0 transition-opacity duration-300
        ${selected ? 'opacity-40' : 'group-hover:opacity-20'}
      `} />

      {/* Main Container */}
      <div className={`
        relative w-full h-full flex flex-col items-center justify-between p-4
        bg-zinc-900 border-[3px] rounded-[inherit]
        ${selected ? 'border-sky-500' : 'border-zinc-800 group-hover:border-zinc-700'}
        shadow-xl transition-colors overflow-hidden
      `}>
        
        {/* Icon Area - Filling space */}
        <div className={`flex-1 flex items-center justify-center text-sky-500 ${isPhone ? 'mt-2' : ''}`}>
             <Icon size={iconSize} strokeWidth={1} />
        </div>

        {/* Label Area */}
        <div className="text-center z-10 bg-zinc-900/80 backdrop-blur-sm rounded-lg px-2 py-1 max-w-full mb-1">
            <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Client</div>
            <div className="text-xs font-bold text-white font-heading truncate w-full px-1">{data.label}</div>
        </div>
      </div>

      {/* Handles */}
      <Handle id="bottom" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-sky-500 !border-4 !border-zinc-900" />
      <Handle id="top" type="target" position={Position.Top} className="!w-3 !h-3 !bg-sky-500 !border-4 !border-zinc-900" />
      
      {/* Side handles for convenience */}
       <Handle id="right" type="source" position={Position.Right} className="!w-3 !h-3 !bg-sky-500 !border-4 !border-zinc-900" />
       <Handle id="left" type="target" position={Position.Left} className="!w-3 !h-3 !bg-sky-500 !border-4 !border-zinc-900" />

    </div>
  );
});