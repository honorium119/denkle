import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success';
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'Vazgeç',
  variant = 'danger',
  onConfirm,
  onClose,
}) => {
  const { lang } = useGroupStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-zinc-200/80 dark:border-zinc-800 text-center relative transition-colors">
        <button
          type="button"
          onClick={onClose}
          aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
            variant === 'danger'
              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
              : 'bg-teal-50 dark:bg-emerald-950/40 text-teal-600 dark:text-emerald-400'
          }`}
        >
          {variant === 'danger' ? (
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          )}
        </div>

        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5 tracking-tight">{title}</h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            aria-label={cancelText}
            className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            aria-label={confirmText}
            className={`flex-1 py-2.5 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 shadow-sm'
                : 'bg-teal-600 hover:bg-teal-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-zinc-950 shadow-sm'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};