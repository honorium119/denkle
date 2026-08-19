import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, CheckCircle2 } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  isOpenModal = false,
  onCloseModal,
}) => {
  const { lang } = useGroupStore();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBottomBanner, setShowBottomBanner] = useState(false);

  useEffect(() => {
    // 1. Cihaz tespiti
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 2. Uygulama zaten yüklü mü kontrolü
    const isAppInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isAppInstalled);

    // 3. Android / Masaüstü Chrome yükleme yakalayıcısı
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Daha önce kapatılmadıysa alt banner'ı göster
      if (!localStorage.getItem('denkle_hide_install_banner')) {
        setShowBottomBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBottomBanner(false);
        onCloseModal?.();
      }
      setDeferredPrompt(null);
    }
  };

  const handleCloseBanner = () => {
    setShowBottomBanner(false);
    localStorage.setItem('denkle_hide_install_banner', 'true');
  };

  // Modal açık değilse ve alt banner da yoksa veya zaten yüklüyse render etme
  if (isStandalone && !isOpenModal) return null;

  return (
    <>
      {/* 1. Alt Kısım Otomatik Çıkan Kompakt Banner (Android / Chrome) */}
      {showBottomBanner && !isOpenModal && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom duration-300 no-print">
          <div className="bg-zinc-900/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-emerald-500/30 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">
                  {lang === 'tr' ? 'Denkle’yi Yükle' : 'Install Denkle'}
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  {lang === 'tr' ? 'Tek tıkla çevrimdışı kullan' : 'Offline & fast access'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs font-extrabold transition cursor-pointer"
              >
                {lang === 'tr' ? 'Yükle' : 'Install'}
              </button>
              <button
                onClick={handleCloseBanner}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Footer'dan veya Butondan Açılan Detaylı Kurulum Modalı */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 relative">
            <button
              onClick={onCloseModal}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
              {lang === 'tr' ? 'Denkle Uygulamasını Yükle' : 'Install Denkle App'}
            </h3>

            {isStandalone ? (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {lang === 'tr'
                    ? 'Denkle cihazınızda zaten tam ekran uygulama olarak yüklü!'
                    : 'Denkle is already installed as a standalone app on your device!'}
                </p>
              </div>
            ) : isIOS ? (
              /* iOS Safari İçin Resimli Adım Adım Rehber */
              <div className="space-y-3.5 my-4">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {lang === 'tr'
                    ? 'iOS Safari üzerinden Denkle’yi ana ekranınıza eklemek için aşağıdaki 2 adımı takip edin:'
                    : 'Follow these 2 steps in Safari to add Denkle to your home screen:'}
                </p>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/70 dark:border-zinc-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Share className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {lang === 'tr' ? '1. Safari’nin altındaki ' : '1. Tap the '}
                    <span className="font-bold text-blue-500">
                      {lang === 'tr' ? 'Paylaş (Share)' : 'Share'}
                    </span>
                    {lang === 'tr' ? ' butonuna dokunun.' : ' button at the bottom.'}
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/70 dark:border-zinc-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {lang === 'tr' ? '2. Menüyü kaydırıp ' : '2. Scroll down and select '}
                    <span className="font-bold text-emerald-500">
                      {lang === 'tr' ? 'Ana Ekrana Ekle' : 'Add to Home Screen'}
                    </span>
                    {lang === 'tr' ? ' seçeneğine basın.' : '.'}
                  </div>
                </div>
              </div>
            ) : deferredPrompt ? (
              /* Android / Desktop Chrome Doğrudan Yükleme Butonu */
              <div className="space-y-4 my-4">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {lang === 'tr'
                    ? 'Uygulamayı telefonunuza veya bilgisayarınıza yükleyerek çevrimdışı ve tam ekran hızında kullanabilirsiniz.'
                    : 'Install Denkle on your device for instant offline and fullscreen access.'}
                </p>

                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Şimdi Yükle' : 'Install Now'}</span>
                </button>
              </div>
            ) : (
              /* Manuel Tarayıcı Menüsü Rehberi */
              <div className="space-y-3 my-4">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {lang === 'tr'
                    ? 'Tarayıcınızın sağ üstündeki 3 noktaya (Menü) tıklayarak "Uygulamayı Yükle" veya "Ana Ekrana Ekle" seçeneğini seçebilirsiniz.'
                    : 'Click the 3 dots in your browser menu and select "Install app" or "Add to Home Screen".'}
                </p>
              </div>
            )}

            <button
              onClick={onCloseModal}
              className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-xs transition cursor-pointer mt-2"
            >
              {lang === 'tr' ? 'Kapat' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};