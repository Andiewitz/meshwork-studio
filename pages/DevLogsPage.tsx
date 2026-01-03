
import React from 'react';
import { ArrowLeft, Rocket, Star, Wrench, Layers, Palette, PaintBucket, Globe, Box, ShieldCheck, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogEntryProps {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  children?: React.ReactNode;
}

const LogEntry: React.FC<LogEntryProps> = ({ version, date, type, children }) => (
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

interface SectionProps {
  title: string;
  icon: any;
  colorClass: string;
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, colorClass, children }) => (
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
            <p className="text-slate-500">Track the evolution of the Meshwork Studio platform.</p>
        </div>

        <div className="border-l-2 border-slate-200 ml-3 space-y-0">

            {/* v1.4.0 */}
            <LogEntry version="v1.4.0-alpha" date="March 18, 2024" type="major">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="text-indigo-500" size={20} />
                        Security & Interaction Overhaul
                    </h3>
                    <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                        This update focuses on making the canvas interaction professional-grade while hardening the application against browser security restrictions. We've introduced a strict tool-based workflow and a bulletproof storage bridge.
                    </p>
                </div>

                <div className="space-y-4">
                     <Section title="Strict Tool System" icon={MousePointer2} colorClass="text-indigo-600">
                        <li><strong>Select Mode (V):</strong> Canvas and nodes are locked for movement. Focused strictly on marquee selection and node editing.</li>
                        <li><strong>Hand Mode (H):</strong> The "Movement" layer. Left-click dragging pans the canvas or moves selected nodes.</li>
                        <li><strong>Spring-Loaded Pan:</strong> Holding the <code>Spacebar</code> now temporarily activates the Hand tool from any mode.</li>
                        <li><strong>Connection Mode (C):</strong> Dedicated wiring mode with crosshair cursor for precise handle targeting.</li>
                     </Section>
                     <Section title="Security Hardening" icon={ShieldCheck} colorClass="text-emerald-600">
                         <li><strong>Storage Bridge:</strong> Fixed "SecurityError: The operation is insecure" by implementing property-access-level checks for <code>localStorage</code>.</li>
                         <li><strong>Memory Fallback:</strong> The app now seamlessly transitions to in-memory storage if the browser blocks third-party storage or operates in highly restricted private modes.</li>
                     </Section>
                     <Section title="UI Refinements" icon={Palette} colorClass="text-blue-600">
                         <li><strong>Material UI Integration:</strong> Replaced custom tooltips and buttons with MUI components for better accessibility and native behavior.</li>
                         <li><strong>Header Redesign:</strong> Unified the editor header with a high-contrast brutalist style and improved status indicators.</li>
                     </Section>
                </div>
            </LogEntry>

            {/* v1.3.0 */}
            <LogEntry version="v1.3.0-alpha" date="March 10, 2024" type="major">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <PaintBucket className="text-indigo-500" size={20} />
                        The Style Update
                    </h3>
                    <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                        A major visual overhaul focusing on the "Neo-Brutalist" aesthetic. We've unified the design language across modals, the library, and the canvas interactions to ensure high contrast and better readability.
                    </p>
                </div>

                <div className="space-y-4">
                     <Section title="Visual & UX" icon={Palette} colorClass="text-indigo-600">
                        <li>Replaced the template carousel with a focused <strong>New Project Modal</strong> featuring blurred backdrops.</li>
                        <li>Updated <strong>Node Library</strong> to use pastel backgrounds with high-contrast borders.</li>
                        <li>Standardized all configuration modals to use the consistent brutalist shadow and border style.</li>
                    </Section>
                </div>
            </LogEntry>

            {/* v1.2.24 */}
            <LogEntry version="v1.2.24-alpha" date="Feb 28, 2024" type="major">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Rocket className="text-blue-500" size={20} />
                        Initial Public Alpha
                    </h3>
                    <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                        Welcome to the first usable build of Meshwork Studio. This release focuses on core canvas functionality, node configuration, and local state management for guest users.
                    </p>
                </div>

                <div className="space-y-4">
                     <Section title="New Features" icon={Star} colorClass="text-amber-500">
                        <li><strong>Infinite Canvas:</strong> Pan, zoom, and drag nodes with the React Flow engine.</li>
                        <li><strong>Guest Mode:</strong> Full functionality without login.</li>
                        <li><strong>Templates:</strong> Start with Blank, Airbnb, Netflix, or Uber architecture presets.</li>
                    </Section>
                </div>
            </LogEntry>
        </div>
      </div>
    </div>
  );
};
