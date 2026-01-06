import React, { useState, useMemo } from 'react';
import { 
    Server, Database, Cpu, Globe, Zap, Shield, Lock, Smartphone, 
    Monitor, Network, Router, ScrollText, X, Box, Search, Split, 
    LayoutGrid, Activity, Cloud, Layers, Binary, Square,
    ChevronDown, ChevronRight, Terminal, MessageSquare
} from 'lucide-react';
import { CanvasLayer } from '../types';

interface NodeLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  activeLayer: CanvasLayer;
}

// --- CONFIGURATION ---

type Variant = 'blue' | 'emerald' | 'rose' | 'amber' | 'violet' | 'slate' | 'pink' | 'cyan' | 'orange' | 'lime' | 'indigo' | 'teal' | 'red';

interface NodePreset {
    type: string;
    label: string;
    description?: string;
    logo?: string; // URL for simpleicons or other assets
    variant: Variant;
    data?: Record<string, any>; // Preset data to inject
}

interface NodeCategory {
    id: string;
    label: string;
    icon: any;
    items: NodePreset[];
}

// Helper for SimpleIcons
const iconUrl = (slug: string, color: string = 'white') => `https://cdn.simpleicons.org/${slug}/${color}`;

const LIBRARY_DATA: NodeCategory[] = [
    {
        id: 'compute',
        label: 'Compute & Containers',
        icon: Server,
        items: [
            { type: 'server', label: 'Server', variant: 'slate', data: {} },
            { type: 'server', label: 'Virtual Machine', variant: 'indigo', data: { subType: 'vm' } },
            { type: 'service', label: 'Docker Container', variant: 'blue', logo: iconUrl('docker', '2496ED') },
            { type: 'server', label: 'K8s Pod', variant: 'blue', logo: iconUrl('kubernetes', '326CE5') },
            { type: 'service', label: 'AWS Lambda', variant: 'orange', logo: iconUrl('amazonaws', 'FF9900'), data: { subType: 'serverless' } },
            { type: 'service', label: 'Google Cloud Run', variant: 'blue', logo: iconUrl('googlecloud', '4285F4') },
            { type: 'server', label: 'Bare Metal', variant: 'slate', description: 'Physical Hardware' },
            { type: 'service', label: 'App Service', variant: 'cyan' },
        ]
    },
    {
        id: 'storage',
        label: 'Databases & Storage',
        icon: Database,
        items: [
            { type: 'database', label: 'PostgreSQL', variant: 'blue', logo: iconUrl('postgresql', '4169E1'), data: { dbType: 'sql' } },
            { type: 'database', label: 'MySQL', variant: 'blue', logo: iconUrl('mysql', '4479A1'), data: { dbType: 'sql' } },
            { type: 'database', label: 'MongoDB', variant: 'emerald', logo: iconUrl('mongodb', '47A248'), data: { dbType: 'nosql' } },
            { type: 'database', label: 'Redis Cache', variant: 'red', logo: iconUrl('redis', 'DC382D'), data: { dbType: 'cache' } },
            { type: 'database', label: 'S3 Bucket', variant: 'orange', logo: iconUrl('amazonaws', 'FF9900'), data: { dbType: 'blob' } },
            { type: 'database', label: 'Cassandra', variant: 'cyan', logo: iconUrl('apachecassandra', '1287B1') },
            { type: 'database', label: 'Elasticsearch', variant: 'teal', logo: iconUrl('elasticsearch', '005571') },
            { type: 'database', label: 'Snowflake', variant: 'blue', logo: iconUrl('snowflake', '29B5E8') },
            { type: 'database', label: 'DynamoDB', variant: 'blue', logo: iconUrl('amazonaws', 'FF9900') },
            { type: 'database', label: 'Supabase', variant: 'emerald', logo: iconUrl('supabase', '3ECF8E') },
            { type: 'database', label: 'Firebase', variant: 'amber', logo: iconUrl('firebase', 'FFCA28') },
            { type: 'database', label: 'Neo4j', variant: 'indigo', logo: iconUrl('neo4j', '008CC1') },
        ]
    },
    {
        id: 'networking',
        label: 'Networking & Content',
        icon: Network,
        items: [
            { type: 'loadBalancer', label: 'Load Balancer', variant: 'violet' },
            { type: 'loadBalancer', label: 'Nginx', variant: 'emerald', logo: iconUrl('nginx', '009639') },
            { type: 'middleware', label: 'CDN', variant: 'orange', logo: iconUrl('cloudflare', 'F38020'), data: { middlewareType: 'cache' } },
            { type: 'middleware', label: 'API Gateway', variant: 'rose', data: { middlewareType: 'gateway' } },
            { type: 'middleware', label: 'Kong Gateway', variant: 'emerald', logo: iconUrl('kong', '0033A0') },
            { type: 'junction', label: 'Router / Switch', variant: 'slate' },
            { type: 'boundary', label: 'VPC Network', variant: 'indigo', data: { subType: 'vpc' } },
            { type: 'boundary', label: 'Private Subnet', variant: 'slate', data: { subType: 'subnet' } },
            { type: 'boundary', label: 'Public Internet', variant: 'blue', data: { subType: 'internet' } },
            { type: 'middleware', label: 'DNS', variant: 'amber', data: { middlewareType: 'dns' } },
            { type: 'middleware', label: 'VPN / Tunnel', variant: 'slate', data: { middlewareType: 'vpn' } },
        ]
    },
    {
        id: 'messaging',
        label: 'Queues & Streaming',
        icon: MessageSquare,
        items: [
            { type: 'queue', label: 'Kafka', variant: 'slate', logo: iconUrl('apachekafka', '231F20') },
            { type: 'queue', label: 'RabbitMQ', variant: 'orange', logo: iconUrl('rabbitmq', 'FF6600') },
            { type: 'queue', label: 'AWS SQS', variant: 'violet', logo: iconUrl('amazonaws', 'FF9900') },
            { type: 'queue', label: 'ActiveMQ', variant: 'slate' },
            { type: 'queue', label: 'Pub/Sub', variant: 'blue', logo: iconUrl('googlecloud', '4285F4') },
            { type: 'queue', label: 'Event Bus', variant: 'emerald' },
        ]
    },
    {
        id: 'ai_ml',
        label: 'AI & Machine Learning',
        icon: Zap,
        items: [
            { type: 'external', label: 'OpenAI API', variant: 'emerald', logo: iconUrl('openai', '412991') },
            { type: 'external', label: 'Hugging Face', variant: 'amber', logo: iconUrl('huggingface', 'FFD21E') },
            { type: 'database', label: 'Vector DB', variant: 'violet', data: { dbType: 'vector' } },
            { type: 'database', label: 'Pinecone', variant: 'cyan', logo: iconUrl('pinecone', '000000') },
            { type: 'service', label: 'ML Model', variant: 'indigo' },
            { type: 'service', label: 'Inference Engine', variant: 'slate' },
        ]
    },
    {
        id: 'clients',
        label: 'Clients & Devices',
        icon: Monitor,
        items: [
            { type: 'client', label: 'Web Browser', variant: 'blue', data: { clientType: 'desktop' } },
            { type: 'client', label: 'Mobile App', variant: 'rose', data: { clientType: 'phone' } },
            { type: 'client', label: 'IoT Device', variant: 'emerald', data: { clientType: 'iot' } },
            { type: 'client', label: 'CLI / Terminal', variant: 'slate', data: { clientType: 'terminal' } },
            { type: 'external', label: 'External User', variant: 'slate', data: {} },
        ]
    },
    {
        id: 'saas',
        label: 'SaaS & Integrations',
        icon: Globe,
        items: [
            { type: 'external', label: 'Stripe', variant: 'violet', logo: iconUrl('stripe', '008CDD') },
            { type: 'external', label: 'Auth0', variant: 'orange', logo: iconUrl('auth0', 'EB5424') },
            { type: 'external', label: 'Twilio', variant: 'red', logo: iconUrl('twilio', 'F22F46') },
            { type: 'external', label: 'SendGrid', variant: 'blue', logo: iconUrl('sendgrid', '1A82E2') },
            { type: 'external', label: 'Slack', variant: 'emerald', logo: iconUrl('slack', '4A154B') },
            { type: 'external', label: 'Discord', variant: 'indigo', logo: iconUrl('discord', '5865F2') },
            { type: 'external', label: 'GitHub', variant: 'slate', logo: iconUrl('github', '181717') },
        ]
    },
    {
        id: 'devops',
        label: 'DevOps & Tools',
        icon: Terminal,
        items: [
            { type: 'external', label: 'Jenkins', variant: 'red', logo: iconUrl('jenkins', 'D24939') },
            { type: 'external', label: 'GitHub Actions', variant: 'blue', logo: iconUrl('githubactions', '2088FF') },
            { type: 'external', label: 'Terraform', variant: 'violet', logo: iconUrl('terraform', '7B42BC') },
            { type: 'service', label: 'Prometheus', variant: 'orange', logo: iconUrl('prometheus', 'E6522C') },
            { type: 'service', label: 'Grafana', variant: 'orange', logo: iconUrl('grafana', 'F46800') },
            { type: 'service', label: 'Datadog', variant: 'violet', logo: iconUrl('datadog', '632CA6') },
            { type: 'external', label: 'Sentry', variant: 'rose', logo: iconUrl('sentry', '362D59') },
        ]
    }
];

