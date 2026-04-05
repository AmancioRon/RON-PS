import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus } from 'lucide-react';
import { useGlobalState, Task } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { ActionModal } from '../ui/ActionModal';
import { Modal } from '../ui/Modal';

export function Focus() {
  const { tasks, setTasks, logActivity } = useGlobalState();
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ title: '', priority: 'medium' });

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleLongPress = (task: Task) => {
    setSelectedTask(task);
    setIsActionOpen(true);
  };

  const handleEdit = () => {
    if (selectedTask) {
      setFormData({ title: selectedTask.title, priority: selectedTask.priority });
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedTask) {
      setTasks(tasks.filter(t => t.id !== selectedTask.id));
      logActivity('Deleted Task', selectedTask.title, CheckCircle2, 'text-rose-400', 'bg-rose-400/10');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (selectedTask) {
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, ...formData } : t));
      logActivity('Updated Task', formData.title, CheckCircle2, 'text-accent-blue', 'bg-accent-blue/10');
    } else {
      setTasks([{ id: Date.now(), title: formData.title, priority: formData.priority, completed: false }, ...tasks]);
      logActivity('Added Task', formData.title, CheckCircle2, 'text-accent-blue', 'bg-accent-blue/10');
    }
    setIsFormOpen(false);
    setSelectedTask(null);
    setFormData({ title: '', priority: 'medium' });
  };

  const openAdd = () => {
    setSelectedTask(null);
    setFormData({ title: '', priority: 'medium' });
    setIsFormOpen(true);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-white">Today's Focus</h2>
        <button onClick={openAdd} className="text-text-tertiary hover:text-white transition-colors">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {tasks.map((task) => (
          <LongPressable
            key={task.id}
            onLongPress={() => handleLongPress(task)}
            onClick={() => toggleTask(task.id)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-surface-hover border border-surface-border cursor-pointer group hover:border-accent-blue/50 transition-colors"
          >
            <button className="text-text-tertiary group-hover:text-accent-blue transition-colors flex-shrink-0">
              {task.completed ? <CheckCircle2 size={24} className="text-accent-blue" /> : <Circle size={24} />}
            </button>
            <span className={`font-medium transition-colors ${task.completed ? 'text-text-tertiary line-through' : 'text-white'}`}>
              {task.title}
            </span>
          </LongPressable>
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-text-tertiary py-8">No tasks for today.</div>
        )}
      </div>

      <ActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Task Options"
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedTask ? "Edit Task" : "Add Task"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Task Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-blue" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-blue">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 bg-accent-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors mt-4">
            {selectedTask ? 'Save Changes' : 'Add Task'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
