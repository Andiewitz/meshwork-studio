import type { Node, Edge, MarkerType } from 'reactflow';
import { FlowNodeData } from '../types';

export interface Template {
  id: string;
  name: string;
  description: string;
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
  thumbnailColor: string;
  logo?: string;
}

export const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch with an empty workspace.',
    thumbnailColor: 'bg-slate-100',
    nodes: [],
    edges: []
  },
  {
    id: 'airbnb',
    name: 'Booking System (Airbnb)',
    description: 'SOA with Service Mesh, sharded MySQL, and heavy search indexing.',
    thumbnailColor: 'bg-rose-50',
    logo: 'https://cdn.simpleicons.org/airbnb/FF5A5F',
    nodes: [
      // Frontend
      { id: 'client', type: 'client', position: { x: 0, y: 350 }, data: { label: 'Web / Mobile', clientType: 'phone' } },
      
      // Edge Layer
      { id: 'cdn', type: 'middleware', position: { x: 200, y: 350 }, data: { label: 'CDN / Edge', middlewareType: 'cache', techName: 'Cloudflare', techLogo: 'https://cdn.simpleicons.org/cloudflare/F38020' } },
      { id: 'lb', type: 'loadBalancer', position: { x: 400, y: 350 }, data: { label: 'Nginx LB' } },
      { id: 'gateway', type: 'middleware', position: { x: 600, y: 350 }, data: { label: 'API Gateway', middlewareType: 'gateway' } },

      // Service Mesh
      { id: 'mesh', type: 'middleware', position: { x: 850, y: 150 }, data: { label: 'Envoy Mesh', middlewareType: 'mesh', techLogo: 'https://cdn.simpleicons.org/envoy/111111' } },

      // Services
      // 1. Search (Read Heavy)
      { id: 'svc-search', type: 'service', position: { x: 900, y: 50 }, data: { label: 'Search Svc' } },
      { id: 'db-elastic', type: 'database', position: { x: 1150, y: 0 }, data: { label: 'Search Index', dbType: 'elasticsearch', dbName: 'Elasticsearch', dbCategory: 'search', dbLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg' } },
      { id: 'cache-redis', type: 'middleware', position: { x: 1150, y: 120 }, data: { label: 'Result Cache', middlewareType: 'cache', techName: 'Redis', techLogo: 'https://cdn.simpleicons.org/redis/DC382D' } },

      // 2. Core Booking (Transactional)
      { id: 'svc-homes', type: 'service', position: { x: 900, y: 350 }, data: { label: 'Homes Core' } },
      { id: 'db-mysql', type: 'database', position: { x: 1150, y: 300 }, data: { label: 'Sharded DB', dbType: 'mysql', dbName: 'MySQL (RDS)', dbCategory: 'sql', dbLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' } },
      
      // 3. Payments (Consistency)
      { id: 'svc-payment', type: 'service', position: { x: 900, y: 550 }, data: { label: 'Payments' } },
      { id: 'db-ledgers', type: 'database', position: { x: 1150, y: 550 }, data: { label: 'Ledger DB', dbType: 'postgresql', dbName: 'PostgreSQL', dbCategory: 'sql', dbLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' } },
      { id: 'ext-stripe', type: 'external', position: { x: 1350, y: 550 }, data: { label: 'Stripe API' } },

      // Async Pipeline
      { id: 'kafka', type: 'queue', position: { x: 900, y: 750 }, data: { label: 'Events / CDC' } },
      { id: 'svc-risk', type: 'service', position: { x: 1150, y: 750 }, data: { label: 'Risk Engine' } },
    ],
    edges: [
      { id: 'e1', source: 'client', target: 'cdn', animated: true },
      { id: 'e2', source: 'cdn', target: 'lb', animated: true },
      { id: 'e3', source: 'lb', target: 'gateway', animated: true },
      
      // Gateway fanout
      { id: 'e-gw-search', source: 'gateway', target: 'svc-search', label: 'gRPC' },
      { id: 'e-gw-homes', source: 'gateway', target: 'svc-homes', label: 'REST' },
      { id: 'e-gw-pay', source: 'gateway', target: 'svc-payment', label: 'mTLS' },

      // Search Logic
      { id: 'e-search-es', source: 'svc-search', target: 'db-elastic' },
      { id: 'e-search-cache', source: 'svc-search', target: 'cache-redis' },

      // Homes Logic
      { id: 'e-homes-db', source: 'svc-homes', target: 'db-mysql' },
      { id: 'e-homes-kafka', source: 'svc-homes', target: 'kafka', animated: true },

      // Payment Logic
      { id: 'e-pay-db', source: 'svc-payment', target: 'db-ledgers' },
      { id: 'e-pay-ext', source: 'svc-payment', target: 'ext-stripe', style: { strokeDasharray: '5,5' } },

      // Async
      { id: 'e-kafka-risk', source: 'kafka', target: 'svc-risk', animated: true },
    ]
  },
  {
    id: 'netflix',
    name: 'Video Streaming (Netflix)',
    description: 'Microservices architecture with Open Connect CDN, Zuul Gateway, and Cassandra.',
    thumbnailColor: 'bg-red-50',
    logo: 'https://cdn.simpleicons.org/netflix/E50914',
    nodes: [
        // Client Side
        { id: 'client', type: 'client', position: { x: 0, y: 250 }, data: { label: 'Smart TV / Web', clientType: 'desktop' } },
        
        // The famous Open Connect CDN
        { id: 'cdn', type: 'middleware', position: { x: 250, y: 100 }, data: { label: 'Open Connect', middlewareType: 'cache', techName: 'Open Connect' } },
        
        // Control Plane (AWS)
        { id: 'lb', type: 'loadBalancer', position: { x: 250, y: 400 }, data: { label: 'ELB' } },
        { id: 'gateway', type: 'middleware', position: { x: 450, y: 400 }, data: { label: 'Zuul Gateway', middlewareType: 'gateway' } },
        { id: 'discovery', type: 'middleware', position: { x: 450, y: 550 }, data: { label: 'Eureka Discovery', middlewareType: 'mesh' } },

        // Backend Services
        { id: 'svc-api', type: 'service', position: { x: 700, y: 250 }, data: { label: 'API Aggregation' } },
        { id: 'svc-sub', type: 'service', position: { x: 700, y: 400 }, data: { label: 'Subscriber Svc' } },
        { id: 'svc-rec', type: 'service', position: { x: 700, y: 550 }, data: { label: 'Recommendations' } },

        // Data Layer (Cassandra & EVCache)
        { id: 'cache-ev', type: 'middleware', position: { x: 950, y: 250 }, data: { label: 'EVCache', middlewareType: 'cache', techName: 'Memcached', techLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/memcached/memcached-original.svg' } },
        { id: 'db-cass', type: 'database', position: { x: 950, y: 400 }, data: { label: 'Cassandra', dbType: 'cassandra', dbName: 'Cassandra', dbCategory: 'nosql', dbLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachecassandra/apachecassandra-original.svg' } },
        
        // Big Data / Spark
        { id: 'kafka', type: 'queue', position: { x: 950, y: 550 }, data: { label: 'Keystone / Kafka' } },
        { id: 'spark', type: 'service', position: { x: 1150, y: 550 }, data: { label: 'Spark Compute' } },
    ],
    edges: [
        // Playback traffic (Heavy)
        { id: 'e-heavy', source: 'client', target: 'cdn', label: 'Video Stream', style: { strokeWidth: 3, stroke: '#ef4444' }, animated: true },
        
        // API Traffic (Control)
        { id: 'e-control', source: 'client', target: 'lb', label: 'API Requests' },
        { id: 'e-lb-gw', source: 'lb', target: 'gateway' },
        { id: 'e-gw-disc', source: 'gateway', target: 'discovery', style: { strokeDasharray: '5,5' } },

        // Fanout
        { id: 'e-gw-api', source: 'gateway', target: 'svc-api' },
        { id: 'e-gw-sub', source: 'gateway', target: 'svc-sub' },
        { id: 'e-gw-rec', source: 'gateway', target: 'svc-rec' },

        // Data Access
        { id: 'e-sub-cass', source: 'svc-sub', target: 'db-cass', label: 'Multi-Region' },
        { id: 'e-api-ev', source: 'svc-api', target: 'cache-ev' },
        
        // Async / ML
        { id: 'e-rec-kafka', source: 'svc-rec', target: 'kafka' },
        { id: 'e-kafka-spark', source: 'kafka', target: 'spark', animated: true },
    ]
  },
  {
    id: 'uber',
    name: 'Ride Sharing (Uber)',
    description: 'Real-time geospatial matching with consistent hashing and heavy write loads.',
    thumbnailColor: 'bg-slate-900',
    logo: 'https://cdn.simpleicons.org/uber/FFFFFF',
    nodes: [
        // Client Side
        { id: 'rider', type: 'client', position: { x: 0, y: 200 }, data: { label: 'Rider App', clientType: 'phone' } },
        { id: 'driver', type: 'client', position: { x: 0, y: 500 }, data: { label: 'Driver App', clientType: 'phone' } },
        
        { id: 'lb', type: 'loadBalancer', position: { x: 250, y: 350 }, data: { label: 'L7 Load Balancer' } },
        
        { id: 'svc-dispatch', type: 'service', position: { x: 500, y: 200 }, data: { label: 'DISCO (Dispatch)' } },
        { id: 'svc-geo', type: 'service', position: { x: 500, y: 500 }, data: { label: 'Geospatial Svc' } },

        // Ringpop / Consistent Hashing
        { id: 'ringpop', type: 'middleware', position: { x: 750, y: 350 }, data: { label: 'Ringpop / Gossip', middlewareType: 'mesh' } },

        // Storage
        { id: 'db-kv', type: 'database', position: { x: 1000, y: 200 }, data: { label: 'Schemaless (MySQL)', dbType: 'mysql', dbName: 'Schemaless', dbCategory: 'sql' } },
        { id: 'db-redis', type: 'database', position: { x: 1000, y: 500 }, data: { label: 'Redis Geospatial', dbType: 'redis', dbName: 'Redis Cluster', dbCategory: 'cache', dbLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' } },
    ],
    edges: [
        { id: 'e1', source: 'rider', target: 'lb', animated: true },
        { id: 'e2', source: 'driver', target: 'lb', animated: true },
        
        { id: 'e3', source: 'lb', target: 'svc-dispatch' },
        { id: 'e4', source: 'lb', target: 'svc-geo' },

        { id: 'e-geo-redis', source: 'svc-geo', target: 'db-redis', label: 'GEOADD/GEORADIUS' },
        { id: 'e-disp-kv', source: 'svc-dispatch', target: 'db-kv' },
        
        // Inter-service via Ringpop
        { id: 'e-ring-1', source: 'svc-dispatch', target: 'ringpop', style: { stroke: '#f59e0b', strokeDasharray: '5,5' } },
        { id: 'e-ring-2', source: 'svc-geo', target: 'ringpop', style: { stroke: '#f59e0b', strokeDasharray: '5,5' } },
    ]
  }
];