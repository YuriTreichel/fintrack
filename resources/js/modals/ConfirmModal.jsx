import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-zinc-200/50 dark:bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-fin-surface w-full max-w-sm rounded-[24px] shadow-2xl border border-zinc-900/10 dark:border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-300 ease-out">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#ff7b7b]/10 text-[#ff7b7b] rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
            {message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-zinc-600 bg-zinc-900/10 dark:text-zinc-400 dark:bg-white/5 hover:bg-zinc-900/20 dark:hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-fin-bg bg-[#ff7b7b] hover:bg-[#ff5252] shadow-lg shadow-[#ff7b7b]/20 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}