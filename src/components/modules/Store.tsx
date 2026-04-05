import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store as StoreIcon, Plus, Package, DollarSign, TrendingUp } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useGlobalState, StoreItem } from '../../context/GlobalState';
import { LongPressable } from '../ui/LongPressable';
import { ActionModal } from '../ui/ActionModal';

export function Store() {
  const { storeItems, setStoreItems, logActivity } = useGlobalState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [formData, setFormData] = useState({ name: '', category: '', quantity: '1', boughtPrice: '', sellPrice: '', status: 'available' as 'available'|'sold'|'reserved' });

  const handleLongPress = (item: StoreItem) => {
    setSelectedItem(item);
    setIsActionOpen(true);
  };

  const handleEdit = () => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name,
        category: selectedItem.category,
        quantity: selectedItem.quantity.toString(),
        boughtPrice: selectedItem.boughtPrice.toString(),
        sellPrice: selectedItem.sellPrice.toString(),
        status: selectedItem.status
      });
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      setStoreItems(storeItems.filter(i => i.id !== selectedItem.id));
      logActivity('Deleted Store Item', selectedItem.name, StoreIcon, 'text-rose-400', 'bg-rose-400/10');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newItem = {
      id: selectedItem ? selectedItem.id : Date.now(),
      name: formData.name,
      category: formData.category || 'General',
      quantity: parseInt(formData.quantity) || 1,
      boughtPrice: parseFloat(formData.boughtPrice) || 0,
      sellPrice: parseFloat(formData.sellPrice) || 0,
      status: formData.status
    };

    if (selectedItem) {
      setStoreItems(storeItems.map(i => i.id === selectedItem.id ? newItem : i));
      logActivity('Updated Store Item', formData.name, StoreIcon, 'text-accent-gold', 'bg-accent-gold/10');
    } else {
      setStoreItems([newItem, ...storeItems]);
      logActivity('Added Store Item', formData.name, StoreIcon, 'text-accent-gold', 'bg-accent-gold/10');
    }

    setFormData({ name: '', category: '', quantity: '1', boughtPrice: '', sellPrice: '', status: 'available' });
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const openAdd = () => {
    setSelectedItem(null);
    setFormData({ name: '', category: '', quantity: '1', boughtPrice: '', sellPrice: '', status: 'available' });
    setIsFormOpen(true);
  };

  const totalInventoryValue = storeItems.filter(i => i.status === 'available').reduce((acc, curr) => acc + (curr.sellPrice * curr.quantity), 0);
  const expectedProfit = storeItems.filter(i => i.status === 'available').reduce((acc, curr) => acc + ((curr.sellPrice - curr.boughtPrice) * curr.quantity), 0);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <StoreIcon className="text-accent-gold" size={32} />
            Store Inventory
          </h1>
          <p className="text-text-tertiary mt-1">Track your buy-and-sell inventory and products.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-accent-gold/10 text-accent-gold">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Active Items</p>
            <p className="text-2xl font-heading font-bold text-white">{storeItems.filter(i => i.status === 'available').length}</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-400/10 text-emerald-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Inventory Value</p>
            <p className="text-2xl font-heading font-bold text-white">₱{totalInventoryValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-accent-blue/10 text-accent-blue">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Expected Profit</p>
            <p className="text-2xl font-heading font-bold text-white">₱{expectedProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeItems.map((item, index) => (
          <LongPressable
            key={item.id}
            onLongPress={() => handleLongPress(item)}
            className="glass-panel p-6 rounded-3xl relative overflow-hidden group cursor-pointer hover:border-accent-gold/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                item.status === 'available' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' :
                item.status === 'sold' ? 'bg-surface-hover border-surface-border text-text-tertiary' :
                'bg-accent-gold/10 border-accent-gold/20 text-accent-gold'
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
              <span className="text-sm font-medium text-text-secondary">Qty: {item.quantity}</span>
            </div>
            
            <h3 className="text-lg font-medium text-white mb-1">{item.name}</h3>
            <p className="text-sm text-text-tertiary mb-6">{item.category}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-border">
              <div>
                <p className="text-xs text-text-tertiary mb-1">Cost</p>
                <p className="font-medium text-white">₱{item.boughtPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Sell Price</p>
                <p className="font-medium text-accent-gold">₱{item.sellPrice.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-surface-border">
              <div className="flex justify-between items-center">
                <p className="text-xs text-text-tertiary">Est. Profit</p>
                <p className="font-medium text-emerald-400">₱{((item.sellPrice - item.boughtPrice) * item.quantity).toLocaleString()}</p>
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
        title="Store Item Options"
      />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedItem ? "Edit Item" : "Add Store Item"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Item Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-gold" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
              <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Quantity</label>
              <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-gold" min="1" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Cost (₱)</label>
              <input type="number" value={formData.boughtPrice} onChange={e => setFormData({...formData, boughtPrice: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-gold" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Sell Price (₱)</label>
              <input type="number" value={formData.sellPrice} onChange={e => setFormData({...formData, sellPrice: e.target.value})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-gold" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-surface border border-surface-border rounded-xl py-2 px-3 text-white focus:outline-none focus:border-accent-gold">
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 bg-accent-gold text-black rounded-xl font-medium hover:bg-yellow-500 transition-colors mt-4">
            {selectedItem ? 'Save Changes' : 'Save Item'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
