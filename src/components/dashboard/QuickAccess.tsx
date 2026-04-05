import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Video, Wallet, Store, Users, Trophy, Dumbbell, Target } from 'lucide-react';

const modules = [
  { id: 'game-grind', label: 'Game Grind', icon: Gamepad2, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  { id: 'video-ideas', label: 'Video Ideas', icon: Video, color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
  { id: 'savings', label: 'Savings', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'store', label: 'Store', icon: Store, color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
  { id: 'customers', label: 'Customers', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, color: 'text-accent-teal', bg: 'bg-accent-teal/10' },
  { id: 'diet-gym', label: 'Diet & Gym', icon: Dumbbell, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'goals', label: 'Goals', icon: Target, color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

interface QuickAccessProps {
  setActiveTab: (tab: string) => void;
}

export function QuickAccess({ setActiveTab }: QuickAccessProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-heading font-semibold text-white mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <motion.button
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-surface-hover transition-colors border border-surface-border/50 hover:border-surface-border group"
            >
              <div className={`p-3 rounded-xl ${mod.bg} transition-transform group-hover:scale-110`}>
                <Icon size={24} className={mod.color} />
              </div>
              <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">
                {mod.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
