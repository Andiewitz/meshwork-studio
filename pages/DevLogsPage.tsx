import React from 'react';
import { ArrowLeft, Rocket, Star, Wrench, Bug, Layers, Globe, ShieldCheck, Sparkles, Layout, Cloud, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const LogEntry = ({ version, date, type, children }: { version: string, date: string, type: 'major' | 'minor' | 'patch', children: React.ReactNode }) => (
  <div className="relative pl-8 pb-12 border-l border-slate-200 last:border-0 last:pb-0">
    <div className={`
        absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 
        ${type === 'major' ? 'bg-blue-100 border-blue-600' : 'bg-slate-100 border-slate-400'}
    `}></div>
    <div className="flex items-center gap-3 mb-3">
      <span className={`
        px-2.5 py-0.5 rounded text-xs font-bold font-mono
        ${type === 'major' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}
      `}>
        {version}
      </span>
      <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">{date}</span>
    </div>
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        {children}
    </div>
  </div>
);

const Section = ({ title, icon: Icon, colorClass, children }: { title: string, icon: any, colorClass: string, children: React.ReactNode }) => (
    <div className="mb-4 last:mb-0">
        <h4 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 ${colorClass}`}>
            <Icon size={14} />
            {title}
        </h4>
        <ul className="space-y-2 text-sm text-slate-600 pl-1">
            {children}
        </ul>
    </div>
);

export const DevLogsPage: React.FC = () => {
  return (
    <div className="min-h-full bg-slate-50/50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-medium">
                <ArrowLeft size={16} />
                Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Developer Logs</h1>
            <p className="text-slate-500">
                Tracking the evolution of Meshwork Studio. A detailed record of updates, improvements, and fixes.
            </p>
        </div>

        <div className="space-y-2">
            <LogEntry version="v1.2.2-alpha" date="October 27, 2023" type="patch">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <Sparkles size={18} className="text-teal-600" />
                        Template Fidelity & UX Polish
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        We've updated our templates to reflect real-world engineering standards based on technical whitepapers, and polished the loading experience.
                    </p>
                </div>
                
                <div className="border-t border-slate-100 pt-4 mt-4 grid gap-6">
                    <Section title="Real-World Architectures" icon={Layout} colorClass="text-teal-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Netflix:</strong> Now correctly depicts the Zuul Gateway / Eureka Discovery / Cassandra pattern with Open Connect CDN.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Airbnb:</strong> Updated to reflect Service Oriented Architecture (SOA) with sharded MySQL and Nginx load balancing.</span>
                        </li>
                         <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Uber:</strong> Added Ringpop consistent hashing logic and geospatial Redis implementations.</span>
                        </li>
                    </Section>

                    <Section title="General UX" icon={Wrench} colorClass="text-slate-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Loading States:</strong> Smoother transitions when entering the canvas.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Version Sync:</strong> Unified version labeling across Sidebar, Header, and Canvas.</span>
                        </li>
                    </Section>
                </div>
            </LogEntry>

            <LogEntry version="v1.2.0-alpha" date="October 26, 2023" type="minor">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <Sparkles size={18} className="text-purple-600" />
                        Templates & Stability
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        We've overhauled the project creation flow with a new Template System and significantly improved data persistence for guest users.
                    </p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 grid gap-6">
                    <Section title="Templates System" icon={Layout} colorClass="text-purple-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>New Onboarding:</strong> Choose between a Blank Canvas or pre-configured architectures.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Presets:</strong> Added Airbnb (Booking) and Netflix (Streaming) system design templates.</span>
                        </li>
                    </Section>

                    <Section title="New Components" icon={Cloud} colorClass="text-sky-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>External Service Node:</strong> Dedicated component for 3rd party APIs (Stripe, Auth0, AWS S3, SendGrid).</span>
                        </li>
                    </Section>

                    <Section title="Core Engineering" icon={Database} colorClass="text-emerald-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Hybrid Storage:</strong> Guest mode now uses LocalStorage with a seamless fallback mechanism, eliminating network timeouts.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Connection Logic:</strong> Fixed handle snapping issues; connections now respect specific sides (top/bottom/left/right).</span>
                        </li>
                    </Section>
                </div>
            </LogEntry>

            <LogEntry version="v1.1.0-alpha" date="October 25, 2023" type="minor">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                       <Layers size={18} className="text-indigo-600" />
                       The Middleware Update
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        This update introduces specific middleware components designed to sit between your major services. These smaller, specialized nodes help visualize the "glue" of distributed systems.
                    </p>
                </div>
                
                <div className="border-t border-slate-100 pt-4 mt-4 grid gap-6">
                    <Section title="New Components" icon={Star} colorClass="text-indigo-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>API Gateway:</strong> Central routing and management node.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Auth & Verification:</strong> Token validation and security guards.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Cache Layers:</strong> Redis/CDN representations for performance layers.</span>
                        </li>
                         <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Resilience Patterns:</strong> Rate Limiters and Circuit Breakers.</span>
                        </li>
                    </Section>

                     <Section title="UI Improvements" icon={Globe} colorClass="text-blue-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                            <span>New "Middleware" category in the component library.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                            <span>Compact node design for middleware to distinguish them from primary infrastructure.</span>
                        </li>
                    </Section>
                </div>
            </LogEntry>

            <LogEntry version="v1.0.0-alpha" date="October 24, 2023" type="major">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                       <Rocket size={18} className="text-blue-600" />
                       Initial Public Alpha
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        We are excited to release the first alpha version of Meshwork Studio! This release focuses on the core drag-and-drop experience for distributed system architecture diagrams.
                    </p>
                </div>
                
                <div className="border-t border-slate-100 pt-4 mt-4 grid gap-6">
                    <Section title="New Features" icon={Star} colorClass="text-emerald-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Visual Flow Editor:</strong> Comprehensive canvas with drag-and-drop support, zooming, and panning.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Component Library:</strong> Added specialized nodes for Servers, Services, Databases (with 30+ presets), Queues, and Load Balancers.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Connection Protocols:</strong> Define edge types (HTTP, gRPC, WebSocket, AMQP, JDBC) with visual indicators.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            <span><strong>Authentication:</strong> Seamless Google Sign-In and a dedicated Guest Mode for developers.</span>
                        </li>
                    </Section>

                    <Section title="Improvements" icon={Wrench} colorClass="text-amber-600">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                            <span>Enhanced node visuals with "System UI" styling (SF Pro/Inter typography).</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                            <span>Integrated real-time edge label rendering for technical diagrams.</span>
                        </li>
                    </Section>
                </div>
            </LogEntry>
        </div>
      </div>
    </div>
  );
};