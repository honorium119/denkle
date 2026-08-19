import { useEffect, useState, useRef } from 'react';
import { Share2, RotateCcw, Moon, Sun, Globe, HelpCircle, Pencil, FolderKanban, ShieldCheck, Zap } from 'lucide-react';
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
import { Footer } from './components/Footer';
import { translations } from './utils/translations';
import { enablePersistentStorage } from './utils/storagePersistence';

// "The Dynamic Slice" — Modern Fintech Logosu
export const DynamicSliceLogo = ({ className = 'w-8 h-8 sm:w-9 sm:h-9' }: { className?: string }) => (
  <div className={`${className} rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-emerald-500/30 shadow-md shadow-emerald-500/10 shrink-0 relative overflow-hidden group`}>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" aria-hidden="true">
      <path d="M6 18L18 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="8.5" cy="7.5" r="2" fill="#34d399" />
      <circle cx="15.5" cy="16.5" r="2" fill="#10b981" />
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
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  useEffect(() => {
    enablePersistentStorage();
    checkUrlForData();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const hasSeenIntro = localStorage.getItem('denkle_has_seen_intro_v1');
    const isSharedUrl = typeof window !== 'undefined' && window.location.hash.includes('data=');
    if (!hasSeenIntro && !isSharedUrl) {
      setIsIntroOpen(true);
    }
  }, [checkUrlForData, theme]);

  const handleCloseIntro = () => {
    localStorage.setItem('denkle_has_seen_intro_v1', 'true');
    setIsIntroOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden relative transition-colors duration-300 flex flex-col justify-between">
      
      {/* Atmosferik Işık */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-0" />

      <div>
        {/* Üst Menü Çubuğu */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-40 transition-colors no-print">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-4">
            
            {/* Sol: Gruplar Çekmecesi + Dynamic Slice Logo + Genişletilmiş Grup Adı */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 max-w-[52%] sm:max-w-[62%]">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl transition cursor-pointer shrink-0"
                title={t.groupsTitle}
                aria-label={t.groupsTitle}
              >
                <FolderKanban className="w-4 h-4 text-teal-600 dark:text-emerald-400" />
              </button>

              <DynamicSliceLogo />

              {/* Ferah Grup Adı Kapsayıcısı */}
              <div className="flex items-center gap-1.5 min-w-[120px] flex-1 bg-zinc-100/80 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2.5 py-1.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 focus-within:border-teal-500 dark:focus-within:border-emerald-400 transition">
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={30}
                  aria-label={t.groupNamePlaceholder}
                  value={currentGroup?.name || ''}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm focus:outline-none bg-transparent tracking-tight w-full truncate cursor-text"
                  placeholder={t.groupNamePlaceholder}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.focus()}
                  aria-label="Grup Adını Düzenle"
                  className="text-zinc-400 hover:text-teal-600 dark:hover:text-emerald-400 transition cursor-pointer shrink-0"
                  title="Grup Adını Düzenle"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Sağ: Kompakt Aksiyon Butonları */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <label htmlFor="currency-select" className="sr-only">
                {lang === 'tr' ? 'Para Birimi Seçimi' : 'Currency Selection'}
              </label>
              <select
                id="currency-select"
                aria-label={lang === 'tr' ? 'Para Birimi' : 'Currency'}
                value={currentGroup?.currency || '₺'}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-[11px] sm:text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl px-2 py-1.5 text-zinc-700 dark:text-zinc-200 focus:ring-0 cursor-pointer transition"
              >
                <option value="₺">₺ TRY</option>
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
                <option value="£">£ GBP</option>
              </select>

              <button
                type="button"
                onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                aria-label={lang === 'tr' ? "Switch to English" : "Türkçe'ye Geç"}
                className="px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="uppercase">{lang}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsIntroOpen(true)}
                aria-label={t.helpBtn}
                className="p-1.5 sm:p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 rounded-xl transition cursor-pointer hidden md:flex items-center justify-center"
                title={t.helpBtn}
              >
                <HelpCircle className="w-4 h-4 text-teal-600 dark:text-emerald-400" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Karanlık Moda Geç' : 'Aydınlık Moda Geç'}
                className="p-1.5 sm:p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 rounded-xl transition cursor-pointer"
                title={theme === 'light' ? 'Karanlık Mod' : 'Aydınlık Mod'}
              >
                {theme === 'light' ? <Moon className="w-4 h-4 text-zinc-600" aria-hidden="true" /> : <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />}
              </button>

              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                aria-label={t.shareBtn}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-teal-600 dark:bg-emerald-500 text-white dark:text-zinc-950 hover:bg-teal-700 dark:hover:bg-emerald-400 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-sm shadow-emerald-500/20"
              >
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t.shareBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                aria-label={t.resetBtn}
                className="p-1.5 sm:p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                title={t.resetBtn}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Alanı */}
        <section className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 pb-4 text-center relative z-10 no-print">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-teal-700 dark:text-emerald-300 text-xs font-bold mb-3.5 backdrop-blur-md shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-2xl mx-auto leading-tight">
            {lang === 'tr' ? (
              <>
                Harcamaları adil bölün.{' '}
                <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  Borçları anında dengeleyin.
                </span>
              </>
            ) : (
              <>
                Split expenses fairly.{' '}
                <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  Settle debts instantly.
                </span>
              </>
            )}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300 font-medium">
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> {lang === 'tr' ? 'Minimum para transferi' : 'Minimum transfers'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" /> {lang === 'tr' ? 'Şifre & Üyelik yok' : 'No passwords or accounts'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5 text-teal-500" aria-hidden="true" /> {lang === 'tr' ? 'QR & Link ile anında paylaşım' : 'Instant QR & Link sharing'}
            </span>
          </div>
        </section>

        {/* Ana Gövde */}
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
      </div>

      {/* Footer */}
      <Footer
        onOpenIntro={() => setIsIntroOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
      />

      {/* Modallar */}
      <GroupDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <IntroModal isOpen={isIntroOpen} onClose={handleCloseIntro} />
      <ReceiptModal />
      
      <InstallPrompt
        isOpenModal={isInstallOpen}
        onCloseModal={() => setIsInstallOpen(false)}
      />

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