const VARIANTS: Record<Variant, { border: string, text: string, bg: string, glow: string }> = {
    blue:   { border: 'border-blue-500',   text: 'text-blue-400',   bg: 'bg-blue-500/10',   glow: 'shadow-blue-500/20' },
    emerald:{ border: 'border-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
    rose:   { border: 'border-rose-500',    text: 'text-rose-400',    bg: 'bg-rose-500/10',    glow: 'shadow-rose-500/20' },
    amber:  { border: 'border-amber-500',   text: 'text-amber-400',   bg: 'bg-amber-500/10',   glow: 'shadow-amber-500/20' },
    violet: { border: 'border-violet-500',  text: 'text-violet-400',  bg: 'bg-violet-500/10',  glow: 'shadow-violet-500/20' },
    slate:  { border: 'border-slate-500',   text: 'text-slate-400',   bg: 'bg-slate-500/10',   glow: 'shadow-slate-500/20' },
    pink:   { border: 'border-pink-500',    text: 'text-pink-400',    bg: 'bg-pink-500/10',    glow: 'shadow-pink-500/20' },
    cyan:   { border: 'border-cyan-500',    text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    glow: 'shadow-cyan-500/20' },
    orange: { border: 'border-orange-500',  text: 'text-orange-400',  bg: 'bg-orange-500/10',  glow: 'shadow-orange-500/20' },
    lime:   { border: 'border-lime-500',    text: 'text-lime-400',    bg: 'bg-lime-500/10',    glow: 'shadow-lime-500/20' },
    indigo: { border: 'border-indigo-500',  text: 'text-indigo-400',  bg: 'bg-indigo-500/10',  glow: 'shadow-indigo-500/20' },
    teal:   { border: 'border-teal-500',    text: 'text-teal-400',    bg: 'bg-teal-500/10',    glow: 'shadow-teal-500/20' },
    red:    { border: 'border-red-500',     text: 'text-red-400',     bg: 'bg-red-500/10',     glow: 'shadow-red-500/20' },
};

const NodeItem: React.FC<{ item: NodePreset }> = ({ item }) => {
  const styles = VARIANTS[item.variant];

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', item.type);
    event.dataTransfer.setData('application/label', item.label);
    
    // Flatten specific data into transfer
    if (item.data) {
        Object.entries(item.data).forEach(([key, value]) => {
            event.dataTransfer.setData(`application/${key}`, value);
        });
    }
    if (item.logo) event.dataTransfer.setData('application/logo', item.logo);
    
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className={`
        relative flex items-center gap-3 p-3
        bg-slate-900 border border-slate-800 rounded-xl
        cursor-grab active:cursor-grabbing 
        transition-all duration-200
        hover:border-slate-600 hover:bg-slate-800 hover:shadow-lg
        group select-none
      `}
      onDragStart={onDragStart}
      draggable
    >
      <div className={`
        w-10 h-10 flex items-center justify-center rounded-lg border
        ${styles.bg} ${styles.border} ${styles.text} ${styles.glow} shadow-sm
        transition-transform group-hover:scale-105
      `}>
        {item.logo ? (
            <img src={item.logo} alt={item.label} className="w-6 h-6 object-contain" />
        ) : (
            <Box size={20} strokeWidth={2} />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-200 leading-tight truncate">
            {item.label}
          </div>
          <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
             {item.description || item.type.toUpperCase()}
          </div>
      </div>
    </div>
  );
};

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ isOpen, onClose, activeLayer }) => {
  const [search, setSearch] = useState('');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
      'compute': true,
      'storage': true
  });

  const toggleCat = (id: string) => {
      setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter logic
  const filteredLibrary = useMemo(() => {
    if (!search.trim()) return LIBRARY_DATA;
    
    const lowerSearch = search.toLowerCase();
    return LIBRARY_DATA.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.label.toLowerCase().includes(lowerSearch))
    })).filter(cat => cat.items.length > 0);
  }, [search]);

  return (
    <div 
      className={`
        absolute top-0 bottom-0 left-0 w-[360px]
        bg-slate-950 border-r border-slate-800 z-40
        transform transition-transform duration-300 ease-in-out flex flex-col
        shadow-2xl shadow-black
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white border border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                 <LayoutGrid size={18} />
             </div>
             <div>
                <h2 className="text-lg font-bold font-heading text-white leading-none">
                    Components
                </h2>
                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                    {filteredLibrary.reduce((acc, cat) => acc + cat.items.length, 0)} Nodes Available
                </p>
             </div>
        </div>
        <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                  type="text" 
                  placeholder="Search 60+ components..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600 transition-all"
              />
          </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth no-scrollbar">
        {filteredLibrary.map(category => {
            const isExpanded = expandedCats[category.id] || search.length > 0;
            const Icon = category.icon;
            
            return (
                <div key={category.id} className="border border-slate-800 bg-slate-900/30 rounded-xl overflow-hidden">
                    <button 
                        onClick={() => toggleCat(category.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Icon size={16} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{category.label}</span>
                        </div>
                        {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                    </button>
                    
                    {isExpanded && (
                        <div className="p-3 pt-0 grid grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-200">
                            {category.items.map((item, idx) => (
                                <NodeItem key={`${category.id}-${idx}`} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            );
        })}

        {filteredLibrary.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-slate-600">
                <Search size={32} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No components found.</p>
            </div>
        )}
      </div>
      
      {/* Footer Hint */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-center">
          <p className="text-[10px] text-slate-500">
              Drag and drop nodes to canvas
          </p>
      </div>
    </div>
  );
};