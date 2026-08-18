import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGroupStore } from '../hooks/useGroupStore';
import { calculateSettlements } from '../utils/settleDebts';
import { translations } from '../utils/translations';
import { ConfirmModal } from './ConfirmModal';

export const SettlementView: React.FC = () => {
  const { members, expenses, currency, clearExpenses, lang } = useGroupStore();
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const settlements = calculateSettlements(members, expenses);
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const t = translations[lang];

  const handleSettleConfirm = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    clearExpenses();
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">{t.settleDebts}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.settleSub}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">{t.totalExpense}</span>
            <span className="text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-400">
              {totalAmount.toFixed(2)} {currency}
            </span>
          </div>
        </div>

        {settlements.length === 0 ? (
          <div className="text-center py-6 sm:py-8 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{t.allSettled}</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{t.allSettledDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-indigo-50/40 via-white to-purple-50/40 dark:from-indigo-950/20 dark:via-slate-800/40 dark:to-purple-950/20 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs truncate max-w-[90px] sm:max-w-none">
                    {tx.from}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs truncate max-w-[90px] sm:max-w-none">
                    {tx.to}
                  </span>
                </div>
                <div className="text-right pl-2 shrink-0">
                  <span className="text-xs sm:text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                    {tx.amount.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={() => setIsSettleModalOpen(true)}
              className="w-full mt-4 py-2.5 sm:py-3 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" /> {t.closeAndReset}
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isSettleModalOpen}
        variant="success"
        title={t.confirmSettleTitle}
        message={t.confirmSettleMsg}
        confirmText={t.yesClose}
        cancelText={t.cancel}
        onConfirm={handleSettleConfirm}
        onClose={() => setIsSettleModalOpen(false)}
      />
    </>
  );
};