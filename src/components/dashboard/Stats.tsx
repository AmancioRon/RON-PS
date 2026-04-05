import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Store, Video, Target } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGlobalState } from '../../context/GlobalState';

interface StatsProps {
  setActiveTab: (tab: string) => void;
}

export function Stats({ setActiveTab }: StatsProps) {
  const { transactions, storeItems, videoIdeas, goals } = useGlobalState();

  const netWorth = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const activeStoreItems = storeItems.filter(item => item.status === 'available').length;
  const completedGoals = goals.filter(g => g.progress === 100).length;

  const stats = [
    {
      id: 'net-worth',
      tab: 'savings',
      label: 'Net Worth',
      value: `₱${netWorth.toLocaleString()}`,
      trend: 'Active',
      isPositive: netWorth >= 0,
      icon: Wallet,
      color: 'from-accent-blue to-blue-600',
    },
    {
      id: 'store-items',
      tab: 'store',
      label: 'Active Store Items',
      value: activeStoreItems.toString(),
      trend: 'Inventory',
      isPositive: true,
      icon: Store,
      color: 'from-accent-violet to-purple-600',
    },
    {
      id: 'video-ideas',
      tab: 'video-ideas',
      label: 'Saved Video Ideas',
      value: videoIdeas.length.toString(),
      trend: 'Content',
      isPositive: true,
      icon: Video,
      color: 'from-accent-teal to-emerald-600',
    },
    {
      id: 'goals',
      tab: 'goals',
      label: 'Completed Goals',
      value: `${completedGoals}/${goals.length}`,
      trend: 'Progress',
      isPositive: true,
      icon: Target,
      color: 'from-accent-gold to-orange-500',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            onClick={() => setActiveTab(stat.tab)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-surface-border transition-colors cursor-pointer"
          >
            {/* Subtle background glow on hover */}
            <div className={cn(
              "absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full",
              stat.color
            )} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 rounded-xl bg-surface-hover border border-surface-border">
                <Icon size={20} className="text-text-secondary" />
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full bg-surface-hover border border-surface-border",
                stat.isPositive ? "text-emerald-400" : "text-rose-400"
              )}>
                {stat.trend}
              </span>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-text-tertiary text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-2xl font-heading font-semibold text-white">{stat.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
