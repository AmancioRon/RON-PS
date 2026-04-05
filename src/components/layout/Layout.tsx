import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: (activeTab: string, setActiveTab: (tab: string) => void) => React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-background text-text-primary selection:bg-accent-violet/30 selection:text-white">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-violet/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative z-10 w-full max-w-full lg:max-w-[calc(100vw-16rem)] min-h-screen overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto"
          >
            {children(activeTab, setActiveTab)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
