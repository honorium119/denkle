import { useEffect, useState } from 'react';
import { Share2, RotateCcw, Moon, Sun, Globe } from 'lucide-react';
import { useGroupStore } from './hooks/useGroupStore';
import { MemberManager } from './components/MemberManager';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SettlementView } from './components/SettlementView';
import { ShareModal } from './components/ShareModal';
import { ConfirmModal } from './components/ConfirmModal';
import { translations } from './utils/translations';

// Modern FairSplit Özel Logosu
const BrandLogo = () => (
  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 shrink-0">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M16 3h5v5" />
      <path d="M8 21H3v-5" />
      <path d="M21 3l-7.5 7.5" />
      <path d="M3 21l7.5-7.5" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  </div>
);

export default function App() {
  const {
    groupName,
    setGroupName,
    currency,
    setCurrency,
    theme,
    toggleTheme,
    lang,
    setLang,
    checkUrlForData,
    resetGroup,
  } = useGroupStore();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    checkUrlForData();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [checkUrlForData, theme]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 overflow-x-hidden transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Logo & Grup Adı */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <BrandLogo />
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base focus:outline-none border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 transition w-full truncate bg-transparent"
                placeholder={t.groupNamePlaceholder}
              />
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Para Birimi */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2 text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer transition"
            >
              <option value="₺">₺ TRY</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>

            {/* Dil Değiştirici (TR / EN) */}
            <button
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{lang}</span>
            </button>

            {/* Tema Butonu (Aydınlık / Karanlık) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
              title={theme === 'light' ? 'Karanlık Mod' : 'Aydınlık Mod'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Paylaş Butonu */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t.shareBtn}</span>
            </button>

            {/* Sıfırla Butonu */}
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
              title={t.resetBtn}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sol Kolon */}
          <div className="lg:col-span-7">
            <MemberManager />
            <ExpenseForm />
            <ExpenseList />
          </div>

          {/* Sağ Kolon */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <SettlementView />
            </div>
          </div>
        </div>
      </main>

      {/* Modallar */}
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

      <ConfirmModal
        isOpen={isResetModalOpen}
        variant="danger"
        title={t.confirmResetTitle}
        message={t.confirmResetMsg}
        confirmText={t.yesReset}
        cancelText={t.cancel}
        onConfirm={resetGroup}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}