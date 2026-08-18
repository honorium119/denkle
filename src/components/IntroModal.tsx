import React from 'react';
import { X, Users, ArrowRightLeft, QrCode } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { translations } from '../utils/translations';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useGroupStore();
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-zinc-200/80 dark:border-zinc-800 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Üst Bölme Logosu */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 dark:bg-emerald-500 flex items-center justify-center text-white dark:text-zinc-950 mx-auto mb-3 shadow-md shadow-teal-600/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <circle cx="12" cy="6" r="1.8" fill="currentColor" />
              <line x1="5" y1="12" x2="19" y2="12" />
              <circle cx="12" cy="18" r="1.8" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">{t.introTitle}</h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t.introSubtitle}</p>
        </div>

        {/* 3 Adım */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3.5 items-start p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-emerald-950/60 text-teal-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">{t.introStep1Title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{t.introStep1Desc}</p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-emerald-950/60 text-teal-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">{t.introStep2Title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{t.introStep2Desc}</p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-emerald-950/60 text-teal-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">{t.introStep3Title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{t.introStep3Desc}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold rounded-xl text-sm transition shadow-sm cursor-pointer"
        >
          {t.introStartBtn}
        </button>
      </div>
    </div>
  );
};