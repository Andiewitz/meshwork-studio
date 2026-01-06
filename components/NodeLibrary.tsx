import React, { useState, useMemo } from 'react';
import { 
    Server, Database, Cpu, Globe, Zap, Shield, Lock, Smartphone, 
    Monitor, Network, Router, ScrollText, X, Box, Search, Split, 
    LayoutGrid, Activity, Cloud, Layers, Binary, Square,
    ChevronDown, ChevronRight, Terminal, MessageSquare,
    GitBranch, GitCommit, FileCode, Play, BarChart, Code2, StickyNote,
    Component
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

type Variant = 'blue' | 'emerald' | 'rose' | 'amber' | 'violet' | 'slate' | 'pink' | 'cyan' | 'orange' | 'lime' | 'indigo' | 'teal' | 'red' | 'yellow';

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

// BACKEND CATEGORIES (Standard Arch)
const BACKEND_CATEGORIES: NodeCategory[] = [
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
        ]
    },
    {
        id: 'storage',
        label: 'Databases & Storage',
        icon: Database,
        items: [
            { type: 'database', label: 'PostgreSQL', variant: 'blue', logo: iconUrl('postgresql', '4169E1'), data: { dbType: 'sql' }, keywords: ['sql', 'relational', 'pg', 'postgres'] },
            { type: 'database', label: 'MySQL', variant: 'blue', logo: iconUrl('mysql', '4479A1'), data: { dbType: 'sql' }, keywords: ['sql', 'relational', 'mariadb'] },
            { type: 'database', label: 'MongoDB', variant: 'emerald', logo: iconUrl('mongodb', '47A248'), data: { dbType: 'nosql' }, keywords: ['nosql', 'document', 'json'] },
            { type: 'database', label: 'Redis Cache', variant: 'red', logo: iconUrl('redis', 'DC382D'), data: { dbType: 'cache' }, keywords: ['kv', 'key-value', 'store'] },
            { type: 'database', label: 'S3 Bucket', variant: 'orange', logo: iconUrl('amazonaws', 'FF9900'), data: { dbType: 'blob' }, keywords: ['object', 'storage', 'file'] },
        ]
    },
    {
        id: 'networking',
        label: 'Networking & Content',
        icon: Network,
        items: [
            { type: 'loadBalancer', label: 'Load Balancer', variant: 'violet', keywords: ['traffic', 'distribution', 'elb', 'alb'] },
            { type: 'loadBalancer', label: 'Nginx', variant: 'emerald', logo: iconUrl('nginx', '009639'), keywords: ['web server', 'proxy'] },
            { type: 'middleware', label: 'CDN', variant: 'orange', logo: iconUrl('cloudflare', 'F38020'), data: { middlewareType: 'cache' }, keywords: ['content', 'delivery', 'edge'] },
            { type: 'middleware', label: 'API Gateway', variant: 'rose', data: { middlewareType: 'gateway' }, keywords: ['rest', 'endpoint', 'router'] },
        ]
    },
    {
        id: 'messaging',
        label: 'Queues & Streaming',
        icon: MessageSquare,
        items: [
            { type: 'queue', label: 'Kafka', variant: 'slate', logo: iconUrl('apachekafka', '231F20'), keywords: ['stream', 'event', 'broker'] },
            { type: 'queue', label: 'RabbitMQ', variant: 'orange', logo: iconUrl('rabbitmq', 'FF6600'), keywords: ['message', 'broker'] },
            { type: 'queue', label: 'AWS SQS', variant: 'violet', logo: iconUrl('amazonaws', 'FF9900'), keywords: ['queue', 'message'] },
        ]
    },
    {
        id: 'clients',
        label: 'Clients & Devices',
        icon: Monitor,
        items: [
            { type: 'client', label: 'Web Browser', variant: 'blue', data: { clientType: 'desktop' }, keywords: ['chrome', 'firefox', 'frontend'] },
            { type: 'client', label: 'Mobile App', variant: 'rose', data: { clientType: 'phone' }, keywords: ['ios', 'android'] },
            { type: 'external', label: 'External User', variant: 'slate', data: {}, keywords: ['customer', 'human'] },
        ]
    },
    {
        id: 'misc',
        label: 'Utilities & Misc',
        icon: Component,
        items: [
            { type: 'code', label: 'Code Block', variant: 'slate', logo: iconUrl('javascript', 'F7DF1E'), description: 'Embed code snippets', keywords: ['script', 'snippet', 'monaco', 'js', 'function'] },
            { type: 'note', label: 'Sticky Note', variant: 'yellow', description: 'Add documentation', keywords: ['text', 'comment', 'doc', 'postit'] },
        ]
    }
];

