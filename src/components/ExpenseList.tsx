import React from 'react';
import { Trash2, History, Pencil } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { translations } from '../utils/translations';

export const ExpenseList: React.FC = () => {
  const { getActiveGroup, deleteExpense, setEditingExpenseId, editingExpenseId, lang } = useGroupStore();
  const { expenses, currency } = getActiveGroup();
  const t = translations[lang];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-xs border border-zinc-200/70 dark:border-zinc-800 mb-6 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-teal-600 dark:text-emerald-400" aria-hidden="true" />
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {t.expenseHistory} <span className="text-zinc-500 dark:text-zinc-400 text-sm font-normal">({expenses.length})</span>
        </h2>
      </div>

      {expenses.length === 0 ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">{t.noExpenses}</p>
      ) : (
        <div className="space-y-2.5">
          {expenses.map((expense) => {
            const isBeingEdited = editingExpenseId === expense.id;

            return (
              <div
                key={expense.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  isBeingEdited
                    ? 'border-teal-500/50 bg-teal-50/40 dark:bg-emerald-950/20'
                    : 'border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{expense.description}</div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5 truncate">
                    <span className="font-semibold text-teal-700 dark:text-emerald-400">{expense.payer}</span> {t.paid} •{' '}
                    {expense.participants.length} {t.peopleSplit} ({expense.participants.join(', ')})
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                    {expense.amount.toFixed(2)} {currency}
                  </span>
                  
                  {/* Düzenle Butonu */}
                  <button
                    type="button"
                    onClick={() => setEditingExpenseId(expense.id)}
                    aria-label={`${expense.description} ${lang === 'tr' ? 'harcamasını düzenle' : 'edit expense'}`}
                    className="text-zinc-400 hover:text-teal-600 dark:hover:text-emerald-400 transition p-1 cursor-pointer"
                    title="Düzenle"
                  >
                    <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  </button>

                  {/* Sil Butonu */}
                  <button
                    type="button"
                    onClick={() => deleteExpense(expense.id)}
                    aria-label={`${expense.description} ${lang === 'tr' ? 'harcamasını sil' : 'delete expense'}`}
                    className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition p-1 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};