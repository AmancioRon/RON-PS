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

function MainApp() {
  const { setUserName, setUserAvatar } = useGlobalState();
  
  // We can fetch the user name/avatar here if needed, but we already did it in AppContent
  // Actually, we should set them from the session data passed down, or just let GlobalState handle it.
  
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

function AppContent() {
  const [session, setSession] = useState<any>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

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
        setProfileData(data);
        
        // Sync app_state from Supabase to localStorage BEFORE GlobalStateProvider mounts
        if (data.app_state) {
          Object.keys(data.app_state).forEach(key => {
            window.localStorage.setItem(key, JSON.stringify(data.app_state[key]));
          });
        } else {
          // Clear local storage for new users so they don't inherit data from previous sessions
          const keysToClear = ['ls_transactions', 'ls_storeItems', 'ls_videoIdeas', 'ls_goals', 'ls_customers', 'ls_achievements', 'ls_meals', 'ls_gymDone', 'ls_creatineDone', 'ls_tasks', 'ls_grinds', 'ls_monthlyGoal', 'ls_proteinTarget'];
          keysToClear.forEach(key => window.localStorage.removeItem(key));
        }
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
    <GlobalStateProvider initialName={profileData?.full_name} initialAvatar={profileData?.avatar_url}>
      <MainApp />
    </GlobalStateProvider>
  );
}

export default function App() {
  return <AppContent />;
}
