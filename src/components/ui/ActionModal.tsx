import React from 'react';
import { Modal } from './Modal';
import { Edit2, Trash2 } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  title?: string;
}

export function ActionModal({ isOpen, onClose, onEdit, onDelete, title = "Options" }: ActionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-3">
        <button
          onClick={() => { onClose(); onEdit(); }}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-surface-hover hover:bg-surface-border transition-colors text-white"
        >
          <Edit2 size={18} className="text-accent-blue" />
          <span className="font-medium">Edit Item</span>
        </button>
        <button
          onClick={() => { onClose(); onDelete(); }}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-surface-hover hover:bg-rose-500/20 transition-colors text-white group"
        >
          <Trash2 size={18} className="text-rose-400 group-hover:text-rose-500" />
          <span className="font-medium text-rose-400 group-hover:text-rose-500">Delete Item</span>
        </button>
      </div>
    </Modal>
  );
}
