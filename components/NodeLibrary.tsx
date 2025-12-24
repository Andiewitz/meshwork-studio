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
    Cloud,
    Box
} from 'lucide-react';

interface NodeLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NodeItemProps {
    type: string;
    label: string;
    icon?: any;
    logo?: string;
    colorClass: string;
    middlewareType?: string;
}

const NodeItem = ({ type, label, icon: Icon, logo, colorClass, middlewareType }: NodeItemProps) => {
  // Extract color name to generate pastel background + contrasting border
  // Input format expected: "text-color-shade" (e.g. text-sky-600)
  const colorMatch = colorClass.match(/text-([a-z]+)-/);
  const color = colorMatch ? colorMatch[1] : 'slate';
  
  // Dynamic classes for CDN Tailwind
  const bgClass = `bg-${color}-100`;
  const borderClass = `border-${color}-300`;

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    if (middlewareType) {
        event.dataTransfer.setData('application/middlewareType', middlewareType);
    }
    if (logo) {
        event.dataTransfer.setData('application/logo', logo);
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-900 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#cbd5e1]"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className={`p-2.5 rounded-lg border-2 text-slate-900 ${bgClass} ${borderClass} flex items-center justify-center`}>
        {logo ? (
            <img src={logo} alt={label} className="w-5 h-5 object-contain" />
        ) : (
            Icon && <Icon size={20} />
        )}
      </div>
      <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{label}</span>
    </div>
  );
};

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`
        absolute top-4 bottom-4 right-4 w-96
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

      <div className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth">
        
        {/* Core Infrastructure */}
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 border-b-2 border-slate-100 pb-1">Infrastructure</h3>
            <div className="grid grid-cols-3 gap-3">
                <NodeItem type="client" label="Client App" icon={Monitor} colorClass="text-sky-600" />
                <NodeItem type="loadBalancer" label="Load Balancer" icon={Network} colorClass="text-violet-600" />
                <NodeItem type="server" label="Server" icon={Server} colorClass="text-indigo-600" />
                <NodeItem type="service" label="Service" icon={Cpu} colorClass="text-emerald-600" />
                <NodeItem type="database" label="Database" icon={Database} colorClass="text-blue-600" />
                <NodeItem type="queue" label="Queue" icon={Layers} colorClass="text-amber-600" />
                <NodeItem type="external" label="Generic Ext." icon={Cloud} colorClass="text-slate-600" />
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

        {/* Integrations & Tools */}
        <div>
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 border-b-2 border-slate-100 pb-1">Integrations & Tools</h3>
             
             {/* Cloud Providers */}
             <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-300 uppercase mb-2">Cloud Providers</h4>
                <div className="grid grid-cols-4 gap-2">
                    <NodeItem type="external" label="AWS" logo="https://cdn.simpleicons.org/amazonwebservices" colorClass="text-slate-600" />
                    <NodeItem type="external" label="GCP" logo="https://cdn.simpleicons.org/googlecloud" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Azure" logo="https://cdn.simpleicons.org/microsoftazure" colorClass="text-slate-600" />
                    <NodeItem type="external" label="DigitalOcean" logo="https://cdn.simpleicons.org/digitalocean" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Vercel" logo="https://cdn.simpleicons.org/vercel" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Netlify" logo="https://cdn.simpleicons.org/netlify" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Heroku" logo="https://cdn.simpleicons.org/heroku" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Fly.io" logo="https://cdn.simpleicons.org/flydotio" colorClass="text-slate-600" />
                </div>
             </div>

             {/* Containers & Orchestration */}
             <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-300 uppercase mb-2">Containers & Orchestration</h4>
                <div className="grid grid-cols-4 gap-2">
                    <NodeItem type="external" label="Docker" logo="https://cdn.simpleicons.org/docker/2496ED" colorClass="text-sky-600" />
                    <NodeItem type="external" label="Kubernetes" logo="https://cdn.simpleicons.org/kubernetes/326CE5" colorClass="text-blue-600" />
                    <NodeItem type="external" label="Helm" logo="https://cdn.simpleicons.org/helm" colorClass="text-slate-600" />
                    <NodeItem type="external" label="ArgoCD" logo="https://cdn.simpleicons.org/argo" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Podman" logo="https://cdn.simpleicons.org/podman" colorClass="text-slate-600" />
                </div>
             </div>

             {/* DevOps & IaC */}
             <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-300 uppercase mb-2">DevOps & IaC</h4>
                <div className="grid grid-cols-4 gap-2">
                    <NodeItem type="external" label="Terraform" logo="https://cdn.simpleicons.org/terraform/7B42BC" colorClass="text-violet-600" />
                    <NodeItem type="external" label="Ansible" logo="https://cdn.simpleicons.org/ansible" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Jenkins" logo="https://cdn.simpleicons.org/jenkins" colorClass="text-slate-600" />
                    <NodeItem type="external" label="GitHub Actions" logo="https://cdn.simpleicons.org/githubactions" colorClass="text-slate-600" />
                    <NodeItem type="external" label="GitLab CI" logo="https://cdn.simpleicons.org/gitlab" colorClass="text-slate-600" />
                    <NodeItem type="external" label="CircleCI" logo="https://cdn.simpleicons.org/circleci" colorClass="text-slate-600" />
                </div>
             </div>

             {/* Monitoring & Logging */}
             <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-300 uppercase mb-2">Monitoring & Observability</h4>
                <div className="grid grid-cols-4 gap-2">
                    <NodeItem type="external" label="Prometheus" logo="https://cdn.simpleicons.org/prometheus/E6522C" colorClass="text-orange-600" />
                    <NodeItem type="external" label="Grafana" logo="https://cdn.simpleicons.org/grafana/F46800" colorClass="text-orange-600" />
                    <NodeItem type="external" label="Datadog" logo="https://cdn.simpleicons.org/datadog/632CA6" colorClass="text-purple-600" />
                    <NodeItem type="external" label="New Relic" logo="https://cdn.simpleicons.org/newrelic" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Splunk" logo="https://cdn.simpleicons.org/splunk" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Elastic" logo="https://cdn.simpleicons.org/elastic" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Sentry" logo="https://cdn.simpleicons.org/sentry" colorClass="text-slate-600" />
                    <NodeItem type="external" label="PagerDuty" logo="https://cdn.simpleicons.org/pagerduty" colorClass="text-slate-600" />
                </div>
             </div>

             {/* SaaS & APIs */}
             <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-300 uppercase mb-2">SaaS & APIs</h4>
                <div className="grid grid-cols-4 gap-2">
                    <NodeItem type="external" label="Stripe" logo="https://cdn.simpleicons.org/stripe/008CDD" colorClass="text-indigo-600" />
                    <NodeItem type="external" label="PayPal" logo="https://cdn.simpleicons.org/paypal" colorClass="text-blue-600" />
                    <NodeItem type="external" label="Auth0" logo="https://cdn.simpleicons.org/auth0" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Twilio" logo="https://cdn.simpleicons.org/twilio" colorClass="text-red-600" />
                    <NodeItem type="external" label="SendGrid" logo="https://cdn.simpleicons.org/twilio" colorClass="text-blue-600" />
                    <NodeItem type="external" label="Slack" logo="https://cdn.simpleicons.org/slack" colorClass="text-slate-600" />
                    <NodeItem type="external" label="Discord" logo="https://cdn.simpleicons.org/discord/5865F2" colorClass="text-indigo-600" />
                    <NodeItem type="external" label="OpenAI" logo="https://cdn.simpleicons.org/openai" colorClass="text-slate-600" />
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};