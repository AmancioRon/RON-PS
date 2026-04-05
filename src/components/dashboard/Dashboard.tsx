import React from 'react';
import { Hero } from './Hero';
import { Stats } from './Stats';
import { Focus } from './Focus';
import { FinanceCharts } from './FinanceCharts';
import { QuickAccess } from './QuickAccess';
import { Activity } from './Activity';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  return (
    <div className="w-full">
      <Hero />
      <Stats setActiveTab={setActiveTab} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <FinanceCharts />
        </div>
        <div className="lg:col-span-1">
          <Focus />
        </div>
      </div>

      <QuickAccess setActiveTab={setActiveTab} />

      <div className="grid grid-cols-1 gap-8">
        <Activity />
      </div>
    </div>
  );
}
