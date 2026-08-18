import React from 'react';
import { Trash2, History } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';

export const ExpenseList: React.FC = () => {
  const { expenses, currency, deleteExpense } = useGroupStore();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-800">Harcama Geçmişi ({expenses.length})</h2>
      </div>

      {expenses.length === 0 ? (
        <p className="text-xs text-slate-400 italic">Henüz kaydedilmiş bir harcama bulunmuyor.</p>
      ) : (
        <div className="space-y-2.5">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
            >
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{expense.description}</h4>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-indigo-600">{expense.payer}</span> ödedi •{' '}
                  {expense.participants.length} kişi paylaştı ({expense.participants.join(', ')})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900">
                  {expense.amount.toFixed(2)} {currency}
                </span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-slate-400 hover:text-red-600 transition p-1"
                  title="Harcamayı Sil"
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