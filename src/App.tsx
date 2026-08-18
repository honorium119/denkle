import { useEffect, useState } from 'react';
import { Share2, RotateCcw, Zap } from 'lucide-react';
import { useGroupStore } from './hooks/useGroupStore';
import { MemberManager } from './components/MemberManager';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SettlementView } from './components/SettlementView';
import { ShareModal } from './components/ShareModal';

export default function App() {
  const { groupName, setGroupName, currency, setCurrency, checkUrlForData, resetGroup } = useGroupStore();
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    checkUrlForData();
  }, [checkUrlForData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          {/* Logo & Grup Adı */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="font-bold text-slate-800 text-sm sm:text-base focus:outline-none border-b border-transparent hover:border-slate-300 focus:border-indigo-500 transition w-full truncate"
              placeholder="Grup Adı"
            />
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-bold bg-slate-100 border-none rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2 text-slate-700 focus:ring-0 cursor-pointer"
            >
              <option value="₺">₺</option>
              <option value="$">$</option>
              <option value="€">€</option>
            </select>

            <button
              onClick={() => setIsShareOpen(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1 transition"
            >
              <Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Paylaş</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Tüm grubu sıfırlamak istediğinize emin misiniz?')) {
                  resetGroup();
                }
              }}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
              title="Grubu Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sol Kolon: Üye ve Masraf Yönetimi */}
          <div className="lg:col-span-7">
            <MemberManager />
            <ExpenseForm />
            <ExpenseList />
          </div>

          {/* Sağ Kolon: Borç Çözüm Vitrini */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <SettlementView />
            </div>
          </div>
        </div>
      </main>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
}