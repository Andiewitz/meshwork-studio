import React from 'react';
import { 
    Server, 
    Database, 
    Layers, 
    Cpu, 
    X, 
    Network, 
    ShieldCheck, 
    Gauge, 
    Globe, 
    ArrowRightLeft,
    Zap,
    Lock,
    Monitor,
    Cloud
} from 'lucide-react';

interface NodeLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NodeItemProps {
    type: string;
    label: string;
    icon: any;
    colorClass: string;
    middlewareType?: string;
}

const NodeItem = ({ type, label, icon: Icon, colorClass, middlewareType }: NodeItemProps) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    if (middlewareType) {
        event.dataTransfer.setData('application/middlewareType', middlewareType);
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className="flex flex-col items-center gap-2 p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:scale-105"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className={`p-2.5 rounded-lg bg-zinc-900 ${colorClass}`}>
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-medium text-slate-300 text-center leading-tight">{label}</span>
    </div>
  );
};

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`
        absolute top-4 bottom-4 right-4 w-80 
        bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-white font-heading font-semibold">Components</h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Core Infrastructure */}
        <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-1">Infrastructure</h3>
            <div className="grid grid-cols-2 gap-3">
                <NodeItem type="client" label="Client App" icon={Monitor} colorClass="text-sky-500" />
                <NodeItem type="loadBalancer" label="Load Balancer" icon={Network} colorClass="text-violet-500" />
                <NodeItem type="server" label="Server" icon={Server} colorClass="text-indigo-500" />
                <NodeItem type="service" label="Service" icon={Cpu} colorClass="text-emerald-500" />
                <NodeItem type="database" label="Database" icon={Database} colorClass="text-blue-500" />
                <NodeItem type="queue" label="Queue" icon={Layers} colorClass="text-amber-500" />
                <NodeItem type="external" label="External API" icon={Cloud} colorClass="text-slate-400" />
            </div>
        </div>

        {/* Middleware */}
        <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-1">Middleware</h3>
            <div className="grid grid-cols-3 gap-2">
                <NodeItem type="middleware" middlewareType="gateway" label="API Gateway" icon={Globe} colorClass="text-blue-400" />
                <NodeItem type="middleware" middlewareType="auth" label="Auth Guard" icon={ShieldCheck} colorClass="text-emerald-400" />
                <NodeItem type="middleware" middlewareType="cache" label="Cache / CDN" icon={Layers} colorClass="text-red-400" />
                <NodeItem type="middleware" middlewareType="ratelimit" label="Rate Limiter" icon={Gauge} colorClass="text-orange-400" />
                <NodeItem type="middleware" middlewareType="proxy" label="Rev. Proxy" icon={ArrowRightLeft} colorClass="text-violet-400" />
                <NodeItem type="middleware" middlewareType="circuitbreaker" label="Breaker" icon={Zap} colorClass="text-yellow-400" />
                <NodeItem type="middleware" middlewareType="mesh" label="Service Mesh" icon={Network} colorClass="text-cyan-400" />
                <NodeItem type="middleware" middlewareType="security" label="WAF / Sec" icon={Lock} colorClass="text-slate-300" />
            </div>
        </div>

      </div>
    </div>
  );
};