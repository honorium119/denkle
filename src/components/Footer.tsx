import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Sparkles, FolderKanban, FileText, MessageCircle, Smartphone, Lock, X } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { generateWhatsAppSummary } from '../utils/whatsappSummary';
import { translations } from '../utils/translations';
import { DynamicSliceLogo } from '../App';
import { Toast } from './Toast';

interface FooterProps {
  onOpenIntro: () => void;
  onOpenInstall?: () => void;
}

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onOpenIntro, onOpenInstall }) => {
  const { lang, setIsReceiptOpen, getActiveGroup } = useGroupStore();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const t = translations[lang];
  const currentGroup = getActiveGroup();

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppSummary(currentGroup, lang);
    navigator.clipboard.writeText(text);
    setToastMsg(t.whatsappCopied);
  };

  return (
    <>
      <footer className="w-full bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800/80 mt-20 pt-12 pb-8 transition-colors no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-zinc-200/70 dark:border-zinc-800/70">
            
            {/* Sol Kolon */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <DynamicSliceLogo className="w-8 h-8" />
                <span className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Denkle
                </span>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                {t.footerDesc}
              </p>

              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 border border-zinc-200/60 dark:border-zinc-700/60 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.footerSecurityNote}</span>
              </button>
            </div>

            {/* Özellik Kısayolları */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                {t.footerColFeatures}
              </h4>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <li>
                  <button
                    onClick={onOpenIntro}
                    className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-emerald-400 transition cursor-pointer text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t.footerF1}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const btn = document.querySelector('header button[title="' + t.groupsTitle + '"]') as HTMLButtonElement;
                      btn?.click();
                    }}
                    className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-emerald-400 transition cursor-pointer text-left"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span>{t.footerF2}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsReceiptOpen(true)}
                    className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-emerald-400 transition cursor-pointer text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span>{t.footerF3}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleCopyWhatsApp}
                    className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-emerald-400 transition cursor-pointer text-left"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t.footerF4}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenInstall?.()}
                    className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-emerald-400 transition cursor-pointer text-left"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{t.footerF5}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Gizlilik & GitHub Linki */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                {t.footerColPrivacy}
              </h4>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <li>
                  <button
                    onClick={() => setIsPrivacyOpen(true)}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{t.footerP1}</span>
                  </button>
                </li>
                <li className="text-zinc-400 dark:text-zinc-500 text-[11px] leading-relaxed">
                  {lang === 'tr'
                    ? 'Verileriniz herhangi bir sunucuya gitmez; paylaşımlar URL sıkıştırmasıyla uçtan uca gerçekleşir.'
                    : 'Your data is never sent to a database; groups are shared peer-to-peer via compressed URLs.'}
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/honorium119/denkle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <GithubIcon />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>

                <button
                  onClick={onOpenIntro}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{t.footerPr2}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400 dark:text-zinc-500">
            <div>{t.footerCopyright}</div>
            <div className="text-center sm:text-right">{t.footerDisclaimer}</div>
          </div>
        </div>
      </footer>

      {/* Gizlilik Modalı */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-zinc-200/80 dark:border-zinc-800 relative">
            <button
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
              {lang === 'tr' ? '%100 Yerel ve Gizli Mimari' : '100% On-Device & Private'}
            </h3>
            
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2 mb-4">
              {lang === 'tr'
                ? 'Denkle, gizliliğinizi korumak için merkezi bir veritabanı veya üyelik sistemi kullanmaz. Harcamalarınız yalnızca tarayıcınızın yerel hafızasında (localStorage) saklanır. Grubu paylaştığınızda veriler LZ-string algoritması ile sıkıştırılarak doğrudan bağlantı adresine (URL Hash) gömülür.'
                : 'Denkle does not use centralized databases or tracking cookies. All your group expenses remain stored locally in your browser (localStorage) and are shared directly via compressed URL hashes.'}
            </p>

            <button
              onClick={() => setIsPrivacyOpen(false)}
              className="w-full py-2.5 bg-zinc-900 hover:bg-black dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              {lang === 'tr' ? 'Anladım' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      {toastMsg && (
        <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />
      )}
    </>
  );
};