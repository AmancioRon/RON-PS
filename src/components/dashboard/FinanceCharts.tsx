import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalState';

export function FinanceCharts() {
  const { transactions, storeItems } = useGlobalState();
  const [view, setView] = useState<'netWorth' | 'savings'>('netWorth');
  
  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let cumulativeSavings = 0;
    
    // Calculate total assets from store items (inventory value)
    const totalAssetsValue = storeItems.reduce((acc, item) => {
      if (item.status !== 'sold') {
        return acc + (item.boughtPrice * item.quantity);
      }
      return acc;
    }, 0);

    return months.map((month, index) => {
      // Get transactions for this month
      const monthTxs = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getFullYear() === currentYear && txDate.getMonth() === index;
      });

      const monthNet = monthTxs.reduce((acc, curr) => {
        return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
      }, 0);

      cumulativeSavings += monthNet;

      return {
        name: month,
        savings: cumulativeSavings,
        netWorth: cumulativeSavings + totalAssetsValue
      };
    });
  }, [transactions, storeItems]);

  const currentMonthIndex = new Date().getMonth();
  const currentValue = chartData[currentMonthIndex][view];
  
  const toggleView = () => setView(v => v === 'netWorth' ? 'savings' : 'netWorth');

  // Default brush range: show current month and a few months back
  const startIndex = Math.max(0, currentMonthIndex - 3);
  const endIndex = Math.min(11, currentMonthIndex + 2);

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
          <p className="text-sm text-text-tertiary mt-1 ml-10">Your financial progress in {new Date().getFullYear()}</p>
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

      <div className="flex-1 min-h-[250px] w-full mt-4 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
              dataKey={view} 
              stroke="var(--color-accent-teal)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
            <Brush 
              dataKey="name" 
              height={30} 
              stroke="var(--color-accent-teal)" 
              fill="var(--color-surface)"
              tickFormatter={() => ''}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
