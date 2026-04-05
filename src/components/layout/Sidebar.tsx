import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Video, 
  Wallet, 
  Store, 
  Users, 
  Trophy, 
  Dumbbell, 
  Target,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'game-grind', label: 'Game Grind', icon: Gamepad2 },
  { id: 'video-ideas', label: 'Video Ideas', icon: Video },
  { id: 'savings', label: 'Savings', icon: Wallet },
  { id: 'store', label: 'Store', icon: Store },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'achievements', label: 'Achievements 2026', icon: Trophy },
  { id: 'diet-gym', label: 'Diet & Gym', icon: Dumbbell },
  { id: 'goals', label: 'Goals', icon: Target },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-surface border border-surface-border text-text-primary"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-surface/50 backdrop-blur-xl border-r border-surface-border z-40 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center shadow-lg glow-effect">
            <span className="font-heading font-bold text-white text-lg">R</span>
          </div>
          <div>
            <h1 className="font-heading font-semibold text-text-primary tracking-wide">Ron's OS</h1>
            <p className="text-xs text-text-tertiary">Build. Track. Grow.</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "text-white bg-surface-hover" 
                    : "text-text-secondary hover:text-white hover:bg-surface-hover/50"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute left-0 w-1 h-6 bg-gradient-to-b from-accent-blue to-accent-violet rounded-r-full"
                  />
                )}
                <Icon size={18} className={cn("transition-colors", isActive ? "text-accent-blue" : "text-text-tertiary group-hover:text-text-secondary")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-surface-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-hover border border-surface-border overflow-hidden">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Ron&backgroundColor=transparent" alt="Ron" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">Ron Jamelle Amancio</p>
              <p className="text-xs text-text-tertiary truncate">Personal HQ</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
