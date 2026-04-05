import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useGlobalState, Goal } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { ActionModal } from '../ui/ActionModal';

export function Goals() {
  const { goals, setGoals, logActivity } = useGlobalState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({ title: '', category: 'Finance', progress: 0, deadline: '' });

  const handleLongPress = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsActionOpen(true);
  };

  const handleEdit = () => {
    if (selectedGoal) {
      setFormData({
        title: selectedGoal.title,
        category: selectedGoal.category,
        progress: selectedGoal.progress,
        deadline: selectedGoal.deadline
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedGoal) {
      setGoals(goals.filter(g => g.id !== selectedGoal.id));
      logActivity('Deleted Goal', selectedGoal.title, Target, 'text-rose-400', 'bg-rose-400/10');
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (selectedGoal) {
      setGoals(goals.map(g => g.id === selectedGoal.id ? { ...g, ...formData } : g));
      logActivity('Updated Goal', formData.title, Target, 'text-purple-400', 'bg-purple-400/10');
    } else {
      setGoals([{ id: Date.now(), ...formData }, ...goals]);
      logActivity('Added Goal', formData.title, Target, 'text-purple-400', 'bg-purple-400/10');
    }
    
    setFormData({ title: '', category: 'Finance', progress: 0, deadline: '' });
    setIsModalOpen(false);
    setSelectedGoal(null);
  };

  const openAdd = () => {
    setSelectedGoal(null);
    setFormData({ title: '', category: 'Finance', progress: 0, deadline: '' });
    setIsModalOpen(true);
  };

  const updateProgress = (id: number, newProgress: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: newProgress } : g));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Target className="text-purple-400" size={32} />
            Yearly Goals
          </h1>
          <p className="text-text-tertiary mt-1">Track personal yearly goals across all major life areas.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal, index) => (
          <LongPressable
            key={goal.id}
            onLongPress={() => handleLongPress(goal)}
            className="glass-panel p-6 rounded-2xl cursor-pointer hover:border-purple-400/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface-hover border border-surface-border text-text-secondary">
                {goal.category}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-white mb-2">{goal.title}</h3>
            <p className="text-xs text-text-tertiary mb-6">Deadline: {goal.deadline || 'None'}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Progress</span>
                <span className="text-white font-medium">{goal.progress}%</span>
              </div>
              <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newProgress = Math.round((x / rect.width) * 100);
                updateProgress(goal.id, Math.max(0, Math.min(100, newProgress)));
              }}>
                <div className={`h-full rounded-full transition-all duration-300 ${goal.progress === 100 ? 'bg-emerald-400' : 'bg-purple-400'}`} style={{ width: `${goal.progress}%` }} />
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
        title="Goal Options"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedGoal ? "Edit Goal" : "Add Yearly Goal"}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Goal Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-400">
              <option>Finance</option>
              <option>Content</option>
              <option>Health</option>
              <option>Business</option>
              <option>Personal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Deadline</label>
            <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-400" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors mt-4">
            {selectedGoal ? 'Save Changes' : 'Save Goal'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
