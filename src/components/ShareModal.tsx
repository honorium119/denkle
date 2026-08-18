import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { encodeGroupData } from '../utils/urlState';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { groupName, currency, members, expenses } = useGroupStore();
  const [copied, setCopied] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 text-center relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Share2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">Grubu Paylaş</h3>
        <p className="text-xs text-slate-500 mb-6">
          Hesap açmaya gerek yok. Arkadaşlarınız bu QR kodu okutarak veya linke tıklayarak mevcut durumu görebilir.
        </p>

        <div className="flex justify-center p-4 bg-slate-50 rounded-2xl mb-5 border border-slate-100 inline-block mx-auto">
          <QRCodeSVG value={shareUrl} size={180} />
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition shadow-sm shadow-indigo-200"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Bağlantı Kopyalandı!' : 'Paylaşım Bağlantısını Kopyala'}
        </button>
      </div>
    </div>
  );
};