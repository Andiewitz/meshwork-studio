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
          bgColor: 'bg-blue-50/20',
          headerColor: 'bg-blue-500',
          borderStyle: 'border-solid'
        };
      case 'subnet':
        return {
          icon: Lock,
          label: 'Subnet / DMZ',
          borderColor: 'border-slate-400',
          bgColor: 'bg-slate-50/10',
          headerColor: 'bg-slate-600',
          borderStyle: 'border-dashed'
        };
      case 'vpc':
      default:
        return {
          icon: Shield,
          label: 'VPC / Network Zone',
          borderColor: 'border-indigo-600',
          bgColor: 'bg-indigo-50/15',
          headerColor: 'bg-indigo-600',
          borderStyle: 'border-solid'
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div className="relative w-full h-full min-w-[300px] min-h-[200px]">
      <NodeResizer 
        color="#0f172a" 
        isVisible={selected} 
        minWidth={250} 
        minHeight={150} 
        lineStyle={{ border: '3px solid #0f172a', borderRadius: '2rem' }}
        handleStyle={{ width: 14, height: 14, border: '4px solid #0f172a', backgroundColor: 'white', borderRadius: '4px' }}
      />
      
      {/* Background with pattern */}
      <div 
        className={`
          w-full h-full rounded-[2.5rem] border-[4px] shadow-[10px_10px_0_0_#0f172a]
          ${theme.borderColor} ${theme.bgColor} ${theme.borderStyle}
          transition-all duration-200 pointer-events-none
        `}
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.8
        }}
      />

      {/* Industrial Label Tab */}
      <div className={`
        absolute -top-5 left-10 px-5 py-2 rounded-2xl border-[3px] border-slate-900 
        ${theme.headerColor} text-white shadow-[5px_5px_0_0_#0f172a]
        flex items-center gap-3 z-10
      `}>
        <Icon size={16} strokeWidth={3} />
        <span className="text-[11px] font-black uppercase tracking-widest">
          {data.label || theme.label}
        </span>
      </div>

      {/* Meta Indicators */}
      <div className="absolute bottom-5 left-8 flex items-center gap-4 text-[9px] font-mono font-black text-slate-400 select-none opacity-40 uppercase tracking-tighter">
        <span>ZONE_ACTIVE</span>
        <span>ID: 0x{Math.abs(xPos + yPos).toString(16).substring(0,4)}</span>
      </div>
    </div>
  );
});