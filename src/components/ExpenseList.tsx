import React from 'react';
import { Trash2, History } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { translations } from '../utils/translations';

export const ExpenseList: React.FC = () => {
  const { expenses, currency, deleteExpense, lang } = useGroupStore();
  const t = translations[lang];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-100 dark:border-slate-800 mb-6 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
          {t.expenseHistory} ({expenses.length})
        </h2>
      </div>

      {expenses.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 italic">{t.noExpenses}</p>
      ) : (
        <div className="space-y-2.5">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
            >
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{expense.description}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{expense.payer}</span> {t.paid} •{' '}
                  {expense.participants.length} {t.peopleSplit} ({expense.participants.join(', ')})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {expense.amount.toFixed(2)} {currency}
                </span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition p-1 cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};