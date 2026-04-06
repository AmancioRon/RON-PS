import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Target, Mail, Lock } from 'lucide-react';
import logoImg from '../../assets/Logo.png';

export function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 flex items-center justify-center mb-4">
            <img src={logoImg} alt="Life Stack Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Life Stack</h1>
          <p className="text-text-tertiary text-center">Discipline Builds Freedom. Stay Locked In.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-tertiary" />
              </div>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-surface border border-surface-border rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-accent-blue transition-colors" 
                placeholder="you@example.com"
                required 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-tertiary" />
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-surface border border-surface-border rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-accent-blue transition-colors" 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-tertiary" />
                </div>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="w-full bg-surface border border-surface-border rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-accent-blue transition-colors" 
                  placeholder="••••••••"
                  required={!isLogin} 
                />
              </div>
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-accent-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 mt-6"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-tertiary">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setPassword('');
                setConfirmPassword('');
              }} 
              className="text-accent-blue hover:text-blue-400 font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
