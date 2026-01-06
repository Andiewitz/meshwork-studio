import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Smartphone, Laptop, Monitor, User } from 'lucide-react';
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
  const isPhone = clientType === 'phone';
  const containerClasses = isPhone ? "w-32 h-52 rounded-[2.5rem]" : "w-52 h-36 rounded-3xl";

  return (
    <div className={`relative group ${containerClasses} transition-all duration-200 ${selected ? '-translate-y-1' : ''}`}>
      <div className={`absolute inset-0 bg-slate-900 rounded-[inherit] transition-transform duration-200 ${selected ? 'translate-x-3 translate-y-3' : 'translate-x-1.5 translate-y-1.5'}`} />
      
      <div className={`
        relative w-full h-full flex flex-col bg-white border-[3px] border-slate-900 rounded-[inherit] overflow-hidden
        ${selected ? 'bg-sky-50' : ''}
      `}>
        <div className="bg-sky-500 px-4 py-2.5 flex items-center justify-between text-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <User size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">End User</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-white border border-slate-900" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className={`mb-3 text-sky-600 transition-transform ${selected ? 'scale-110' : ''}`}>
               <Icon size={isPhone ? 36 : 48} strokeWidth={1.5} />
            </div>
            <div className="text-sm font-black text-slate-900 font-heading leading-tight uppercase px-1">
              {data.label}
            </div>
            <div className="mt-1 text-[8px] font-bold text-slate-400">VIA {clientType.toUpperCase()}</div>
        </div>

        <div className="h-6 bg-slate-50 flex items-center justify-center gap-1.5">
           <div className="w-1 h-1 rounded-full bg-slate-300" />
           <div className="w-1 h-1 rounded-full bg-slate-300" />
           <div className="w-1 h-1 rounded-full bg-slate-300" />
        </div>
      </div>

      <Handle id="b" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
      <Handle id="t" type="target" position={Position.Top} className="!w-3 !h-3 !bg-white !border-[3px] !border-slate-900" />
    </div>
  );
});