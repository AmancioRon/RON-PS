import React from 'react';
import { motion } from 'motion/react';
import { useGlobalState } from '../../context/GlobalState';

export function Activity() {
  const { activities } = useGlobalState();

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-white">Recent Activity</h2>
        <button className="text-xs font-medium text-text-tertiary hover:text-white transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-4"
            >
              <div className={`p-2.5 rounded-xl ${activity.bg} flex-shrink-0 mt-1`}>
                <Icon size={16} className={activity.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                <p className="text-xs text-text-tertiary mt-0.5 truncate">{activity.desc}</p>
              </div>
              <div className="text-xs text-text-tertiary whitespace-nowrap">
                {activity.time}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
