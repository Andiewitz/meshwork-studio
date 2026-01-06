import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Database, HardDrive, Cpu } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const DatabaseNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const dbName = (data.dbName as string) || data.label;
  const dbLogo = (data.dbLogo as string);
  const isConfigured = !!data.dbType;

  return (
    <div className={`relative group w-44 h-44 transition-all duration-200 ${selected ? '-translate-y-1' : ''}`}>
      <div className={`absolute inset-0 bg-slate-900 rounded-3xl transition-transform duration-200 ${selected ? 'translate-x-3 translate-y-3' : 'translate-x-2 translate-y-2'}`} />
      
      <div className={`
        relative w-full h-full flex flex-col bg-white border-[3px] border-slate-900 rounded-3xl overflow-hidden
        ${selected ? 'bg-indigo-50' : ''}
      `}>
        <div className="bg-indigo-600 px-4 py-2 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <Database size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">Storage</span>
          </div>
          <HardDrive size={12} strokeWidth={3} className="opacity-60" />
        </div>

        <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
            {isConfigured && dbLogo ? (
               <div className="w-14 h-14 mb-3 p-2 bg-slate-50 border-2 border-slate-900 rounded-xl flex items-center justify-center">
                  <img src={dbLogo} alt={dbName} className="w-full h-full object-contain" />
               </div>
            ) : (
               <div className="w-14 h-14 mb-3 bg-slate-100 border-2 border-slate-900 rounded-xl flex items-center justify-center text-slate-400">
                  <Database size={28} />
               </div>
            )}
            
            <div className="text-sm font-black text-slate-900 font-heading leading-tight line-clamp-2 px-2">
              {dbName}
            </div>
            
            {isConfigured && (
              <div className="mt-2 text-[9px] font-bold text-indigo-600 uppercase tracking-tighter">
                {data.dbCategory || 'Managed DB'}
              </div>
            )}
        </div>

        <div className="bg-slate-50 border-t-2 border-slate-900 px-4 py-1.5 flex justify-between">
           <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-slate-300" />
             <div className="w-2 h-2 rounded-full bg-slate-300" />
           </div>
           <span className="text-[8px] font-mono font-bold text-slate-400 tracking-tighter">IOPS: 15.2K</span>
        </div>
      </div>

      <Handle id="t" type="target" position={Position.Top} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="b" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="l" type="target" position={Position.Left} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="r" type="source" position={Position.Right} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
    </div>
  );
});