import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Database, Plus } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const DatabaseNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  // Extract custom DB properties if they exist
  const dbName = (data.dbName as string) || data.label;
  const dbCategory = (data.dbCategory as string) || 'Database';
  const dbLogo = (data.dbLogo as string);
  const isConfigured = !!data.dbType;

  return (
    <div className={`
      relative group w-40 h-40 rounded-3xl
      transition-all duration-300 ease-in-out
      ${selected ? 'scale-105 z-10' : 'hover:scale-102'}
    `}>
       {/* Glow Effect */}
       <div className={`
        absolute -inset-1 bg-blue-500 rounded-[28px] blur-md opacity-0 transition-opacity duration-300
        ${selected ? 'opacity-40' : 'group-hover:opacity-20'}
      `} />
      
      {/* Main Container */}
      <div className={`
        relative w-full h-full flex flex-col justify-between p-4 rounded-3xl
        bg-zinc-900 border-[3px]
        ${selected ? 'border-blue-500' : 'border-zinc-800 group-hover:border-zinc-700'}
        transition-colors
      `}>
         {/* Top Section */}
         <div className="flex items-start justify-between">
            <div className={`
              w-10 h-10 rounded-2xl transition-colors flex items-center justify-center
              ${isConfigured ? 'bg-white p-1.5' : 'bg-zinc-800 text-zinc-500 p-2.5'}
            `}>
                {isConfigured && dbLogo ? (
                   <img src={dbLogo} alt={dbName} className="w-full h-full object-contain" />
                ) : (
                   <Database size={24} className={isConfigured ? 'text-blue-500' : ''} />
                )}
            </div>
            
            {!isConfigured && selected && (
              <div className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold animate-pulse">
                Double click
              </div>
            )}
         </div>

         {/* Bottom Section */}
         <div className="flex flex-col">
            {!isConfigured ? (
               // Unconfigured State
               <div className="flex flex-col items-start gap-1">
                 <span className="text-xs font-bold text-zinc-400">Select DB Type</span>
                 <div className="flex items-center gap-1 text-[10px] text-blue-400">
                    <Plus size={10} />
                    <span>Configure</span>
                 </div>
               </div>
            ) : (
               // Configured State
               <>
                 <span className="text-[9px] uppercase tracking-widest text-blue-400/80 font-bold mb-1 block truncate">
                    {dbCategory}
                 </span>
                 <div className="text-sm font-bold text-white font-heading leading-tight line-clamp-2 break-words" title={dbName}>
                    {dbName}
                 </div>
               </>
            )}
         </div>
      </div>

      {/* Handles */}
      <Handle id="top" type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-500 !border-4 !border-zinc-900" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-500 !border-4 !border-zinc-900" />
      <Handle id="left" type="target" position={Position.Left} className="!w-3 !h-3 !bg-blue-500 !border-4 !border-zinc-900" />
      <Handle id="right" type="source" position={Position.Right} className="!w-3 !h-3 !bg-blue-500 !border-4 !border-zinc-900" />
    </div>
  );
});