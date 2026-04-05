import React from 'react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export function Hero() {
  const today = new Date();
  const timeGreeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 glass-panel border-surface-border/50">
      {/* Background Gradient & Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface to-background z-0" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-blue/10 via-transparent to-transparent z-0" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-violet/10 via-transparent to-transparent z-0" />
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary font-medium tracking-wider text-sm uppercase"
          >
            {format(today, 'EEEE, MMMM do, yyyy')}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-heading font-bold text-white"
          >
            {timeGreeting}, <span className="text-gradient-accent">Ron Jamelle Amancio</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-text-tertiary text-lg max-w-xl"
          >
            Let's build your future today. Here is your life, your progress, and your momentum.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden lg:flex flex-col items-end text-right"
        >
          <div className="text-4xl font-heading font-light text-white tracking-tighter">
            {format(today, 'h:mm a')}
          </div>
          <div className="text-sm text-text-tertiary uppercase tracking-widest mt-1">
            Local Time
          </div>
        </motion.div>
      </div>
    </div>
  );
}
