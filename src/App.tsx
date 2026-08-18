import { useEffect, useState } from 'react';
import { Share2, RotateCcw, Moon, Sun, Globe, HelpCircle } from 'lucide-react';
import { useGroupStore } from './hooks/useGroupStore';
import { MemberManager } from './components/MemberManager';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SettlementView } from './components/SettlementView';
import { ShareModal } from './components/ShareModal';
import { ConfirmModal } from './components/ConfirmModal';
import { IntroModal } from './components/IntroModal';
import { translations } from './utils/translations';

// Sade & Anlamlı Bölme (÷) Sembolü Logosu
const DivisionBrandLogo = () => (
  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-600 dark:bg-emerald-500 flex items-center justify-center text-white dark:text-zinc-950 shadow-sm shadow-teal-600/20 shrink-0">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
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
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    checkUrlForData();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const hasSeenIntro = localStorage.getItem('fairsplit-seen-intro-v1');
    if (!hasSeenIntro) {
      setIsIntroOpen(true);
    }
  }, [checkUrlForData, theme]);

  const handleCloseIntro = () => {
    localStorage.setItem('fairsplit-seen-intro-v1', 'true');
    setIsIntroOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-16 overflow-x-hidden transition-colors duration-200">
      {/* Üst Menü Çubuğu */}
      <header className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-40 transition-colors">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Logo & Grup Adı */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <DivisionBrandLogo />
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base focus:outline-none border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-teal-600 dark:focus:border-emerald-400 transition w-full truncate bg-transparent tracking-tight"
                placeholder={t.groupNamePlaceholder}
              />
            </div>
          </div>

          {/* Sağ Aksiyon Butonları */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Para Birimi */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2 text-zinc-700 dark:text-zinc-200 focus:ring-0 cursor-pointer transition"
            >
              <option value="₺">₺ TRY</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>

            {/* Dil Değiştirici */}
            <button
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              className="px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{lang}</span>
            </button>

            {/* Tanıtım / Yardım Butonu */}
            <button
              onClick={() => setIsIntroOpen(true)}
              className="p-1.5 sm:p-2 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 rounded-xl transition cursor-pointer"
              title={t.helpBtn}
            >
              <HelpCircle className="w-4 h-4 text-teal-600 dark:text-emerald-400" />
            </button>

            {/* Tema Butonu */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 rounded-xl transition cursor-pointer"
              title={theme === 'light' ? 'Karanlık Mod' : 'Aydınlık Mod'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-zinc-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Paylaş Butonu */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-teal-600 dark:bg-emerald-500 text-white dark:text-zinc-950 hover:bg-teal-700 dark:hover:bg-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t.shareBtn}</span>
            </button>

            {/* Sıfırla Butonu */}
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              title={t.resetBtn}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Ana Gövde */}
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
      <IntroModal isOpen={isIntroOpen} onClose={handleCloseIntro} />

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