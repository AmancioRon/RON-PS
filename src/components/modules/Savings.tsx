import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useGlobalState, Transaction } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { ActionModal } from '../ui/ActionModal';

export function Savings() {
  const { transactions, setTransactions, logActivity, monthlyGoal, setMonthlyGoal } = useGlobalState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({ title: '', amount: '', type: 'income' as 'income' | 'expense' });

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const totalSavings = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const handleLongPress = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsActionOpen(true);
  };

  const handleEdit = () => {
    if (selectedTx) {
      setFormData({ title: selectedTx.title, amount: selectedTx.amount.toString(), type: selectedTx.type });
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedTx) {
      setTransactions(transactions.filter(t => t.id !== selectedTx.id));
      logActivity('Deleted Transaction', selectedTx.title, Wallet, 'text-rose-400', 'bg-rose-400/10');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    const amount = parseFloat(formData.amount);
    
    if (selectedTx) {
      setTransactions(transactions.map(t => t.id === selectedTx.id ? { ...t, title: formData.title, amount, type: formData.type } : t));
      logActivity('Updated Transaction', formData.title, Wallet, 'text-accent-blue', 'bg-accent-blue/10');
    } else {
      setTransactions([{ id: Date.now(), title: formData.title, amount, type: formData.type, date: new Date().toISOString().split('T')[0] }, ...transactions]);
      logActivity('Added Transaction', formData.title, Wallet, 'text-emerald-400', 'bg-emerald-400/10');
    }
    
    setFormData({ title: '', amount: '', type: 'income' });
    setIsFormOpen(false);
    setSelectedTx(null);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal = parseFloat(goalInput);
    if (!isNaN(newGoal) && newGoal > 0) {
      setMonthlyGoal(newGoal);
      logActivity('Updated Monthly Goal', `₱${newGoal.toLocaleString()}`, Target, 'text-emerald-400', 'bg-emerald-400/10');
      setIsGoalModalOpen(false);
    }
  };

  const openAdd = () => {
    setSelectedTx(null);
    setFormData({ title: '', amount: '', type: 'income' });
    setIsFormOpen(true);
  };

  const openGoalEdit = () => {
    setGoalInput(monthlyGoal.toString());
    setIsGoalModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Wallet className="text-emerald-400" size={32} />
            Savings & Finance
          </h1>
          <p className="text-text-tertiary mt-1">Track money, unstable income sources, and personal net worth.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-3xl md:col-span-2 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3" />
          <h3 className="text-sm font-medium text-text-secondary mb-2 relative z-10">Total Net Worth / Savings</h3>
          <p className="text-5xl font-heading font-bold text-white relative z-10">₱{totalSavings.toLocaleString()}</p>
        </div>
        
        <LongPressable 
          onLongPress={openGoalEdit}
          className="glass-panel p-6 rounded-3xl flex flex-col justify-center cursor-pointer hover:border-emerald-400/50 transition-colors"
        >
          <h3 className="text-sm font-medium text-text-secondary mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-tertiary">Monthly Goal</span>
                <span className="text-white font-medium">₱{monthlyGoal.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${Math.min(100, (totalSavings / monthlyGoal) * 100)}%` }} />
              </div>
            </div>
          </div>
        </LongPressable>
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-heading font-semibold text-white mb-6">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <LongPressable
              key={tx.id}
              onLongPress={() => handleLongPress(tx)}
              className="flex items-center justify-between p-4 rounded-2xl bg-surface-hover border border-surface-border cursor-pointer hover:border-emerald-400/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${tx.type === 'income' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}`}>
                  {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <p className="font-medium text-white">{tx.title}</p>
                  <p className="text-xs text-text-tertiary">{tx.date}</p>
                </div>
              </div>
              <span className={`font-heading font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tx.type === 'income' ? '+' : '-'}₱{tx.amount.toLocaleString()}
              </span>
            </LongPressable>
          ))}
        </div>
      </div>

      <ActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Transaction Options"
      />

      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="Edit Monthly Goal">
        <form onSubmit={handleGoalSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Monthly Goal Amount (₱)</label>
            <input type="number" value={goalInput} onChange={e => setGoalInput(e.target.value)} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-400" required min="1" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors mt-4">
            Save Goal
          </button>
        </form>
      </Modal>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedTx ? "Edit Transaction" : "New Transaction"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Title / Source</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Amount (₱)</label>
            <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`py-2 rounded-xl border font-medium transition-colors ${formData.type === 'income' ? 'bg-emerald-400/20 border-emerald-400 text-emerald-400' : 'bg-surface border-surface-border text-text-secondary'}`}>
                Income
              </button>
              <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`py-2 rounded-xl border font-medium transition-colors ${formData.type === 'expense' ? 'bg-rose-400/20 border-rose-400 text-rose-400' : 'bg-surface border-surface-border text-text-secondary'}`}>
                Expense
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors mt-4">
            {selectedTx ? 'Save Changes' : 'Save Transaction'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
