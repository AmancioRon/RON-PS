import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Video, Plus, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useGlobalState, VideoIdea } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { ActionModal } from '../ui/ActionModal';

export function VideoIdeas() {
  const { videoIdeas, setVideoIdeas, logActivity } = useGlobalState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<VideoIdea | null>(null);
  const [formData, setFormData] = useState({ title: '', source: '', platform: 'YouTube', status: 'planned' });

  const handleLongPress = (idea: VideoIdea) => {
    setSelectedIdea(idea);
    setIsActionOpen(true);
  };

  const handleEdit = () => {
    if (selectedIdea) {
      setFormData({
        title: selectedIdea.title,
        source: selectedIdea.source,
        platform: selectedIdea.platform,
        status: selectedIdea.status
      });
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedIdea) {
      setVideoIdeas(videoIdeas.filter(i => i.id !== selectedIdea.id));
      logActivity('Deleted Video Idea', selectedIdea.title, Video, 'text-rose-400', 'bg-rose-400/10');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (selectedIdea) {
      setVideoIdeas(videoIdeas.map(i => i.id === selectedIdea.id ? { ...i, ...formData } : i));
      logActivity('Updated Video Idea', formData.title, Video, 'text-accent-violet', 'bg-accent-violet/10');
    } else {
      setVideoIdeas([{ id: Date.now(), ...formData }, ...videoIdeas]);
      logActivity('Added Video Idea', formData.title, Video, 'text-accent-violet', 'bg-accent-violet/10');
    }
    
    setFormData({ title: '', source: '', platform: 'YouTube', status: 'planned' });
    setIsFormOpen(false);
    setSelectedIdea(null);
  };

  const openAdd = () => {
    setSelectedIdea(null);
    setFormData({ title: '', source: '', platform: 'YouTube', status: 'planned' });
    setIsFormOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Video className="text-accent-violet" size={32} />
            Video Ideas
          </h1>
          <p className="text-text-tertiary mt-1">Store and organize content ideas from TikTok, Instagram, and YouTube.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
          <Plus size={18} />
          Add Idea
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoIdeas.map((idea, index) => (
          <LongPressable
            key={idea.id}
            onLongPress={() => handleLongPress(idea)}
            className="glass-panel p-6 rounded-3xl relative overflow-hidden group cursor-pointer hover:border-accent-violet/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                idea.status === 'completed' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' :
                idea.status === 'scripting' ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' :
                'bg-surface-hover border-surface-border text-text-secondary'
              }`}>
                {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
              </span>
              <span className="text-xs font-medium text-text-tertiary px-2 py-1 bg-surface-hover rounded-md">
                {idea.platform}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-white mb-4">{idea.title}</h3>
            
            {idea.source && (
              <a href={idea.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-accent-violet hover:text-purple-400 transition-colors">
                <ExternalLink size={14} />
                View Source
              </a>
            )}
          </LongPressable>
        ))}
      </div>

      <ActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Video Idea Options"
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedIdea ? "Edit Idea" : "Add Video Idea"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Idea Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-violet" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Source URL (Optional)</label>
            <input type="url" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-violet" placeholder="https://" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Platform</label>
              <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-violet">
                <option>YouTube</option>
                <option>TikTok</option>
                <option>Instagram</option>
                <option>Shorts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-violet">
                <option value="planned">Planned</option>
                <option value="scripting">Scripting</option>
                <option value="filming">Filming</option>
                <option value="editing">Editing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 bg-accent-violet text-white rounded-xl font-medium hover:bg-purple-600 transition-colors mt-4">
            {selectedIdea ? 'Save Changes' : 'Save Idea'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
