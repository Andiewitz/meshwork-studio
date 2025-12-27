import React from 'react';
import { 
    Server, 
    Database, 
    Cpu, 
    Globe, 
    Zap, 
    Shield, 
    Lock, 
    Smartphone, 
    Monitor, 
    Network,
    Router,
    ScrollText,
    X,
    Box,
    Search,
    Split,
    LayoutGrid,
    Clock,
    HardDrive,
    Anchor
} from 'lucide-react';

interface NodeLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

type Variant = 'blue' | 'emerald' | 'rose' | 'amber' | 'violet' | 'slate' | 'pink' | 'cyan' | 'orange' | 'lime' | 'indigo' | 'teal';

interface NodeItemProps {
    type: string;
    label: string;
    icon?: any;
    logo?: string;
    variant: Variant;
    middlewareType?: string;
    clientType?: string;
}

const VARIANTS: Record<Variant, { bg: string, border: string, text: string, shadow: string, isLight: boolean }> = {
    blue:   { bg: 'bg-blue-500',   border: 'border-blue-600',   text: 'text-white', shadow: 'shadow-blue-900', isLight: false },
    emerald:{ bg: 'bg-emerald-400', border: 'border-emerald-500', text: 'text-black', shadow: 'shadow-emerald-900', isLight: true },
    rose:   { bg: 'bg-rose-500',    border: 'border-rose-600',    text: 'text-white', shadow: 'shadow-rose-900', isLight: false },
    amber:  { bg: 'bg-amber-400',   border: 'border-amber-500',   text: 'text-black', shadow: 'shadow-amber-900', isLight: true },
    violet: { bg: 'bg-violet-500',  border: 'border-violet-600',  text: 'text-white', shadow: 'shadow-violet-900', isLight: false },
    slate:  { bg: 'bg-slate-800',   border: 'border-slate-900',   text: 'text-white', shadow: 'shadow-slate-900', isLight: false },
    pink:   { bg: 'bg-pink-500',    border: 'border-pink-600',    text: 'text-white', shadow: 'shadow-pink-900', isLight: false },
    cyan:   { bg: 'bg-cyan-400',    border: 'border-cyan-500',    text: 'text-black', shadow: 'shadow-cyan-900', isLight: true },
    orange: { bg: 'bg-orange-500',  border: 'border-orange-600',  text: 'text-white', shadow: 'shadow-orange-900', isLight: false },
    lime:   { bg: 'bg-lime-400',    border: 'border-lime-500',    text: 'text-black', shadow: 'shadow-lime-900', isLight: true },
    indigo: { bg: 'bg-indigo-600',  border: 'border-indigo-700',  text: 'text-white', shadow: 'shadow-indigo-900', isLight: false },
    teal:   { bg: 'bg-teal-400',    border: 'border-teal-500',    text: 'text-black', shadow: 'shadow-teal-900', isLight: true },
};

