import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGroupStore } from '../hooks/useGroupStore';
import { calculateSettlements } from '../utils/settleDebts';

export const SettlementView: React.FC = () => {
  const { members, expenses, currency } = useGroupStore();
  const settlements = calculateSettlements(members, expenses);
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Borç Dengeleme</h2>
          <p className="text-xs text-slate-500">Minimum transfer sayısı ile hesap kapatma</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-medium">Toplam Masraf</span>
          <span className="text-base font-bold text-indigo-600">
            {totalAmount.toFixed(2)} {currency}
          </span>
        </div>
      </div>

      {settlements.length === 0 ? (
        <div className="text-center py-8 bg-emerald-50/50 rounded-2xl border border-emerald-100">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-emerald-800">Hesaplar Tamamen Dengede!</h3>
          <p className="text-xs text-emerald-600 mt-1">Kimsenin kimseye borcu kalmadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((tx, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50/40 via-white to-purple-50/40 border border-slate-200/60"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  {tx.from}
                </span>
                <ArrowRight className="w-4 h-4 text-indigo-500" />
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  {tx.to}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-indigo-600">
                  {tx.amount.toFixed(2)} {currency}
                </span>
              </div>
            </div>
          ))}

          <button
            onClick={triggerCelebration}
            className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Hesapları Kapat ve Kutla
          </button>
        </div>
      )}
    </div>
  );
};