// DEVOPS CATEGORIES (Pipelines, IaC) - UPDATED TO REMOVE STATUS
const DEVOPS_CATEGORIES: NodeCategory[] = [
    {
        id: 'cicd',
        label: 'CI/CD & Automation',
        icon: GitBranch,
        items: [
            { type: 'pipeline', label: 'GitHub Workflow', variant: 'slate', logo: iconUrl('githubactions', '2088FF'), data: { subType: 'Workflow', techName: 'GitHub Actions' }, keywords: ['ci', 'cd', 'build', 'yaml'] },
            { type: 'pipeline', label: 'Jenkins Pipeline', variant: 'slate', logo: iconUrl('jenkins', 'D24939'), data: { subType: 'Pipeline', techName: 'Jenkins' }, keywords: ['automation', 'server', 'groovy'] },
            { type: 'pipeline', label: 'GitLab CI', variant: 'slate', logo: iconUrl('gitlab', 'FC6D26'), data: { subType: 'CI Job', techName: 'GitLab' }, keywords: ['devops', 'runner', 'yml'] },
            { type: 'pipeline', label: 'Build Step', variant: 'slate', data: { subType: 'Step', techName: 'Compiler' }, keywords: ['compile', 'make', 'docker build'] },
            { type: 'pipeline', label: 'Test Suite', variant: 'slate', data: { subType: 'Test', techName: 'Jest/PyTest' }, keywords: ['unit', 'integration', 'e2e'] },
            { type: 'pipeline', label: 'Deploy Action', variant: 'slate', data: { subType: 'Deploy', techName: 'Release' }, keywords: ['release', 'prod', 'k8s'] },
        ]
    },
    {
        id: 'iac',
        label: 'Infrastructure as Code',
        icon: FileCode,
        items: [
            { type: 'pipeline', label: 'Terraform Resource', variant: 'violet', logo: iconUrl('terraform', '7B42BC'), data: { subType: 'Resource', techName: 'Terraform' }, keywords: ['hcl', 'provision', 'tf'] },
            { type: 'pipeline', label: 'Ansible Task', variant: 'slate', logo: iconUrl('ansible', 'EE0000'), data: { subType: 'Task', techName: 'Ansible' }, keywords: ['playbook', 'automation', 'yaml'] },
            { type: 'pipeline', label: 'Helm Chart', variant: 'blue', logo: iconUrl('helm', '0F1689'), data: { subType: 'Chart', techName: 'Helm' }, keywords: ['k8s', 'package'] },
            { type: 'pipeline', label: 'K8s Manifest', variant: 'blue', logo: iconUrl('kubernetes', '326CE5'), data: { subType: 'Manifest', techName: 'Kubernetes' }, keywords: ['yaml', 'deployment', 'service'] },
        ]
    },
    {
        id: 'observability',
        label: 'Observability Stack',
        icon: BarChart,
        items: [
            { type: 'service', label: 'Prometheus', variant: 'orange', logo: iconUrl('prometheus', 'E6522C'), keywords: ['metrics', 'tsdb'] },
            { type: 'service', label: 'Grafana', variant: 'orange', logo: iconUrl('grafana', 'F46800'), keywords: ['dashboard', 'viz'] },
            { type: 'service', label: 'Datadog Agent', variant: 'violet', logo: iconUrl('datadog', '632CA6'), keywords: ['apm', 'logs', 'agent'] },
            { type: 'external', label: 'PagerDuty', variant: 'emerald', logo: iconUrl('pagerduty', '005C29'), keywords: ['alert', 'incident', 'oncall'] },
        ]
    },
    {
        id: 'registries',
        label: 'Artifacts & Packages',
        icon: Box,
        items: [
            { type: 'database', label: 'Docker Registry', variant: 'blue', logo: iconUrl('docker', '2496ED'), data: { dbType: 'blob' }, keywords: ['image', 'store', 'hub'] },
            { type: 'database', label: 'Artifactory', variant: 'emerald', logo: iconUrl('jfrog', '40BE46'), data: { dbType: 'blob' }, keywords: ['maven', 'npm', 'repo'] },
        ]
    },
    {
        id: 'misc',
        label: 'Utilities & Misc',
        icon: Component,
        items: [
            { type: 'code', label: 'Code Block', variant: 'slate', logo: iconUrl('javascript', 'F7DF1E'), description: 'Embed code snippets', keywords: ['script', 'snippet', 'monaco', 'js', 'function'] },
            { type: 'note', label: 'Sticky Note', variant: 'yellow', description: 'Add documentation', keywords: ['text', 'comment', 'doc', 'postit'] },
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
    yellow: { border: 'border-yellow-400',  text: 'text-yellow-800',  bg: 'bg-yellow-400/20',  glow: 'shadow-yellow-400/20' },
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
             item.type === 'code' ? <Code2 size={20} strokeWidth={2} /> : 
             item.type === 'note' ? <StickyNote size={20} strokeWidth={2} /> :
             <Box size={20} strokeWidth={2} />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-200 leading-tight truncate">
            {item.label}
          </div>
          <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
             {item.description || (item.data?.subType || item.type.toUpperCase())}
          </div>
      </div>
    </div>
  );
};

export const NodeLibrary: React.FC<NodeLibraryProps> = ({ isOpen, onClose, activeLayer }) => {
  const [search, setSearch] = useState('');
  
  // Select dataset based on active layer
  const activeDataset = activeLayer === 'devops' ? DEVOPS_CATEGORIES : BACKEND_CATEGORIES;

  // Initialize expanded categories
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(() => {
     const initial: Record<string, boolean> = {};
     activeDataset.forEach(c => initial[c.id] = true);
     return initial;
  });

  const toggleCat = (id: string) => {
      setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter logic with Keyword guessing and Fuzzy Search
  const filteredLibrary = useMemo(() => {
    if (!search.trim()) return activeDataset;
    
    const lowerSearch = search.toLowerCase();
    
    return activeDataset.map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
            // 1. Direct label match
            if (item.label.toLowerCase().includes(lowerSearch)) return true;
            
            // 2. Type match
            if (item.type.toLowerCase().includes(lowerSearch)) return true;

            // 3. Keyword match (Semantic Search)
            if (item.keywords && item.keywords.some(k => k.includes(lowerSearch))) return true;

            // 4. Fuzzy Match (Typo Tolerance)
            if (lowerSearch.length > 3) {
                if (getLevenshteinDistance(item.label.toLowerCase(), lowerSearch) <= 2) return true;
                if (item.keywords && item.keywords.some(k => getLevenshteinDistance(k, lowerSearch) <= 2)) return true;
            }

            return false;
        })
    })).filter(cat => cat.items.length > 0);
  }, [search, activeDataset]);

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
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white border shadow-[0_0_15px_rgba(79,70,229,0.4)] ${activeLayer === 'devops' ? 'bg-indigo-600 border-indigo-400' : 'bg-blue-600 border-blue-400'}`}>
                 <LayoutGrid size={18} />
             </div>
             <div>
                <h2 className="text-lg font-bold font-heading text-white leading-none">
                    {activeLayer === 'devops' ? 'DevOps Toolbox' : 'Components'}
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
                  placeholder={activeLayer === 'devops' ? "Search pipelines, tools..." : "Type to search or guess..."}
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