const NodeItem = ({ type, label, icon: Icon, logo, variant, middlewareType, clientType }: NodeItemProps) => {
  const styles = VARIANTS[variant];
  // Calculate logo filter based on background brightness
  // if background is light, we want black icon (brightness-0)
  // if background is dark, we want white icon (brightness-0 invert)
  const imgFilterClass = styles.isLight ? 'brightness-0' : 'brightness-0 invert';

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    if (middlewareType) event.dataTransfer.setData('application/middlewareType', middlewareType);
    if (clientType) event.dataTransfer.setData('application/clientType', clientType);
    if (logo) event.dataTransfer.setData('application/logo', logo);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className={`
        relative flex flex-col items-center gap-2 p-3 
        bg-white border-2 border-black rounded-xl 
        shadow-[4px_4px_0_0_#000] 
        cursor-grab active:cursor-grabbing 
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] hover:bg-slate-50
        active:translate-y-0 active:shadow-[2px_2px_0_0_#000]
        group
      `}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      {/* Icon Container */}
      <div className={`
        w-10 h-10 flex items-center justify-center rounded-lg border-2 border-black
        ${styles.bg} ${styles.text}
        transition-transform group-hover:scale-110
      `}>
        {logo ? (
            <img 
                src={logo} 
                alt={label} 
                className={`w-6 h-6 object-contain drop-shadow-sm filter ${imgFilterClass}`} 
            />
        ) : (
            Icon && <Icon size={20} strokeWidth={2.5} />
        )}
      </div>
      
      {/* Label */}
      <span className="text-[10px] font-bold text-black text-center leading-tight uppercase tracking-tight">
        {label}
      </span>
    </div>
  );
};

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`
        absolute top-4 bottom-4 right-4 w-[400px]
        bg-[#fdfbf7] border-2 border-black rounded-2xl shadow-[12px_12px_0_0_#000] z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b-2 border-black bg-white rounded-t-2xl">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-violet-500 border-2 border-black rounded-lg flex items-center justify-center text-white">
                 <LayoutGrid size={18} />
             </div>
             <div>
                <h2 className="text-xl font-bold font-heading text-black leading-none">Library</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">Drag & drop to canvas</p>
             </div>
        </div>
        <button 
            onClick={onClose} 
            className="p-2 bg-white border-2 border-black rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px]"
        >
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scroll-smooth no-scrollbar">
        
        {/* Core Infrastructure */}
        <div>
            <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 bg-blue-500 rounded-full border-2 border-black"></span>
                <h3 className="text-sm font-black text-black uppercase tracking-wider">Compute & Host</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <NodeItem type="client" label="User / Client" icon={Monitor} variant="cyan" />
                <NodeItem type="client" label="Mobile" icon={Smartphone} variant="cyan" clientType="phone" />
                <NodeItem type="loadBalancer" label="Load Balancer" icon={Split} variant="pink" />
                <NodeItem type="server" label="App Server" icon={Server} variant="indigo" />
                <NodeItem type="service" label="Microservice" icon={Cpu} variant="emerald" />
                <NodeItem type="server" label="Bare Metal" icon={Box} variant="slate" />
                <NodeItem type="external" label="Function" icon={Zap} variant="orange" />
            </div>
        </div>

        {/* Data & Storage */}
        <div>
            <div className="flex items-center gap-2 mb-4 pt-2 border-t-2 border-dashed border-slate-300">
                <span className="w-3 h-3 bg-amber-400 rounded-full border-2 border-black"></span>
                <h3 className="text-sm font-black text-black uppercase tracking-wider">Data & Storage</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <NodeItem type="database" label="Database" icon={Database} variant="blue" />
                <NodeItem type="database" label="Cache" icon={Zap} variant="amber" />
                <NodeItem type="queue" label="Queue" icon={ScrollText} variant="violet" />
                <NodeItem type="database" label="Search" icon={Search} variant="blue" />
                <NodeItem type="database" label="Time Series" icon={Clock} variant="blue" />
                <NodeItem type="external" label="Storage" icon={HardDrive} variant="slate" />
            </div>
        </div>

        {/* Networking & Security */}
        <div>
            <div className="flex items-center gap-2 mb-4 pt-2 border-t-2 border-dashed border-slate-300">
                <span className="w-3 h-3 bg-rose-500 rounded-full border-2 border-black"></span>
                <h3 className="text-sm font-black text-black uppercase tracking-wider">Net & Security</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <NodeItem type="middleware" middlewareType="gateway" label="API Gateway" icon={Globe} variant="orange" />
                <NodeItem type="middleware" middlewareType="proxy" label="Rev. Proxy" icon={Router} variant="violet" />
                <NodeItem type="middleware" middlewareType="auth" label="Auth Guard" icon={Shield} variant="rose" />
                <NodeItem type="middleware" middlewareType="security" label="WAF" icon={Lock} variant="rose" />
                <NodeItem type="middleware" middlewareType="mesh" label="Service Mesh" icon={Network} variant="teal" />
                <NodeItem type="middleware" middlewareType="ratelimit" label="Rate Limit" icon={Anchor} variant="slate" />
            </div>
        </div>

        {/* Cloud Providers */}
        <div>
             <div className="flex items-center gap-2 mb-4 pt-2 border-t-2 border-dashed border-slate-300">
                <span className="w-3 h-3 bg-slate-800 rounded-full border-2 border-black"></span>
                <h3 className="text-sm font-black text-black uppercase tracking-wider">Cloud & SaaS</h3>
            </div>
             
             {/* AWS */}
             <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Providers</h4>
                <div className="grid grid-cols-4 gap-2">
                    <NodeItem type="external" label="AWS" logo="https://cdn.simpleicons.org/amazonwebservices" variant="slate" />
                    <NodeItem type="external" label="Google" logo="https://cdn.simpleicons.org/googlecloud" variant="slate" />
                    <NodeItem type="external" label="Azure" logo="https://cdn.simpleicons.org/microsoftazure" variant="slate" />
                    <NodeItem type="external" label="DigitalOcean" logo="https://cdn.simpleicons.org/digitalocean" variant="slate" />
                </div>
             </div>

             {/* Containers */}
             <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Containers</h4>
                <div className="grid grid-cols-4 gap-2">
                    <NodeItem type="external" label="Docker" logo="https://cdn.simpleicons.org/docker" variant="blue" />
                    <NodeItem type="external" label="K8s" logo="https://cdn.simpleicons.org/kubernetes" variant="blue" />
                    <NodeItem type="external" label="Helm" logo="https://cdn.simpleicons.org/helm" variant="slate" />
                    <NodeItem type="external" label="Argo" logo="https://cdn.simpleicons.org/argo" variant="slate" />
                </div>
             </div>

             {/* SaaS */}
             <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Services</h4>
                <div className="grid grid-cols-4 gap-2">
                    <NodeItem type="external" label="Stripe" logo="https://cdn.simpleicons.org/stripe" variant="indigo" />
                    <NodeItem type="external" label="Auth0" logo="https://cdn.simpleicons.org/auth0" variant="slate" />
                    <NodeItem type="external" label="Twilio" logo="https://cdn.simpleicons.org/twilio" variant="rose" />
                    <NodeItem type="external" label="OpenAI" logo="https://cdn.simpleicons.org/openai" variant="emerald" />
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};