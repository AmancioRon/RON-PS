import React from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { GameGrind } from './components/modules/GameGrind';
import { VideoIdeas } from './components/modules/VideoIdeas';
import { Savings } from './components/modules/Savings';
import { Store } from './components/modules/Store';
import { Customers } from './components/modules/Customers';
import { Achievements } from './components/modules/Achievements';
import { DietGym } from './components/modules/DietGym';
import { Goals } from './components/modules/Goals';
import { GlobalStateProvider } from './context/GlobalState';

export default function App() {
  return (
    <GlobalStateProvider>
      <Layout>
        {(activeTab, setActiveTab) => {
          switch (activeTab) {
            case 'dashboard':
              return <Dashboard setActiveTab={setActiveTab} />;
            case 'game-grind':
              return <GameGrind />;
            case 'video-ideas':
              return <VideoIdeas />;
            case 'savings':
              return <Savings />;
            case 'store':
              return <Store />;
            case 'customers':
              return <Customers />;
            case 'achievements':
              return <Achievements />;
            case 'diet-gym':
              return <DietGym />;
            case 'goals':
              return <Goals />;
            default:
              return <Dashboard setActiveTab={setActiveTab} />;
          }
        }}
      </Layout>
    </GlobalStateProvider>
  );
}
