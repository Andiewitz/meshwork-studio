import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Area */}
      <div 
        className={`
          flex-shrink-0 z-20 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header />
        <main className="flex-1 overflow-auto relative scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};