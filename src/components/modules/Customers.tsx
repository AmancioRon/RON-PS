import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Plus, Search } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useGlobalState, Customer } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { ActionModal } from '../ui/ActionModal';

export function Customers() {
  const { customers, setCustomers, logActivity } = useGlobalState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: '', order: '', status: 'inquiry' as any });

  const handleLongPress = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsActionOpen(true);
  };

  const handleEdit = () => {
    if (selectedCustomer) {
      setFormData({
        name: selectedCustomer.name,
        order: selectedCustomer.order,
        status: selectedCustomer.status
      });
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedCustomer) {
      setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
      logActivity('Deleted Customer', selectedCustomer.name, Users, 'text-rose-400', 'bg-rose-400/10');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (selectedCustomer) {
      setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...c, ...formData } : c));
      logActivity('Updated Customer', formData.name, Users, 'text-accent-blue', 'bg-accent-blue/10');
    } else {
      setCustomers([{ id: Date.now(), ...formData, date: new Date().toISOString().split('T')[0] }, ...customers]);
      logActivity('Added Customer', formData.name, Users, 'text-accent-blue', 'bg-accent-blue/10');
    }
    
    setFormData({ name: '', order: '', status: 'inquiry' });
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  const openAdd = () => {
    setSelectedCustomer(null);
    setFormData({ name: '', order: '', status: 'inquiry' });
    setIsFormOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'paid': return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
      case 'shipped': return 'bg-accent-violet/10 text-accent-violet border-accent-violet/20';
      case 'pending': return 'bg-accent-gold/10 text-accent-gold border-accent-gold/20';
      default: return 'bg-surface-hover text-text-secondary border-surface-border';
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Users className="text-accent-blue" size={32} />
            Customers
          </h1>
          <p className="text-text-tertiary mt-1">Track customer orders, services, payment status, and fulfillment.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-surface-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full bg-surface border border-surface-border rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-accent-blue"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface/50">
                <th className="p-4 text-sm font-medium text-text-secondary">Customer</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Order / Service</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Date</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-surface-border hover:bg-surface-hover/50 transition-colors">
                  <td className="p-4">
                    <LongPressable onLongPress={() => handleLongPress(customer)} className="font-medium text-white cursor-pointer">
                      {customer.name}
                    </LongPressable>
                  </td>
                  <td className="p-4 text-text-secondary">{customer.order}</td>
                  <td className="p-4 text-text-tertiary text-sm">{customer.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ActionModal
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Customer Options"
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedCustomer ? "Edit Customer" : "Add Customer"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Customer Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-blue" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Order / Service Description</label>
            <input type="text" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-blue" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-blue">
              <option value="inquiry">Inquiry</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped / Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 bg-accent-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors mt-4">
            {selectedCustomer ? 'Save Changes' : 'Save Customer'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
