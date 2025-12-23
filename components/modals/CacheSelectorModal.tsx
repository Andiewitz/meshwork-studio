import React, { useState, useMemo } from 'react';
import { Search, Globe, Zap, Server, Cloud, Shield, X, Check } from 'lucide-react';

export interface CacheOption {
  id: string;
  name: string;
  category: string;
  logo?: string;
}

interface CacheSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tech: CacheOption) => void;
}

const TECHNOLOGIES: CacheOption[] = [
  // CDNs / Edge
  { id: 'cloudflare', name: 'Cloudflare', category: 'cdn', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg' },
  { id: 'cloudfront', name: 'AWS CloudFront', category: 'cdn' },
  { id: 'fastly', name: 'Fastly', category: 'cdn', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastly/fastly-original.svg' },
  { id: 'akamai', name: 'Akamai', category: 'cdn' },
  { id: 'vercel_edge', name: 'Vercel Edge', category: 'cdn', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg' },
  { id: 'bunny', name: 'Bunny.net', category: 'cdn' },

  // In-Memory / Caches
  { id: 'redis', name: 'Redis', category: 'cache', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
  { id: 'memcached', name: 'Memcached', category: 'cache' },
  { id: 'varnish', name: 'Varnish', category: 'cache' },
  { id: 'hazelcast', name: 'Hazelcast', category: 'cache' },
  
  // Other
  { id: 'apache_traffic_server', name: 'Traffic Server', category: 'other' },
  { id: 'nginx_cache', name: 'Nginx Cache', category: 'other', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg' },
];

export const CacheSelectorModal: React.FC<CacheSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  
  const filteredTechs = useMemo(() => {
    return TECHNOLOGIES.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0_0_#0f172a] flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">Select Technology</h2>
            <p className="text-slate-500 text-sm mt-1">Choose a CDN, Edge network, or Caching layer.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} /></button>
        </div>

        <div className="p-4 border-b-2 border-slate-100 bg-slate-50">
           <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search Cloudflare, Redis, etc..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-slate-900 focus:shadow-[2px_2px_0_0_#0f172a] placeholder:text-slate-400 font-bold transition-all"
                  autoFocus
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredTechs.map(tech => (
                    <button
                        key={tech.id}
                        onClick={() => { onSelect(tech); onClose(); }}
                        className="flex items-center gap-3 p-3 bg-white border-2 border-slate-100 hover:border-slate-900 hover:shadow-[4px_4px_0_0_#cbd5e1] hover:-translate-y-0.5 rounded-xl transition-all group text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 p-2 border border-slate-200 overflow-hidden">
                            {tech.logo ? (
                                <img src={tech.logo} alt={tech.name} className="w-full h-full object-contain" />
                            ) : (
                                <Zap size={20} className="text-slate-400 group-hover:text-slate-900" />
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-700 group-hover:text-slate-900 truncate">{tech.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{tech.category}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};