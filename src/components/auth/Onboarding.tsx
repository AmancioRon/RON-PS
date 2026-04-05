import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Camera, ArrowRight } from 'lucide-react';
import { ImageCropperModal } from '../ui/ImageCropperModal';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropImageSrc(reader.result as string);
      setIsCropperOpen(true);
    });
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropperOpen(false);
    setCropImageSrc(null);
    setLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const fileExt = 'jpeg';
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, croppedBlob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    setError(null);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          full_name: name, 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome to Life Stack</h1>
          <p className="text-text-tertiary">Let's set up your profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-surface border-2 border-surface-border flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-text-tertiary" size={32} />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                className="hidden"
                disabled={loading}
              />
            </div>
            <p className="text-sm text-text-tertiary mt-2">Upload Profile Picture</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-surface border border-surface-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-blue transition-colors" 
              required 
              placeholder="e.g. Ron Jamelle Amancio"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !name}
            className="w-full py-3 bg-accent-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Saving...' : 'Continue'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
