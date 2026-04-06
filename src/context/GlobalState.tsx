import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Video, Wallet, Dumbbell, Store, Trophy, Target, Users, Gamepad2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export type ActivityItem = { id: number; title: string; desc: string; time: string; icon: any; color: string; bg: string };
export type Transaction = { id: number; title: string; amount: number; type: 'income' | 'expense'; date: string };
export type StoreItem = { id: number; name: string; category: string; quantity: number; boughtPrice: number; sellPrice: number; status: 'available' | 'sold' | 'reserved' };
export type VideoIdea = { id: number; title: string; source: string; platform: string; status: string };
export type Goal = { id: number; title: string; category: string; progress: number; deadline: string };
export type Customer = { id: number; name: string; order: string; status: 'inquiry' | 'pending' | 'paid' | 'shipped' | 'completed'; date: string };
export type Achievement = { id: number; title: string; description: string; date: string };
export type Meal = { id: number; name: string; protein: number; done: boolean };
export type Task = { id: number; title: string; completed: boolean; priority: string };
export type Grind = { id: number; game: string; goal: string; progress: number; status: string; priority: string };

function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

interface GlobalStateContextType {
  activities: ActivityItem[];
  logActivity: (title: string, desc: string, icon: any, color: string, bg: string) => void;
  
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  
  storeItems: StoreItem[];
  setStoreItems: React.Dispatch<React.SetStateAction<StoreItem[]>>;
  
  videoIdeas: VideoIdea[];
  setVideoIdeas: React.Dispatch<React.SetStateAction<VideoIdea[]>>;
  
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  gymDone: boolean; setGymDone: (v: boolean) => void;
  creatineDone: boolean; setCreatineDone: (v: boolean) => void;
  
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  
  grinds: Grind[];
  setGrinds: React.Dispatch<React.SetStateAction<Grind[]>>;

  monthlyGoal: number;
  setMonthlyGoal: React.Dispatch<React.SetStateAction<number>>;

  proteinTarget: number;
  setProteinTarget: React.Dispatch<React.SetStateAction<number>>;

  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userAvatar: string;
  setUserAvatar: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalStateProvider({ children, initialName, initialAvatar }: { children: ReactNode, initialName?: string, initialAvatar?: string }) {
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: 1, title: 'System Initialized', desc: 'Welcome to Life Stack', time: 'Just now', icon: Target, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  ]);

  const logActivity = (title: string, desc: string, icon: any, color: string, bg: string) => {
    setActivities(prev => [{ id: Date.now(), title, desc, time: 'Just now', icon, color, bg }, ...prev].slice(0, 10));
  };

  const [transactions, setTransactions] = useStickyState<Transaction[]>([], 'ls_transactions');
  const [storeItems, setStoreItems] = useStickyState<StoreItem[]>([], 'ls_storeItems');
  const [videoIdeas, setVideoIdeas] = useStickyState<VideoIdea[]>([], 'ls_videoIdeas');
  const [goals, setGoals] = useStickyState<Goal[]>([], 'ls_goals');
  const [customers, setCustomers] = useStickyState<Customer[]>([], 'ls_customers');
  const [achievements, setAchievements] = useStickyState<Achievement[]>([], 'ls_achievements');
  const [meals, setMeals] = useStickyState<Meal[]>([], 'ls_meals');
  const [gymDone, setGymDone] = useStickyState(false, 'ls_gymDone');
  const [creatineDone, setCreatineDone] = useStickyState(false, 'ls_creatineDone');
  const [tasks, setTasks] = useStickyState<Task[]>([], 'ls_tasks');
  const [grinds, setGrinds] = useStickyState<Grind[]>([], 'ls_grinds');
  const [monthlyGoal, setMonthlyGoal] = useStickyState<number>(0, 'ls_monthlyGoal');
  const [proteinTarget, setProteinTarget] = useStickyState<number>(0, 'ls_proteinTarget');

  const [userName, setUserName] = useState<string>(initialName || 'Ron Jamelle Amancio');
  const [userAvatar, setUserAvatar] = useState<string>(initialAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');

  // Sync state to Supabase
  useEffect(() => {
    const syncToSupabase = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const appState = {
        ls_transactions: transactions,
        ls_storeItems: storeItems,
        ls_videoIdeas: videoIdeas,
        ls_goals: goals,
        ls_customers: customers,
        ls_achievements: achievements,
        ls_meals: meals,
        ls_gymDone: gymDone,
        ls_creatineDone: creatineDone,
        ls_tasks: tasks,
        ls_grinds: grinds,
        ls_monthlyGoal: monthlyGoal,
        ls_proteinTarget: proteinTarget
      };

      try {
        await supabase
          .from('profiles')
          .update({ app_state: appState })
          .eq('id', session.user.id);
      } catch (error) {
        console.error('Failed to sync state to Supabase', error);
      }
    };

    // Debounce the sync so we don't spam the database on every keystroke
    const timeoutId = setTimeout(() => {
      syncToSupabase();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [
    transactions, storeItems, videoIdeas, goals, customers, achievements, 
    meals, gymDone, creatineDone, tasks, grinds, monthlyGoal, proteinTarget
  ]);

  return (
    <GlobalStateContext.Provider value={{
      activities, logActivity,
      transactions, setTransactions,
      storeItems, setStoreItems,
      videoIdeas, setVideoIdeas,
      goals, setGoals,
      customers, setCustomers,
      achievements, setAchievements,
      meals, setMeals, gymDone, setGymDone, creatineDone, setCreatineDone,
      tasks, setTasks,
      grinds, setGrinds,
      monthlyGoal, setMonthlyGoal,
      proteinTarget, setProteinTarget,
      userName, setUserName,
      userAvatar, setUserAvatar
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}
