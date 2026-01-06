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

// --- UTILS: FUZZY SEARCH ---

// Calculates the number of edits (inserts, deletes, substitutes) to turn a into b
const getLevenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[b.length][a.length];
};

// --- CONFIGURATION ---

type Variant = 'blue' | 'emerald' | 'rose' | 'amber' | 'violet' | 'slate' | 'pink' | 'cyan' | 'orange' | 'lime' | 'indigo' | 'teal' | 'red';

interface NodePreset {
    type: string;
    label: string;
    description?: string;
    logo?: string; // URL for simpleicons or other assets
    variant: Variant;
    data?: Record<string, any>; // Preset data to inject
    keywords?: string[]; // For the fuzzy guesser
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
            { type: 'server', label: 'Server', variant: 'slate', data: {}, keywords: ['host', 'machine', 'linux', 'ubuntu', 'ec2', 'droplet', 'compute'] },
            { type: 'server', label: 'Virtual Machine', variant: 'indigo', data: { subType: 'vm' }, keywords: ['vm', 'virtualization', 'hypervisor', 'guest'] },
            { type: 'service', label: 'Docker Container', variant: 'blue', logo: iconUrl('docker', '2496ED'), keywords: ['container', 'image', 'compose', 'swarm'] },
            { type: 'server', label: 'K8s Pod', variant: 'blue', logo: iconUrl('kubernetes', '326CE5'), keywords: ['kubernetes', 'orchestration', 'cluster', 'deployment', 'replica'] },
            { type: 'service', label: 'AWS Lambda', variant: 'orange', logo: iconUrl('amazonaws', 'FF9900'), data: { subType: 'serverless' }, keywords: ['serverless', 'function', 'faas', 'compute'] },
            { type: 'service', label: 'Google Cloud Run', variant: 'blue', logo: iconUrl('googlecloud', '4285F4'), keywords: ['gcp', 'serverless', 'container', 'scale'] },
            { type: 'server', label: 'Bare Metal', variant: 'slate', description: 'Physical Hardware', keywords: ['physical', 'on-premise', 'rack'] },
            { type: 'service', label: 'App Service', variant: 'cyan', keywords: ['paas', 'platform', 'hosting', 'heroku'] },
        ]
    },
    {
        id: 'storage',
        label: 'Databases & Storage',
        icon: Database,
        items: [
            { type: 'database', label: 'PostgreSQL', variant: 'blue', logo: iconUrl('postgresql', '4169E1'), data: { dbType: 'sql' }, keywords: ['sql', 'relational', 'pg', 'postgres', 'elephantsql'] },
            { type: 'database', label: 'MySQL', variant: 'blue', logo: iconUrl('mysql', '4479A1'), data: { dbType: 'sql' }, keywords: ['sql', 'relational', 'mariadb', 'lamp'] },
            { type: 'database', label: 'MongoDB', variant: 'emerald', logo: iconUrl('mongodb', '47A248'), data: { dbType: 'nosql' }, keywords: ['nosql', 'document', 'json', 'bson', 'atlas'] },
            { type: 'database', label: 'Redis Cache', variant: 'red', logo: iconUrl('redis', 'DC382D'), data: { dbType: 'cache' }, keywords: ['kv', 'key-value', 'store', 'memory', 'fast'] },
            { type: 'database', label: 'S3 Bucket', variant: 'orange', logo: iconUrl('amazonaws', 'FF9900'), data: { dbType: 'blob' }, keywords: ['object', 'storage', 'file', 'upload', 'bucket', 'blob'] },
            { type: 'database', label: 'Cassandra', variant: 'cyan', logo: iconUrl('apachecassandra', '1287B1'), keywords: ['wide-column', 'nosql', 'scale'] },
            { type: 'database', label: 'Elasticsearch', variant: 'teal', logo: iconUrl('elasticsearch', '005571'), keywords: ['search', 'index', 'lucene', 'elk'] },
            { type: 'database', label: 'Snowflake', variant: 'blue', logo: iconUrl('snowflake', '29B5E8'), keywords: ['warehouse', 'analytics', 'olap'] },
            { type: 'database', label: 'DynamoDB', variant: 'blue', logo: iconUrl('amazonaws', 'FF9900'), keywords: ['aws', 'nosql', 'key-value'] },
            { type: 'database', label: 'Supabase', variant: 'emerald', logo: iconUrl('supabase', '3ECF8E'), keywords: ['firebase', 'alternative', 'postgres', 'realtime'] },
            { type: 'database', label: 'Firebase', variant: 'amber', logo: iconUrl('firebase', 'FFCA28'), keywords: ['google', 'realtime', 'firestore', 'nosql'] },
            { type: 'database', label: 'Neo4j', variant: 'indigo', logo: iconUrl('neo4j', '008CC1'), keywords: ['graph', 'network', 'relationship'] },
        ]
    },
    {
        id: 'networking',
        label: 'Networking & Content',
        icon: Network,
        items: [
            { type: 'loadBalancer', label: 'Load Balancer', variant: 'violet', keywords: ['traffic', 'distribution', 'elb', 'alb'] },
            { type: 'loadBalancer', label: 'Nginx', variant: 'emerald', logo: iconUrl('nginx', '009639'), keywords: ['web server', 'proxy', 'reverse proxy'] },
            { type: 'middleware', label: 'CDN', variant: 'orange', logo: iconUrl('cloudflare', 'F38020'), data: { middlewareType: 'cache' }, keywords: ['content', 'delivery', 'edge', 'cache', 'static'] },
            { type: 'middleware', label: 'API Gateway', variant: 'rose', data: { middlewareType: 'gateway' }, keywords: ['rest', 'endpoint', 'router', 'management'] },
            { type: 'middleware', label: 'Kong Gateway', variant: 'emerald', logo: iconUrl('kong', '0033A0'), keywords: ['api', 'management', 'proxy'] },
            { type: 'junction', label: 'Router / Switch', variant: 'slate', keywords: ['network', 'path', 'split'] },
            { type: 'boundary', label: 'VPC Network', variant: 'indigo', data: { subType: 'vpc' }, keywords: ['cloud', 'virtual', 'private', 'network', 'aws'] },
            { type: 'boundary', label: 'Private Subnet', variant: 'slate', data: { subType: 'subnet' }, keywords: ['segment', 'isolation', 'ip', 'range'] },
            { type: 'boundary', label: 'Public Internet', variant: 'blue', data: { subType: 'internet' }, keywords: ['www', 'world', 'external'] },
            { type: 'middleware', label: 'DNS', variant: 'amber', data: { middlewareType: 'dns' }, keywords: ['route53', 'domain', 'name', 'lookup'] },
            { type: 'middleware', label: 'VPN / Tunnel', variant: 'slate', data: { middlewareType: 'vpn' }, keywords: ['secure', 'connection', 'tunnel', 'remote'] },
        ]
    },
    {
        id: 'messaging',
        label: 'Queues & Streaming',
        icon: MessageSquare,
        items: [
            { type: 'queue', label: 'Kafka', variant: 'slate', logo: iconUrl('apachekafka', '231F20'), keywords: ['stream', 'event', 'broker', 'producer', 'consumer'] },
            { type: 'queue', label: 'RabbitMQ', variant: 'orange', logo: iconUrl('rabbitmq', 'FF6600'), keywords: ['message', 'broker', 'amqp'] },
            { type: 'queue', label: 'AWS SQS', variant: 'violet', logo: iconUrl('amazonaws', 'FF9900'), keywords: ['queue', 'message', 'simple'] },
            { type: 'queue', label: 'ActiveMQ', variant: 'slate', keywords: ['apache', 'jms', 'message'] },
            { type: 'queue', label: 'Pub/Sub', variant: 'blue', logo: iconUrl('googlecloud', '4285F4'), keywords: ['publish', 'subscribe', 'google', 'gcp'] },
            { type: 'queue', label: 'Event Bus', variant: 'emerald', keywords: ['event', 'driven', 'architecture'] },
        ]
    },
    {
        id: 'ai_ml',
        label: 'AI & Machine Learning',
        icon: Zap,
        items: [
            { type: 'external', label: 'OpenAI API', variant: 'emerald', logo: iconUrl('openai', '412991'), keywords: ['gpt', 'chatgpt', 'llm', 'generative'] },
            { type: 'external', label: 'Hugging Face', variant: 'amber', logo: iconUrl('huggingface', 'FFD21E'), keywords: ['model', 'transformer', 'nlp'] },
            { type: 'database', label: 'Vector DB', variant: 'violet', data: { dbType: 'vector' }, keywords: ['embedding', 'similarity', 'search'] },
            { type: 'database', label: 'Pinecone', variant: 'cyan', logo: iconUrl('pinecone', '000000'), keywords: ['vector', 'index', 'search'] },
            { type: 'service', label: 'ML Model', variant: 'indigo', keywords: ['training', 'inference', 'prediction'] },
            { type: 'service', label: 'Inference Engine', variant: 'slate', keywords: ['gpu', 'tpu', 'compute'] },
        ]
    },
    {
        id: 'clients',
        label: 'Clients & Devices',
        icon: Monitor,
        items: [
            { type: 'client', label: 'Web Browser', variant: 'blue', data: { clientType: 'desktop' }, keywords: ['chrome', 'firefox', 'safari', 'user', 'frontend'] },
            { type: 'client', label: 'Mobile App', variant: 'rose', data: { clientType: 'phone' }, keywords: ['ios', 'android', 'tablet', 'phone'] },
            { type: 'client', label: 'IoT Device', variant: 'emerald', data: { clientType: 'iot' }, keywords: ['sensor', 'embedded', 'hardware'] },
            { type: 'client', label: 'CLI / Terminal', variant: 'slate', data: { clientType: 'terminal' }, keywords: ['console', 'command', 'shell'] },
            { type: 'external', label: 'External User', variant: 'slate', data: {}, keywords: ['customer', 'human', 'actor'] },
        ]
    },
    {
        id: 'saas',
        label: 'SaaS & Integrations',
        icon: Globe,
        items: [
            { type: 'external', label: 'Stripe', variant: 'violet', logo: iconUrl('stripe', '008CDD'), keywords: ['payment', 'money', 'card', 'checkout'] },
            { type: 'external', label: 'Auth0', variant: 'orange', logo: iconUrl('auth0', 'EB5424'), keywords: ['authentication', 'login', 'identity', 'oauth'] },
            { type: 'external', label: 'Twilio', variant: 'red', logo: iconUrl('twilio', 'F22F46'), keywords: ['sms', 'email', 'communication'] },
            { type: 'external', label: 'SendGrid', variant: 'blue', logo: iconUrl('sendgrid', '1A82E2'), keywords: ['email', 'marketing', 'smtp'] },
            { type: 'external', label: 'Slack', variant: 'emerald', logo: iconUrl('slack', '4A154B'), keywords: ['chat', 'notification', 'bot'] },
            { type: 'external', label: 'Discord', variant: 'indigo', logo: iconUrl('discord', '5865F2'), keywords: ['chat', 'voice', 'community'] },
            { type: 'external', label: 'GitHub', variant: 'slate', logo: iconUrl('github', '181717'), keywords: ['repo', 'code', 'version', 'control'] },
        ]
    },
    {
        id: 'devops',
        label: 'DevOps & Tools',
        icon: Terminal,
        items: [
            { type: 'external', label: 'Jenkins', variant: 'red', logo: iconUrl('jenkins', 'D24939'), keywords: ['ci', 'cd', 'build', 'pipeline'] },
            { type: 'external', label: 'GitHub Actions', variant: 'blue', logo: iconUrl('githubactions', '2088FF'), keywords: ['workflow', 'ci', 'automation'] },
            { type: 'external', label: 'Terraform', variant: 'violet', logo: iconUrl('terraform', '7B42BC'), keywords: ['iac', 'infrastructure', 'provisioning'] },
            { type: 'service', label: 'Prometheus', variant: 'orange', logo: iconUrl('prometheus', 'E6522C'), keywords: ['metrics', 'monitoring', 'alerting'] },
            { type: 'service', label: 'Grafana', variant: 'orange', logo: iconUrl('grafana', 'F46800'), keywords: ['dashboard', 'visualization', 'observability'] },
            { type: 'service', label: 'Datadog', variant: 'violet', logo: iconUrl('datadog', '632CA6'), keywords: ['apm', 'logs', 'monitoring'] },
            { type: 'external', label: 'Sentry', variant: 'rose', logo: iconUrl('sentry', '362D59'), keywords: ['error', 'tracking', 'bugs'] },
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

  // Filter logic with Keyword guessing and Fuzzy Search
  const filteredLibrary = useMemo(() => {
    if (!search.trim()) return LIBRARY_DATA;
    
    const lowerSearch = search.toLowerCase();
    
    return LIBRARY_DATA.map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
            // 1. Direct label match
            if (item.label.toLowerCase().includes(lowerSearch)) return true;
            
            // 2. Type match
            if (item.type.toLowerCase().includes(lowerSearch)) return true;

            // 3. Keyword match (Semantic Search)
            if (item.keywords && item.keywords.some(k => k.includes(lowerSearch))) return true;

            // 4. Fuzzy Match (Typo Tolerance)
            // Only apply fuzzy search if search term is > 3 chars to avoid noise
            if (lowerSearch.length > 3) {
                // Check Label
                if (getLevenshteinDistance(item.label.toLowerCase(), lowerSearch) <= 2) return true;
                
                // Check Keywords
                if (item.keywords && item.keywords.some(k => getLevenshteinDistance(k, lowerSearch) <= 2)) return true;
            }

            return false;
        })
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
                  placeholder="Type to search or guess..." 
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
                <p className="text-sm font-medium">No matches found.</p>
                <p className="text-xs text-slate-700 mt-1">Try a different keyword.</p>
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