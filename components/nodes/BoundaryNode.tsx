import React, { memo } from 'react';
import { NodeResizer, NodeProps } from 'reactflow';
import { Shield, Globe, Lock, Network } from 'lucide-react';
import { FlowNodeData } from '../../types';

export const BoundaryNode = memo(({ data, selected, xPos, yPos }: NodeProps<FlowNodeData>) => {
  const subType = data.subType || 'vpc';

  const getTheme = () => {
    switch (subType) {
      case 'internet':
        return {
          icon: Globe,
          label: 'Public Internet',
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50/50',
          headerColor: 'bg-blue-500',
          borderStyle: 'border-solid'
        };
      case 'subnet':
        return {
          icon: Lock,
          label: 'Subnet / DMZ',
          borderColor: 'border-slate-400',
          bgColor: 'bg-slate-50/30',
          headerColor: 'bg-slate-600',
          borderStyle: 'border-dashed'
        };
      case 'vpc':
      default:
        return {
          icon: Shield,
          label: 'VPC / Network Zone',
          borderColor: 'border-indigo-600',
          bgColor: 'bg-indigo-50/40',
          headerColor: 'bg-indigo-600',
          borderStyle: 'border-solid'
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div className={`relative w-full h-full min-w-[300px] min-h-[200px]`}>
      <NodeResizer 
        color="#0f172a" 
        isVisible={selected} 
        minWidth={250} 
        minHeight={150} 
        lineStyle={{ border: '2px solid #0f172a' }}
        handleStyle={{ width: 12, height: 12, border: '3px solid #0f172a', backgroundColor: 'white' }}
      />
      
      {/* Background with subtle grid/pattern to show it's a zone */}
      <div 
        className={`
          w-full h-full rounded-3xl border-[3px] shadow-[8px_8px_0_0_#0f172a]
          ${theme.borderColor} ${theme.bgColor} ${theme.borderStyle}
          transition-colors duration-200 pointer-events-none
        `}
        style={{
          backgroundImage: subType === 'vpc' ? 'radial-gradient(#6366f1 1px, transparent 1px)' : 'none',
          backgroundSize: '20px 20px',
          opacity: 0.8
        }}
      />

      {/* Label Tab */}
      <div className={`
        absolute -top-4 left-6 px-4 py-1.5 rounded-xl border-2 border-slate-900 
        ${theme.headerColor} text-white shadow-[4px_4px_0_0_#0f172a]
        flex items-center gap-2 z-10
      `}>
        <Icon size={14} strokeWidth={3} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {data.label || theme.label}
        </span>
      </div>

      {/* Coordinate Indicator (Optional, but looks pro) */}
      <div className="absolute bottom-3 right-5 text-[8px] font-mono font-bold text-slate-400 select-none">
        ZONE_LOC: {Math.round(xPos)}, {Math.round(yPos)}
      </div>
    </div>
  );
});