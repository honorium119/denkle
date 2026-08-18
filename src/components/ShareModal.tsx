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
  const { groupName, currency, members, expenses, lang } = useGroupStore();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative transition-colors">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Share2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t.shareTitle}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{t.shareDesc}</p>

        <div className="flex justify-center p-4 bg-white rounded-2xl mb-5 border border-slate-100 dark:border-slate-800 shadow-xs inline-block mx-auto">
          <QRCodeSVG value={shareUrl} size={170} />
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          {copied ? t.copied : t.copyLink}
        </button>
      </div>
    </div>
  );
};