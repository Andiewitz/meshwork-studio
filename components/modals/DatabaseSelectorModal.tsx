import React, { useState, useMemo } from 'react';
import { Search, Database, Server, Box, GitGraph, Clock, HardDrive, Cpu, X, Plus } from 'lucide-react';

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
  // SQL
  { id: 'postgresql', name: 'PostgreSQL', category: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { id: 'mysql', name: 'MySQL', category: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
  { id: 'sqlite', name: 'SQLite', category: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' },
  { id: 'mssql', name: 'SQL Server', category: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg' },
  { id: 'oracle', name: 'Oracle DB', category: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg' },
  { id: 'mariadb', name: 'MariaDB', category: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mariadb/mariadb-original.svg' },
  { id: 'cockroachdb', name: 'CockroachDB', category: 'sql' },
  { id: 'spanner', name: 'Google Spanner', category: 'sql' },

  // NoSQL
  { id: 'mongodb', name: 'MongoDB', category: 'nosql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  { id: 'firestore', name: 'Firebase Firestore', category: 'nosql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg' },
  { id: 'dynamodb', name: 'DynamoDB', category: 'nosql' }, // AWS icon difficult to pin without specific setup
  { id: 'couchbase', name: 'Couchbase', category: 'nosql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/couchbase/couchbase-original.svg' },
  { id: 'cassandra', name: 'Cassandra', category: 'nosql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachecassandra/apachecassandra-original.svg' },

  // Cache
  { id: 'redis', name: 'Redis', category: 'cache', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
  { id: 'memcached', name: 'Memcached', category: 'cache' },
  { id: 'etcd', name: 'etcd', category: 'cache' },

  // Vector
  { id: 'pinecone', name: 'Pinecone', category: 'vector' },
  { id: 'weaviate', name: 'Weaviate', category: 'vector' },
  { id: 'milvus', name: 'Milvus', category: 'vector' },
  { id: 'qdrant', name: 'Qdrant', category: 'vector' },
  { id: 'chroma', name: 'ChromaDB', category: 'vector' },

  // Time Series
  { id: 'influxdb', name: 'InfluxDB', category: 'timeseries' },
  { id: 'prometheus', name: 'Prometheus', category: 'timeseries', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prometheus/prometheus-original.svg' },
  { id: 'timescale', name: 'TimescaleDB', category: 'timeseries' },

  // Search
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'search', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg' },
  { id: 'algolia', name: 'Algolia', category: 'search', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/algolia/algolia-original.svg' },
  { id: 'solr', name: 'Solr', category: 'search' },
  { id: 'meilisearch', name: 'Meilisearch', category: 'search' },

  // Warehouse
  { id: 'snowflake', name: 'Snowflake', category: 'warehouse' },
  { id: 'bigquery', name: 'BigQuery', category: 'warehouse' },
  { id: 'redshift', name: 'Redshift', category: 'warehouse' },
  { id: 'databricks', name: 'Databricks', category: 'warehouse' },
  
  // BaaS / Other
  { id: 'supabase', name: 'Supabase', category: 'other', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
  { id: 'firebase_rtdb', name: 'Realtime DB', category: 'other', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg' },
  { id: 'realm', name: 'Realm', category: 'other' },
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
      onSelect({
        id: `custom-${Date.now()}`,
        name: customDbName,
        category: 'custom'
      });
      onClose();
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category ? category.icon : Database;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Select Database</h2>
            <p className="text-zinc-400 text-sm mt-1">Choose a database technology for this node.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Categories */}
          <div className="w-64 bg-zinc-900/50 border-r border-zinc-800 overflow-y-auto hidden md:block">
            <div className="p-4 space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-600/10 text-blue-400' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id 
                      ? 'bg-blue-600/10 text-blue-400' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-zinc-950/50">
            {/* Search Bar */}
            <div className="p-4 border-b border-zinc-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  placeholder="Search databases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-600"
                  autoFocus
                />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredDbs.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredDbs.map(db => {
                    const CategoryIcon = getCategoryIcon(db.category);
                    return (
                      <button
                        key={db.id}
                        onClick={() => {
                          onSelect(db);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-xl transition-all group text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 p-2 border border-zinc-700/50 overflow-hidden">
                          {db.logo ? (
                            <img src={db.logo} alt={db.name} className="w-full h-full object-contain" />
                          ) : (
                            <CategoryIcon size={20} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-zinc-200 group-hover:text-white truncate">
                            {db.name}
                          </div>
                          <div className="text-xs text-zinc-500 capitalize">
                            {CATEGORIES.find(c => c.id === db.category)?.label || 'Database'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-12">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">No databases found</p>
                  <p className="text-sm">Try searching for something else or add a custom one below.</p>
                </div>
              )}
            </div>

            {/* Footer / Custom DB */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900">
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
                    Can't find it? Add Custom DB
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. My Legacy DB"
                      value={customDbName}
                      onChange={(e) => setCustomDbName(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      type="submit"
                      disabled={!customDbName.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};