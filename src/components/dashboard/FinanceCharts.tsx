import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const data = {
  netWorth: [
    { name: 'Jan', amount: 35000 },
    { name: 'Feb', amount: 36200 },
    { name: 'Mar', amount: 38500 },
    { name: 'Apr', amount: 39100 },
    { name: 'May', amount: 41000 },
    { name: 'Jun', amount: 42500 },
  ],
  savings: [
    { name: 'Jan', amount: 12000 },
    { name: 'Feb', amount: 12500 },
    { name: 'Mar', amount: 14000 },
    { name: 'Apr', amount: 14200 },
    { name: 'May', amount: 15500 },
    { name: 'Jun', amount: 16800 },
  ]
};

export function FinanceCharts() {
  const [view, setView] = useState<'netWorth' | 'savings'>('netWorth');
  
  const currentData = data[view];
  const currentValue = currentData[currentData.length - 1].amount;
  
  const toggleView = () => setView(v => v === 'netWorth' ? 'savings' : 'netWorth');

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <button onClick={toggleView} className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors text-text-secondary hover:text-white">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-heading font-semibold text-white w-32 text-center">
              {view === 'netWorth' ? 'Net Worth' : 'Total Savings'}
            </h2>
            <button onClick={toggleView} className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors text-text-secondary hover:text-white">
              <ChevronRight size={20} />
            </button>
          </div>
          <p className="text-sm text-text-tertiary mt-1 ml-10">Your financial progress in 2026</p>
        </div>
        <div className="text-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-2xl font-heading font-bold text-accent-teal"
            >
              ₱{currentValue.toLocaleString()}
            </motion.div>
          </AnimatePresence>
          <div className="text-xs text-text-tertiary">Current Amount</div>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] w-full mt-4 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent-teal)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-accent-teal)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-text-tertiary)" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--color-text-tertiary)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={-10}
              tickFormatter={(val) => `₱${val.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-surface-border)',
                borderRadius: '12px',
                color: 'var(--color-text-primary)'
              }}
              itemStyle={{ color: 'var(--color-accent-teal)' }}
              formatter={(value: number) => [`₱${value.toLocaleString()}`, view === 'netWorth' ? 'Net Worth' : 'Savings']}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="var(--color-accent-teal)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
