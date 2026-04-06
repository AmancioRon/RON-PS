import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Video, 
  Wallet, 
  Store, 
  Users, 
  Trophy, 
  Dumbbell, 
  Target,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGlobalState } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { supabase } from '../../lib/supabase';
import { ImageCropperModal } from '../ui/ImageCropperModal';
import logoImg from '../../assets/Logo.png';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'game-grind', label: 'Game Grind', icon: Gamepad2 },
  { id: 'video-ideas', label: 'Video Ideas', icon: Video },
  { id: 'savings', label: 'Savings', icon: Wallet },
  { id: 'store', label: 'Store', icon: Store },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'achievements', label: 'Achievements 2026', icon: Trophy },
  { id: 'diet-gym', label: 'Diet & Gym', icon: Dumbbell },
  { id: 'goals', label: 'Goals', icon: Target },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { userName, userAvatar, setUserAvatar } = useGlobalState();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropImageSrc(reader.result as string);
      setIsCropperOpen(true);
    });
    reader.readAsDataURL(file);
    
    // Reset input so the same file can be selected again if needed
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropperOpen(false);
    setCropImageSrc(null);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const fileExt = 'jpeg';
      const fileName = `${user.id}-avatar-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, croppedBlob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      
      setUserAvatar(data.publicUrl);
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  return (
    <>
      <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={handleFileChange} />

      {cropImageSrc && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            setCropImageSrc(null);
          }}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-surface border border-surface-border text-text-primary"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-surface/50 backdrop-blur-xl border-r border-surface-border z-40 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <img src={logoImg} alt="Life Stack Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-heading font-semibold text-text-primary tracking-wide text-lg">Life Stack</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "text-white bg-surface-hover" 
                    : "text-text-secondary hover:text-white hover:bg-surface-hover/50"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute left-0 w-1 h-6 bg-gradient-to-b from-accent-blue to-accent-violet rounded-r-full"
                  />
                )}
                <Icon size={18} className={cn("transition-colors", isActive ? "text-accent-blue" : "text-text-tertiary group-hover:text-text-secondary")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-surface-border/50 flex items-center justify-between">
          <LongPressable onLongPress={() => avatarInputRef.current?.click()} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-surface-hover border border-surface-border overflow-hidden shrink-0">
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{userName}</p>
              <p className="text-xs text-text-tertiary truncate">Personal HQ</p>
            </div>
          </LongPressable>
          <button onClick={handleLogout} className="p-2 text-text-tertiary hover:text-rose-400 transition-colors rounded-xl hover:bg-surface-hover">
            <LogOut size={18} />
          </button>
        </div>
      </motion.aside>
    </>
  );
}
