import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Plus, Calendar } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useGlobalState, Achievement } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { ActionModal } from '../ui/ActionModal';

export function Achievements() {
  const { achievements, setAchievements, logActivity } = useGlobalState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', date: '' });

  const sortedAchievements = [...achievements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleLongPress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsActionOpen(true);
  };

  const handleEdit = () => {
    if (selectedAchievement) {
      setFormData({
        title: selectedAchievement.title,
        description: selectedAchievement.description,
        date: selectedAchievement.date
      });
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedAchievement) {
      setAchievements(achievements.filter(a => a.id !== selectedAchievement.id));
      logActivity('Deleted Achievement', selectedAchievement.title, Trophy, 'text-rose-400', 'bg-rose-400/10');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    if (selectedAchievement) {
      setAchievements(achievements.map(a => a.id === selectedAchievement.id ? { ...a, ...formData } : a));
      logActivity('Updated Achievement', formData.title, Trophy, 'text-accent-teal', 'bg-accent-teal/10');
    } else {
      setAchievements([{ id: Date.now(), ...formData }, ...achievements]);
      logActivity('Unlocked Achievement', formData.title, Trophy, 'text-accent-teal', 'bg-accent-teal/10');
    }
    
    setFormData({ title: '', description: '', date: '' });
    setIsFormOpen(false);
    setSelectedAchievement(null);
  };

  const openAdd = () => {
    setSelectedAchievement(null);
    setFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0] });
    setIsFormOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Trophy className="text-accent-teal" size={32} />
            Achievements 2026
          </h1>
          <p className="text-text-tertiary mt-1">Track meaningful achievements throughout the year to see growth.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
          <Plus size={18} />
          Add Milestone
        </button>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent-teal via-surface-border to-transparent" />

        <div className="space-y-12">
          {sortedAchievements.map((achievement, index) => (
            <LongPressable
              key={achievement.id}
              onLongPress={() => handleLongPress(achievement)}
              className="relative pl-24 group cursor-pointer"
            >
              {/* Timeline Node */}
              <div className="absolute left-[26px] top-1.5 w-3 h-3 rounded-full bg-accent-teal ring-4 ring-background z-10 group-hover:scale-150 transition-transform" />
              
              <div className="glass-panel p-6 rounded-3xl hover:border-accent-teal/50 transition-colors">
                <div className="flex items-center gap-2 text-accent-teal mb-2">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">{new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-text-secondary leading-relaxed">{achievement.description}</p>
              </div>
            </LongPressable>
          ))}
        </div>
      </div>

      <ActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Achievement Options"
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedAchievement ? "Edit Achievement" : "Add Achievement"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-teal" placeholder="e.g., Hit 10k Subscribers" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-teal" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-teal h-24 resize-none" placeholder="What did it take to get here?" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-accent-teal text-black rounded-xl font-medium hover:bg-teal-400 transition-colors mt-4">
            {selectedAchievement ? 'Save Changes' : 'Save Achievement'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
