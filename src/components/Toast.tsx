import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'info' | 'error' | 'success';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold backdrop-blur-md transition-all ${
          type === 'error'
            ? 'bg-red-900/90 text-white border-red-700/60'
            : type === 'success'
            ? 'bg-emerald-900/90 text-white border-emerald-700/60'
            : 'bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 border-zinc-800'
        }`}
      >
        {type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};