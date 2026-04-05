import React, { useState, useEffect } from 'react';
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
import { GlobalStateProvider, useGlobalState } from './context/GlobalState';
import { Auth } from './components/auth/Auth';
import { Onboarding } from './components/auth/Onboarding';
import { supabase } from './lib/supabase';

function AppContent() {
  const [session, setSession] = useState<any>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUserName, setUserAvatar } = useGlobalState();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && (error.code === 'PGRST116' || error.code === '42P01')) {
        // Profile doesn't exist or table doesn't exist yet
        setNeedsOnboarding(true);
      } else if (data) {
        setNeedsOnboarding(false);
        if (data.full_name) setUserName(data.full_name);
        if (data.avatar_url) setUserAvatar(data.avatar_url);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    setNeedsOnboarding(false);
    if (session) {
      await checkProfile(session.user.id);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
  }

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  if (needsOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
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
  );
}

export default function App() {
  return (
    <GlobalStateProvider>
      <AppContent />
    </GlobalStateProvider>
  );
}
