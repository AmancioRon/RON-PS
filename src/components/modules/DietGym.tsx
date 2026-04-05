import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Flame, Droplets, CheckCircle2, Circle, Plus, Target } from 'lucide-react';
import { useGlobalState, Meal } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { ActionModal } from '../ui/ActionModal';
import { Modal } from '../ui/Modal';

export function DietGym() {
  const { meals, setMeals, gymDone, setGymDone, creatineDone, setCreatineDone, logActivity, proteinTarget, setProteinTarget } = useGlobalState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [formData, setFormData] = useState({ name: '', protein: '' });

  const [isProteinModalOpen, setIsProteinModalOpen] = useState(false);
  const [proteinInput, setProteinInput] = useState('');

  const currentProtein = meals.filter(m => m.done).reduce((acc, curr) => acc + curr.protein, 0);

  const toggleMeal = (id: number) => {
    setMeals(meals.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  const handleLongPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsActionOpen(true);
  };

  const handleEdit = () => {
    if (selectedMeal) {
      setFormData({ name: selectedMeal.name, protein: selectedMeal.protein.toString() });
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedMeal) {
      setMeals(meals.filter(m => m.id !== selectedMeal.id));
      logActivity('Deleted Meal', selectedMeal.name, Dumbbell, 'text-rose-400', 'bg-rose-400/10');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (selectedMeal) {
      setMeals(meals.map(m => m.id === selectedMeal.id ? { ...m, name: formData.name, protein: parseInt(formData.protein) || 0 } : m));
      logActivity('Updated Meal', formData.name, Dumbbell, 'text-rose-400', 'bg-rose-400/10');
    } else {
      setMeals([{ id: Date.now(), name: formData.name, protein: parseInt(formData.protein) || 0, done: false }, ...meals]);
      logActivity('Added Meal', formData.name, Dumbbell, 'text-rose-400', 'bg-rose-400/10');
    }
    
    setFormData({ name: '', protein: '' });
    setIsFormOpen(false);
    setSelectedMeal(null);
  };

  const handleProteinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget = parseInt(proteinInput);
    if (!isNaN(newTarget) && newTarget > 0) {
      setProteinTarget(newTarget);
      logActivity('Updated Protein Target', `${newTarget}g`, Target, 'text-rose-400', 'bg-rose-400/10');
      setIsProteinModalOpen(false);
    }
  };

  const openAdd = () => {
    setSelectedMeal(null);
    setFormData({ name: '', protein: '' });
    setIsFormOpen(true);
  };

  const openProteinEdit = () => {
    setProteinInput(proteinTarget.toString());
    setIsProteinModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Dumbbell className="text-rose-400" size={32} />
            Diet & Gym
          </h1>
          <p className="text-text-tertiary mt-1">Track daily health, gym consistency, and protein goals.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
          <Plus size={18} />
          Add Meal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <LongPressable 
          onLongPress={openProteinEdit}
          className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-rose-400/50 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-rose-400/10 flex items-center justify-center mb-4">
            <Droplets className="text-rose-400" size={32} />
          </div>
          <h3 className="text-sm font-medium text-text-secondary mb-1">Daily Protein</h3>
          <p className="text-3xl font-heading font-bold text-white mb-4">{currentProtein} <span className="text-lg text-text-tertiary font-medium">/ {proteinTarget}g</span></p>
          <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
            <div className="h-full bg-rose-400 transition-all duration-500" style={{ width: `${Math.min(100, (currentProtein / proteinTarget) * 100)}%` }} />
          </div>
        </LongPressable>

        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-surface-border transition-colors" onClick={() => { setGymDone(!gymDone); logActivity('Gym Status Updated', gymDone ? 'Pending' : 'Completed', Dumbbell, 'text-emerald-400', 'bg-emerald-400/10'); }}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${gymDone ? 'bg-emerald-400/10 text-emerald-400' : 'bg-surface-hover text-text-tertiary'}`}>
            <Dumbbell size={32} />
          </div>
          <h3 className="text-sm font-medium text-text-secondary mb-1">Gym Workout</h3>
          <p className={`text-xl font-heading font-bold ${gymDone ? 'text-emerald-400' : 'text-white'}`}>{gymDone ? 'Completed' : 'Pending'}</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-surface-border transition-colors" onClick={() => { setCreatineDone(!creatineDone); logActivity('Creatine Status Updated', creatineDone ? 'Pending' : 'Taken', Flame, 'text-accent-gold', 'bg-accent-gold/10'); }}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${creatineDone ? 'bg-accent-gold/10 text-accent-gold' : 'bg-surface-hover text-text-tertiary'}`}>
            <Flame size={32} />
          </div>
          <h3 className="text-sm font-medium text-text-secondary mb-1">Creatine (5g)</h3>
          <p className={`text-xl font-heading font-bold ${creatineDone ? 'text-accent-gold' : 'text-white'}`}>{creatineDone ? 'Taken' : 'Pending'}</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-heading font-semibold text-white mb-6">Today's Meals</h2>
        <div className="space-y-4">
          {meals.map((meal) => (
            <LongPressable
              key={meal.id}
              onLongPress={() => handleLongPress(meal)}
              onClick={() => toggleMeal(meal.id)}
              className="flex items-center justify-between p-4 rounded-2xl bg-surface-hover border border-surface-border cursor-pointer group hover:border-rose-400/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <button className="text-text-tertiary group-hover:text-rose-400 transition-colors">
                  {meal.done ? <CheckCircle2 size={24} className="text-rose-400" /> : <Circle size={24} />}
                </button>
                <span className={`font-medium transition-colors ${meal.done ? 'text-text-tertiary line-through' : 'text-white'}`}>{meal.name}</span>
              </div>
              <span className="text-sm font-medium text-rose-400">{meal.protein}g</span>
            </LongPressable>
          ))}
        </div>
      </div>

      <ActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Meal Options"
      />

      <Modal isOpen={isProteinModalOpen} onClose={() => setIsProteinModalOpen(false)} title="Edit Protein Target">
        <form onSubmit={handleProteinSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Daily Protein Target (g)</label>
            <input type="number" value={proteinInput} onChange={e => setProteinInput(e.target.value)} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-400" required min="1" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors mt-4">
            Save Target
          </button>
        </form>
      </Modal>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedMeal ? "Edit Meal" : "Add Meal"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Meal Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Protein (g)</label>
            <input type="number" value={formData.protein} onChange={e => setFormData({...formData, protein: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-400" required />
          </div>
          <button type="submit" className="w-full py-2.5 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors mt-4">
            {selectedMeal ? 'Save Changes' : 'Save Meal'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
