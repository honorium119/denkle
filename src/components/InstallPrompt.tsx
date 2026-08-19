import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { translations } from '../utils/translations';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const { lang } = useGroupStore();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    // Uygulama zaten standalone (ana ekrandan) açıldıysa gösterme
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    // Kullanıcı daha önce kapatmadıysa göster
    const dismissed = localStorage.getItem('fairsplit-install-dismissed');
    if (dismissed) return;

    // iOS Safari Tespiti
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      setShowPrompt(true);
    }

    // Android & Chromium Tarayıcı Olayı
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('fairsplit-install-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 no-print">
      <div className="bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl p-4 shadow-2xl border border-zinc-700/80 relative">
        <button
          onClick={handleDismiss}
          className="absolute right-2.5 top-2.5 p-1 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 dark:bg-emerald-500 flex items-center justify-center text-white dark:text-zinc-950 shrink-0 mt-0.5 shadow-sm">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight">{t.installTitle}</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{t.installDesc}</p>
          </div>
        </div>

        {showIOSGuide ? (
          <div className="mt-3 p-2.5 bg-zinc-800 dark:bg-zinc-700/60 rounded-xl text-[11px] text-teal-300 flex items-center gap-2">
            <Share className="w-4 h-4 shrink-0 text-white" />
            <span>{t.iosShareGuide}</span>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="w-full mt-3 py-2 bg-teal-600 hover:bg-teal-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 text-xs font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> {t.installBtn}
          </button>
        )}
      </div>
    </div>
  );
};