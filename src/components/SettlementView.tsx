import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, MessageCircle, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGroupStore } from '../hooks/useGroupStore';
import { calculateSettlements } from '../utils/settleDebts';
import { translations } from '../utils/translations';
import { ConfirmModal } from './ConfirmModal';
import { ReceiptModal } from './ReceiptModal';
import { Toast } from './Toast';

export const SettlementView: React.FC = () => {
  const { getActiveGroup, clearExpenses, lang } = useGroupStore();
  const { name: groupName, members, expenses, currency } = getActiveGroup();
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleCopyWhatsApp = () => {
    let text = `📊 *${groupName} — Hesap Özeti*\n`;
    text += `💰 *Toplam Masraf:* ${totalAmount.toFixed(2)} ${currency}\n\n`;

    if (settlements.length === 0) {
      text += `✅ *Hesaplar Tamamen Dengede!* Kimsenin kimseye borcu bulunmuyor.`;
    } else {
      text += `🔄 *Ödeme Transferleri:*\n`;
      settlements.forEach((s) => {
        text += `• *${s.from}* ➡️ *${s.to}*: ${s.amount.toFixed(2)} ${currency}\n`;
      });
    }

    text += `\n🔗 *FairSplit ile kolayca hesaplandı.*`;

    navigator.clipboard.writeText(text);
    setToastMessage(t.whatsappCopied);
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-xs border border-zinc-200/70 dark:border-zinc-800 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{t.settleDebts}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.settleSub}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block font-medium">{t.totalExpense}</span>
            <span className="text-sm sm:text-base font-extrabold text-teal-600 dark:text-emerald-400">
              {totalAmount.toFixed(2)} {currency}
            </span>
          </div>
        </div>

        {settlements.length === 0 ? (
          <div className="text-center py-6 sm:py-8 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">{t.allSettled}</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400/80 mt-1">{t.allSettledDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 min-w-0">
                  <span className="font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-2xs truncate max-w-[90px] sm:max-w-none">
                    {tx.from}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-2xs truncate max-w-[90px] sm:max-w-none">
                    {tx.to}
                  </span>
                </div>
                <div className="text-right pl-2 shrink-0">
                  <span className="text-xs sm:text-sm font-extrabold text-teal-600 dark:text-emerald-400">
                    {tx.amount.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            ))}

            {/* Dışa Aktarma Aksiyonları (WhatsApp & Fiş/PDF) */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleCopyWhatsApp}
                className="py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-emerald-200/60 dark:border-emerald-800/60"
              >
                <MessageCircle className="w-3.5 h-3.5" /> {t.whatsappShare}
              </button>

              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="py-2 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-zinc-200 dark:border-zinc-700"
              >
                <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" /> {t.exportPdf}
              </button>
            </div>

            <button
              onClick={() => setIsSettleModalOpen(true)}
              className="w-full mt-3 py-2.5 sm:py-3 bg-zinc-900 hover:bg-black dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-400 dark:text-zinc-950" /> {t.closeAndReset}
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

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
      )}
    </>
  );
};