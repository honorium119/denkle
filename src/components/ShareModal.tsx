import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { encodeGroupData } from '../utils/urlState';
import { translations } from '../utils/translations';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { getActiveGroup, lang } = useGroupStore();
  const { name: groupName, currency, members, expenses } = getActiveGroup();
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  if (!isOpen) return null;

  const encodedData = encodeGroupData({
    groupName,
    currency,
    members,
    expenses,
  });

  const shareUrl = `${window.location.origin}${window.location.pathname}#data=${encodedData}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-zinc-200/80 dark:border-zinc-800 text-center relative transition-colors">
        <button
          type="button"
          onClick={onClose}
          aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="w-12 h-12 bg-teal-50 dark:bg-emerald-950/50 text-teal-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Share2 className="w-6 h-6" aria-hidden="true" />
        </div>

        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">{t.shareTitle}</h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">{t.shareDesc}</p>

        <div className="flex justify-center p-4 bg-white rounded-2xl mb-5 border border-zinc-200/80 dark:border-zinc-800 shadow-xs inline-block mx-auto">
          <QRCodeSVG value={shareUrl} size={170} />
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? t.copied : t.copyLink}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-white dark:text-zinc-950" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
          <span>{copied ? t.copied : t.copyLink}</span>
        </button>
      </div>
    </div>
  );
};