import React, { useState, useMemo } from 'react';
import { Search, Database, Server, Box, GitGraph, Clock, HardDrive, Cpu, X, Plus } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, IconButton, InputBase, Typography, Divider, Button } from '@mui/material';

export interface DatabaseOption {
  id: string;
  name: string;
  category: string;
  logo?: string;
}

interface DatabaseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (db: DatabaseOption) => void;
}

const CATEGORIES = [
  { id: 'sql', label: 'Relational (SQL)', icon: Database },
  { id: 'nosql', label: 'Document / NoSQL', icon: Box },
  { id: 'cache', label: 'Key-Value / Cache', icon: Cpu },
  { id: 'vector', label: 'Vector / AI', icon: GitGraph },
  { id: 'timeseries', label: 'Time Series', icon: Clock },
  { id: 'search', label: 'Search Engine', icon: Search },
  { id: 'warehouse', label: 'Data Warehouse', icon: Server },
  { id: 'other', label: 'Other', icon: HardDrive },
];

const DATABASES: DatabaseOption[] = [
  { id: 'postgresql', name: 'PostgreSQL', category: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { id: 'mysql', name: 'MySQL', category: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
  { id: 'sqlite', name: 'SQLite', category: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' },
  { id: 'mongodb', name: 'MongoDB', category: 'nosql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  { id: 'firestore', name: 'Firebase Firestore', category: 'nosql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg' },
  { id: 'redis', name: 'Redis', category: 'cache', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'search', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg' },
  { id: 'supabase', name: 'Supabase', category: 'other', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
];

export const DatabaseSelectorModal: React.FC<DatabaseSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customDbName, setCustomDbName] = useState('');

  const filteredDbs = useMemo(() => {
    return DATABASES.filter(db => {
      const matchesSearch = db.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || db.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDbName.trim()) {
      onSelect({ id: `custom-${Date.now()}`, name: customDbName, category: 'custom' });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, border: '2px solid #0f172a', boxShadow: '8px 8px 0px 0px #0f172a' } }}>
      <DialogTitle sx={{ m: 0, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h6" fontWeight="bold" fontFamily="Plus Jakarta Sans">Select Database</Typography>
          <Typography variant="body2" color="textSecondary">Choose a database technology for this node.</Typography>
        </div>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0, display: 'flex', minHeight: 400 }}>
        {/* Sidebar */}
        <div className="w-56 bg-slate-50 border-r border-slate-200 p-4 space-y-1 hidden md:block">
          <Button 
            fullWidth 
            onClick={() => setSelectedCategory('all')} 
            variant={selectedCategory === 'all' ? 'contained' : 'text'}
            sx={{ justifyContent: 'flex-start', textAlign: 'left', fontWeight: 'bold', textTransform: 'none', mb: 0.5, backgroundColor: selectedCategory === 'all' ? '#0f172a' : 'transparent', '&:hover': { backgroundColor: selectedCategory === 'all' ? '#1e293b' : 'rgba(0,0,0,0.04)' } }}
          >
            All Categories
          </Button>
          {CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              fullWidth
              onClick={() => setSelectedCategory(cat.id)}
              variant={selectedCategory === cat.id ? 'contained' : 'text'}
              startIcon={<cat.icon size={16} />}
              sx={{ justifyContent: 'flex-start', textAlign: 'left', fontWeight: 'bold', textTransform: 'none', mb: 0.5, color: selectedCategory === cat.id ? '#fff' : '#64748b', backgroundColor: selectedCategory === cat.id ? '#0f172a' : 'transparent', '&:hover': { backgroundColor: selectedCategory === cat.id ? '#1e293b' : 'rgba(0,0,0,0.04)' } }}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-100">
             <div className="relative flex items-center bg-slate-100 rounded-xl px-3 py-2 border-2 border-transparent focus-within:border-slate-900 focus-within:bg-white transition-all">
               <Search size={18} className="text-slate-400 mr-2" />
               <InputBase
                 placeholder="Search databases..."
                 fullWidth
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
               />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
               {filteredDbs.map(db => (
                 <button
                   key={db.id}
                   onClick={() => { onSelect(db); onClose(); }}
                   className="flex items-center gap-3 p-3 bg-white border-2 border-slate-100 hover:border-slate-900 hover:shadow-[4px_4px_0_0_#cbd5e1] rounded-xl transition-all group text-left"
                 >
                   <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 p-2 border border-slate-200 overflow-hidden">
                     {db.logo ? (
                       <img src={db.logo} alt={db.name} className="w-full h-full object-contain" />
                     ) : (
                       <Database size={20} className="text-slate-400 group-hover:text-slate-900" />
                     )}
                   </div>
                   <div className="min-w-0">
                     <div className="text-sm font-bold text-slate-700 group-hover:text-slate-900 truncate">{db.name}</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase">{CATEGORIES.find(c => c.id === db.category)?.label || 'DB'}</div>
                   </div>
                 </button>
               ))}
             </div>
          </div>
          <Divider />
          <div className="p-4 bg-slate-50">
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
               <InputBase
                 placeholder="Add custom database..."
                 value={customDbName}
                 onChange={(e) => setCustomDbName(e.target.value)}
                 sx={{ flex: 1, backgroundColor: '#fff', border: '2px solid #e2e8f0', px: 2, py: 0.5, borderRadius: 2, fontSize: '0.875rem', fontWeight: 'medium' }}
               />
               <Button type="submit" variant="contained" disabled={!customDbName.trim()} sx={{ backgroundColor: '#0f172a', fontWeight: 'bold', textTransform: 'none', borderRadius: 2 }}>
                 Add
               </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};