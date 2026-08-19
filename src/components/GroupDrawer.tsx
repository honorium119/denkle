import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Check, Download, Upload } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { translations } from '../utils/translations';
import { ConfirmModal } from './ConfirmModal';
import { Toast } from './Toast';

interface GroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupDrawer: React.FC<GroupDrawerProps> = ({ isOpen, onClose }) => {
  const {
    groups,
    activeGroupId,
    setActiveGroupId,
    createGroup,
    deleteGroup,
    lang,
  } = useGroupStore();

  const [newGroupName, setNewGroupName] = useState('');
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    createGroup(newGroupName.trim());
    setNewGroupName('');
  };

  const handleExportBackup = () => {
    const backupData = {
      version: 1,
      exportDate: new Date().toISOString(),
      groups: groups,
      activeGroupId: activeGroupId,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `denkle-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToastMsg(lang === 'tr' ? 'Yedek dosyası indirildi!' : 'Backup file downloaded!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.groups && Array.isArray(parsed.groups)) {
          localStorage.setItem(
            'denkle-multi-groups-v2',
            JSON.stringify({
              state: {
                groups: parsed.groups,
                activeGroupId: parsed.activeGroupId || parsed.groups[0].id,
                theme: 'dark',
                lang: lang,
              },
              version: 0,
            })
          );
          setToastMsg(lang === 'tr' ? 'Yedek başarıyla yüklendi! Sayfa yenileniyor...' : 'Backup restored! Reloading...');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          throw new Error('Geçersiz dosya yapısı');
        }
      } catch {
        setToastMsg(lang === 'tr' ? 'Hata: Geçersiz yedek dosyası!' : 'Error: Invalid backup file!');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-zinc-900 h-full shadow-2xl z-10 flex flex-col justify-between border-r border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-left duration-200">
          
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {t.groupsTitle}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 flex gap-1.5">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder={t.newGroupNamePlaceholder}
                maxLength={30}
                className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-teal-500 text-zinc-900 dark:text-zinc-100"
              />
              <button
                type="submit"
                disabled={!newGroupName.trim()}
                className="p-2 bg-teal-600 hover:bg-teal-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 rounded-xl transition disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {groups.map((g) => {
                const isActive = g.id === activeGroupId;
                const total = g.expenses.reduce((acc, c) => acc + c.amount, 0);

                return (
                  <div
                    key={g.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-teal-50/70 dark:bg-emerald-950/30 border-teal-500/40 dark:border-emerald-500/40'
                        : 'bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveGroupId(g.id);
                        onClose();
                      }}
                      className="flex-1 text-left min-w-0 pr-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {g.name}
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
                        {g.members.length} {lang === 'tr' ? 'üye' : 'members'} • {total.toFixed(2)} {g.currency}
                      </div>
                    </button>

                    {groups.length > 1 && (
                      <button
                        onClick={() => setDeletingGroupId(g.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer shrink-0"
                        title={t.yesDelete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              {lang === 'tr' ? 'Veri Güvenliği' : 'Data Safety'}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="py-2 px-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Tüm grupları JSON dosyası olarak indir"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === 'tr' ? 'Yedek İndir' : 'Backup'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Önceden indirilmiş yedek dosyasını yükle"
              >
                <Upload className="w-3.5 h-3.5 text-teal-500" />
                <span>{lang === 'tr' ? 'Yedek Yükle' : 'Restore'}</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportBackup}
              accept=".json"
              className="hidden"
            />
          </div>

        </div>
      </div>

      <ConfirmModal
        isOpen={!!deletingGroupId}
        variant="danger"
        title={t.deleteGroupTitle}
        message={t.deleteGroupConfirm}
        confirmText={t.yesDelete}
        cancelText={t.cancel}
        onConfirm={() => {
          if (deletingGroupId) {
            deleteGroup(deletingGroupId);
            setDeletingGroupId(null);
          }
        }}
        onClose={() => setDeletingGroupId(null)}
      />

      {toastMsg && (
        <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />
      )}
    </>
  );
};