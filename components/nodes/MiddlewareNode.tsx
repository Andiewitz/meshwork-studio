import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Layers, Activity, ShieldCheck, Zap } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const MiddlewareNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const mwType = (data.middlewareType as string) || 'generic';
  const techLogo = data.techLogo as string | undefined;
  const techName = data.techName as string | undefined;

  const getTheme = () => {
    switch(mwType) {
      case 'auth': return { icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-50' };
      case 'cache': return { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' };
      default: return { icon: Layers, color: 'text-sky-500', bg: 'bg-sky-50' };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div className={`relative group w-44 h-20 transition-all duration-200 ${selected ? '-translate-y-1' : ''}`}>
      <div className={`absolute inset-0 bg-slate-900 rounded-2xl transition-transform duration-200 ${selected ? 'translate-x-2 translate-y-2' : 'translate-x-1 translate-y-1'}`} />
      
      <div className={`
        relative w-full h-full flex items-center bg-white border-[3px] border-slate-900 rounded-2xl p-3
        ${selected ? theme.bg : ''}
      `}>
        <div className={`w-10 h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 overflow-hidden ${techLogo ? 'bg-white p-1' : 'bg-slate-50'}`}>
          {techLogo ? (
            <img src={techLogo} alt="" className="w-full h-full object-contain" />
          ) : (
            <Icon size={18} strokeWidth={3} className={theme.color} />
          )}
        </div>

        <div className="ml-3 min-w-0">
          <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest truncate">
            {techName || mwType}
          </div>
          <div className="text-[11px] font-black text-slate-900 font-heading leading-none truncate">
            {data.label}
          </div>
        </div>
      </div>

      <Handle id="l" type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-white !border-2 !border-slate-900" />
      <Handle id="r" type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-white !border-2 !border-slate-900" />
    </div>
  );
});