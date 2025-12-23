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
  // Extract color name to generate pastel background + contrasting border
  // Input format expected: "text-color-shade" (e.g. text-sky-600)
  const colorMatch = colorClass.match(/text-([a-z]+)-/);
  const color = colorMatch ? colorMatch[1] : 'slate';
  
  // Dynamic classes for CDN Tailwind
  // We use shade 100 for background and 300 for border for better visibility/contrast
  const bgClass = `bg-${color}-100`;
  const borderClass = `border-${color}-300`;

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
      className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-900 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#cbd5e1]"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className={`p-2.5 rounded-lg border-2 text-slate-900 ${bgClass} ${borderClass}`}>
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{label}</span>
    </div>
  );
};

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`
        absolute top-4 bottom-4 right-4 w-80 
        bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}
      `}
    >
      <div className="flex items-center justify-between p-4 border-b-2 border-slate-900">
        <h2 className="text-slate-900 font-heading font-bold text-lg">Components</h2>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Core Infrastructure */}
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 border-b-2 border-slate-100 pb-1">Infrastructure</h3>
            <div className="grid grid-cols-2 gap-3">
                <NodeItem type="client" label="Client App" icon={Monitor} colorClass="text-sky-600" />
                <NodeItem type="loadBalancer" label="Load Balancer" icon={Network} colorClass="text-violet-600" />
                <NodeItem type="server" label="Server" icon={Server} colorClass="text-indigo-600" />
                <NodeItem type="service" label="Service" icon={Cpu} colorClass="text-emerald-600" />
                <NodeItem type="database" label="Database" icon={Database} colorClass="text-blue-600" />
                <NodeItem type="queue" label="Queue" icon={Layers} colorClass="text-amber-600" />
                <NodeItem type="external" label="External API" icon={Cloud} colorClass="text-slate-600" />
            </div>
        </div>

        {/* Middleware */}
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 border-b-2 border-slate-100 pb-1">Middleware</h3>
            <div className="grid grid-cols-3 gap-2">
                <NodeItem type="middleware" middlewareType="gateway" label="API Gateway" icon={Globe} colorClass="text-blue-500" />
                <NodeItem type="middleware" middlewareType="auth" label="Auth Guard" icon={ShieldCheck} colorClass="text-emerald-500" />
                <NodeItem type="middleware" middlewareType="cache" label="Cache / CDN" icon={Layers} colorClass="text-red-500" />
                <NodeItem type="middleware" middlewareType="ratelimit" label="Rate Limiter" icon={Gauge} colorClass="text-orange-500" />
                <NodeItem type="middleware" middlewareType="proxy" label="Rev. Proxy" icon={ArrowRightLeft} colorClass="text-violet-500" />
                <NodeItem type="middleware" middlewareType="circuitbreaker" label="Breaker" icon={Zap} colorClass="text-yellow-500" />
                <NodeItem type="middleware" middlewareType="mesh" label="Service Mesh" icon={Network} colorClass="text-cyan-500" />
                <NodeItem type="middleware" middlewareType="security" label="WAF / Sec" icon={Lock} colorClass="text-slate-500" />
            </div>
        </div>

      </div>
    </div>
  );
};