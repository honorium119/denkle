import React from 'react';
import { X, Printer, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useGroupStore } from '../hooks/useGroupStore';
import { calculateSettlements } from '../utils/settleDebts';
import { encodeGroupData } from '../utils/urlState';
import { translations } from '../utils/translations';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose }) => {
  const { getActiveGroup, lang } = useGroupStore();
  const currentGroup = getActiveGroup();
  const { name: groupName, currency, members, expenses } = currentGroup;
  const settlements = calculateSettlements(members, expenses);
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const averagePerPerson = members.length > 0 ? totalAmount / members.length : 0;
  const t = translations[lang];

  if (!isOpen) return null;

  const encodedData = encodeGroupData({
    groupName,
    currency,
    members,
    expenses,
  });
  const shareUrl = `${window.location.origin}${window.location.pathname}#data=${encodedData}`;

  const receiptId = `FS-${Math.abs(
    groupName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 17
  )
    .toString()
    .slice(0, 6)}`;

  const currentDate = new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200 overflow-y-auto">
      {/* Modal Kutusu */}
      <div className="relative w-full max-w-md my-8 flex flex-col items-center">
        
        {/* Yazdırılabilir Termal Fiş Kartı */}
        <div
          id="printable-receipt"
          className="w-full bg-white text-zinc-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-200 font-mono relative overflow-hidden"
        >
          {/* Üst Logo ve Başlık */}
          <div className="text-center pb-5 border-b border-dashed border-zinc-300">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mx-auto mb-2 font-sans font-black text-lg shadow-sm">
              ÷
            </div>
            <h2 className="font-sans font-black text-xl tracking-tight text-zinc-900 uppercase">FAIRSPLIT</h2>
            <p className="text-[11px] font-medium text-zinc-500 font-sans tracking-wide mt-0.5">{groupName}</p>

            <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-4 font-mono">
              <span>{t.receiptNo}: #{receiptId}</span>
              <span>{currentDate}</span>
            </div>
          </div>

          {/* Harcama Kalemleri Listesi */}
          <div className="py-4 border-b border-dashed border-zinc-300">
            <div className="text-[11px] font-bold text-zinc-400 font-sans tracking-wider mb-2.5 uppercase">
              {t.receiptItems} ({expenses.length})
            </div>

            {expenses.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">-- {t.noExpenses} --</p>
            ) : (
              <div className="space-y-2">
                {expenses.map((exp) => (
                  <div key={exp.id} className="flex justify-between items-baseline text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-bold text-zinc-800 truncate">{exp.description}</div>
                      <div className="text-[10px] text-zinc-500">
                        {exp.payer} • {exp.participants.length} {t.peopleSplit}
                      </div>
                    </div>
                    <div className="font-bold text-zinc-900 shrink-0">
                      {exp.amount.toFixed(2)} {currency}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Genel Toplam ve İstatistikler */}
          <div className="py-3.5 border-b border-dashed border-zinc-300 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>{t.receiptPerPerson}</span>
              <span>{averagePerPerson.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-sans font-extrabold text-zinc-950 pt-1">
              <span>{t.receiptTotal}</span>
              <span className="text-base font-mono">{totalAmount.toFixed(2)} {currency}</span>
            </div>
          </div>

          {/* Borç Kapatma / Transfer Özeti */}
          <div className="py-4 border-b border-dashed border-zinc-300">
            <div className="text-[11px] font-bold text-zinc-400 font-sans tracking-wider mb-2.5 uppercase">
              {t.receiptTransfers}
            </div>

            {settlements.length === 0 ? (
              <p className="text-xs text-emerald-600 font-sans font-semibold">✓ {t.allSettled}</p>
            ) : (
              <div className="space-y-2">
                {settlements.map((tx, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs p-2 rounded-lg bg-zinc-50 border border-zinc-100 font-sans"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-700 min-w-0">
                      <span className="font-bold text-zinc-900 truncate max-w-[80px]">{tx.from}</span>
                      <ArrowRight className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="font-bold text-zinc-900 truncate max-w-[80px]">{tx.to}</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-900 shrink-0 pl-2">
                      {tx.amount.toFixed(2)} {currency}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fiş Altı Doğrulama QR Kodu & Dipnot */}
          <div className="pt-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-white border border-zinc-200 rounded-xl shadow-2xs inline-block">
                <QRCodeSVG value={shareUrl} size={84} />
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans">{t.receiptWatermark}</p>
          </div>
        </div>

        {/* Ekranda Görünen Aksiyon Butonları (Yazdırırken Gizlenir) */}
        <div className="w-full flex gap-2.5 mt-4 no-print">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition cursor-pointer border border-zinc-700 backdrop-blur-md"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-teal-600/30"
          >
            <Printer className="w-4 h-4" /> {t.printBtn}
          </button>
        </div>

        {/* Kapat Çarpı Butonu */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 sm:-right-4 bg-zinc-900 text-zinc-400 hover:text-white p-2 rounded-full border border-zinc-700 transition cursor-pointer no-print shadow-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};