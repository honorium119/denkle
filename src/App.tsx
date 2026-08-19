import { useEffect, useState, useRef } from 'react';
import { Share2, RotateCcw, Moon, Sun, Globe, HelpCircle, Pencil, FolderKanban, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useGroupStore } from './hooks/useGroupStore';
import { MemberManager } from './components/MemberManager';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SettlementView } from './components/SettlementView';
import { ShareModal } from './components/ShareModal';
import { ConfirmModal } from './components/ConfirmModal';
import { IntroModal } from './components/IntroModal';
import { GroupDrawer } from './components/GroupDrawer';
import { ReceiptModal } from './components/ReceiptModal';
import { InstallPrompt } from './components/InstallPrompt';
import { translations } from './utils/translations';

const DivisionBrandLogo = () => (
  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-600 dark:bg-emerald-500 flex items-center justify-center text-white dark:text-zinc-950 shadow-md shadow-emerald-500/20 shrink-0">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
      <circle cx="12" cy="6" r="1.8" fill="currentColor" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <circle cx="12" cy="18" r="1.8" fill="currentColor" />
    </svg>
  </div>
);

export default function App() {
  const {
    getActiveGroup,
    setGroupName,
    setCurrency,
    theme,
    toggleTheme,
    lang,
    setLang,
    checkUrlForData,
    resetGroup,
  } = useGroupStore();

  const currentGroup = getActiveGroup();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 overflow-x-hidden relative transition-colors duration-300">
      
      {/* Atmosferik Işık & Arka Plan Parıltısı (Ambient Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* Üst Menü Çubuğu */}
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-40 transition-colors no-print">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          
          {/* Sol: Gruplar Çekmecesi + Logo + Grup Adı */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl transition cursor-pointer shrink-0"
              title={t.groupsTitle}
            >
              <FolderKanban className="w-4 h-4 text-teal-600 dark:text-emerald-400" />
            </button>

            <DivisionBrandLogo />

            <div className="flex items-center gap-1 min-w-0 max-w-[120px] sm:max-w-[240px]">
              <input
                ref={inputRef}
                type="text"
                maxLength={30}
                value={currentGroup.name}
                onChange={(e) => setGroupName(e.target.value)}
                className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-base focus:outline-none border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-teal-600 dark:focus:border-emerald-400 transition truncate bg-transparent tracking-tight w-full cursor-text"
                placeholder={t.groupNamePlaceholder}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.focus()}
                className="p-1 text-zinc-400 hover:text-teal-600 dark:text-zinc-500 dark:hover:text-emerald-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer shrink-0"
                title="Grup Adını Düzenle"
              >
                <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>

          {/* Sağ: Kompakt Aksiyon Butonları */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <select
              value={currentGroup.currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-[11px] sm:text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-2 py-1.5 text-zinc-700 dark:text-zinc-200 focus:ring-0 cursor-pointer transition"
            >
              <option value="₺">₺ TRY</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>

            <button
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              className="px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{lang}</span>
            </button>

            <button
              onClick={() => setIsIntroOpen(true)}
              className="p-1.5 sm:p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 rounded-xl transition cursor-pointer"
              title={t.helpBtn}
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 dark:text-emerald-400" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 rounded-xl transition cursor-pointer"
              title={theme === 'light' ? 'Karanlık Mod' : 'Aydınlık Mod'}
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-teal-600 dark:bg-emerald-500 text-white dark:text-zinc-950 hover:bg-teal-700 dark:hover:bg-emerald-400 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t.shareBtn}</span>
            </button>

            <button
              onClick={() => setIsResetModalOpen(true)}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              title={t.resetBtn}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Yeni Dikkat Çekici Hero Alanı (Header Banner) */}
      <section className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 pb-4 text-center relative z-10 no-print">
        {/* Üst Hap Rozeti */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-teal-700 dark:text-emerald-300 text-xs font-semibold mb-3.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>{lang === 'tr' ? 'Ücretsiz, hızlı ve sunucusuz masraf bölüştürücü' : 'Free, instant and serverless expense splitter'}</span>
        </div>

        {/* Büyük Başlık */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-2xl mx-auto leading-tight">
          {lang === 'tr' ? (
            <>
              Harcamaları adil bölün.{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text text-transparent">
                Borçları anında dengeleyin.
              </span>
            </>
          ) : (
            <>
              Split expenses fairly.{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text text-transparent">
                Settle debts instantly.
              </span>
            </>
          )}
        </h1>

        {/* Alt Değer Rozetleri */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span className="inline-flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> {lang === 'tr' ? 'Minimum para transferi' : 'Minimum transfers'}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {lang === 'tr' ? '%100 Gizli & Tarayıcıda saklanır' : '100% Private in-browser'}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-teal-500" /> {lang === 'tr' ? 'QR & Link ile üyeliksiz paylaşım' : 'Zero sign-up QR sharing'}
          </span>
        </div>
      </section>

      {/* Ana Gövde (Elevated Cards Grid) */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 relative z-10 no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-7 space-y-4">
            <MemberManager />
            <ExpenseForm />
            <ExpenseList />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-20">
              <SettlementView />
            </div>
          </div>
        </div>
      </main>

      {/* Modallar & Çekmeceler */}
      <GroupDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <IntroModal isOpen={isIntroOpen} onClose={handleCloseIntro} />
      <ReceiptModal />
      <InstallPrompt />

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