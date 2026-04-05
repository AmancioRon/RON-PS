import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Plus, Search } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useGlobalState, Grind } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { ActionModal } from '../ui/ActionModal';

export function GameGrind() {
  const { grinds, setGrinds, logActivity } = useGlobalState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedGrind, setSelectedGrind] = useState<Grind | null>(null);
  const [formData, setFormData] = useState({ game: '', goal: '', priority: 'medium', progress: 0 });

  const handleLongPress = (grind: Grind) => {
    setSelectedGrind(grind);
    setIsActionOpen(true);
  };

  const handleEdit = () => {
    if (selectedGrind) {
      setFormData({
        game: selectedGrind.game,
        goal: selectedGrind.goal,
        priority: selectedGrind.priority,
        progress: selectedGrind.progress
      });
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedGrind) {
      setGrinds(grinds.filter(g => g.id !== selectedGrind.id));
      logActivity('Deleted Grind', selectedGrind.goal, Gamepad2, 'text-rose-400', 'bg-rose-400/10');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.game || !formData.goal) return;

    if (selectedGrind) {
      setGrinds(grinds.map(g => g.id === selectedGrind.id ? { ...g, ...formData, status: formData.progress === 100 ? 'completed' : 'grinding' } : g));
      logActivity('Updated Grind', formData.goal, Gamepad2, 'text-accent-blue', 'bg-accent-blue/10');
    } else {
      setGrinds([{ id: Date.now(), ...formData, status: formData.progress === 100 ? 'completed' : 'grinding' }, ...grinds]);
      logActivity('Added Grind', formData.goal, Gamepad2, 'text-accent-blue', 'bg-accent-blue/10');
    }
    
    setFormData({ game: '', goal: '', priority: 'medium', progress: 0 });
    setIsFormOpen(false);
    setSelectedGrind(null);
  };

  const openAdd = () => {
    setSelectedGrind(null);
    setFormData({ game: '', goal: '', priority: 'medium', progress: 0 });
    setIsFormOpen(true);
  };

  const updateProgress = (id: number, newProgress: number) => {
    setGrinds(grinds.map(g => {
      if (g.id === id) {
        const status = newProgress === 100 ? 'completed' : 'grinding';
        return { ...g, progress: newProgress, status };
      }
      return g;
    }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Gamepad2 className="text-accent-blue" size={32} />
            Game Grind
          </h1>
          <p className="text-text-tertiary mt-1">Track your progress, materials, and goals across different games.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
          <Plus size={18} />
          New Grind
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grinds.map((grind, index) => (
          <LongPressable
            key={grind.id}
            onLongPress={() => handleLongPress(grind)}
            className="glass-panel p-6 rounded-3xl relative overflow-hidden group cursor-pointer hover:border-accent-blue/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                grind.status === 'completed' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' :
                'bg-accent-blue/10 border-accent-blue/20 text-accent-blue'
              }`}>
                {grind.status.charAt(0).toUpperCase() + grind.status.slice(1)}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                grind.priority === 'high' ? 'bg-rose-500/20 text-rose-400' :
                grind.priority === 'medium' ? 'bg-accent-gold/20 text-accent-gold' :
                'bg-surface-hover text-text-tertiary'
              }`}>
                {grind.priority.toUpperCase()}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-white mb-1">{grind.goal}</h3>
            <p className="text-sm text-text-tertiary mb-6">{grind.game}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Progress</span>
                <span className="text-white font-medium">{grind.progress}%</span>
              </div>
              <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newProgress = Math.round((x / rect.width) * 100);
                updateProgress(grind.id, Math.max(0, Math.min(100, newProgress)));
              }}>
                <div className={`h-full rounded-full transition-all duration-300 ${grind.progress === 100 ? 'bg-emerald-400' : 'bg-accent-blue'}`} style={{ width: `${grind.progress}%` }} />
              </div>
            </div>
          </LongPressable>
        ))}
      </div>

      <ActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Grind Options"
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedGrind ? "Edit Grind" : "Add New Grind"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Game Name</label>
            <input type="text" value={formData.game} onChange={e => setFormData({...formData, game: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-blue" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Goal / Item</label>
            <input type="text" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-blue" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-blue">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Progress (%)</label>
              <input type="number" value={formData.progress} onChange={e => setFormData({...formData, progress: parseInt(e.target.value) || 0})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-blue" min="0" max="100" />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 bg-accent-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors mt-4">
            {selectedGrind ? 'Save Changes' : 'Save Grind'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
