import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderModuleProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export function PlaceholderModule({ title, description, icon: Icon, color }: PlaceholderModuleProps) {
  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-12 rounded-3xl max-w-md w-full relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`} />
        
        <div className={`w-20 h-20 mx-auto rounded-2xl bg-surface-hover border border-surface-border flex items-center justify-center mb-6`}>
          <Icon size={40} className={color.split(' ')[0].replace('from-', 'text-')} />
        </div>
        
        <h1 className="text-2xl font-heading font-bold text-white mb-3">{title}</h1>
        <p className="text-text-tertiary mb-8">{description}</p>
        
        <button className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors w-full">
          Coming Soon
        </button>
      </motion.div>
    </div>
  );
}
