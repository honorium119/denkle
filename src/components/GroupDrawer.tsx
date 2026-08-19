import React, { useState } from 'react';
import { X, Plus, FolderKanban, Trash2, Check } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { translations } from '../utils/translations';
import { ConfirmModal } from './ConfirmModal';

interface GroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupDrawer: React.FC<GroupDrawerProps> = ({ isOpen, onClose }) => {
  const { groups, activeGroupId, selectGroup, createGroup, deleteGroup, lang } = useGroupStore();
  const [newGroupName, setNewGroupName] = useState('');
  const [groupToDeleteId, setGroupToDeleteId] = useState<string | null>(null);
  const t = translations[lang];

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      createGroup(newGroupName.trim());
      setNewGroupName('');
      onClose();
    }
  };

  const handleConfirmDelete = () => {
    if (groupToDeleteId) {
      deleteGroup(groupToDeleteId);
      setGroupToDeleteId(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
        {/* Karartma Arka Planı */}
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs" onClick={onClose} />

        {/* Sol Panel */}
        <div className="relative w-full max-w-xs bg-white dark:bg-zinc-900 h-full p-5 shadow-2xl border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between z-10 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-5">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-teal-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">{t.groupsTitle}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Yeni Grup Ekleme Formu */}
            <form onSubmit={handleCreate} className="flex gap-2 mb-6">
              <input
                type="text"
                maxLength={25}
                placeholder={t.newGroupNamePlaceholder}
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-teal-600 dark:focus:border-emerald-400 transition"
              />
              <button
                type="submit"
                disabled={!newGroupName.trim()}
                className="p-2 bg-teal-600 hover:bg-teal-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 disabled:opacity-40 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Gruplar Listesi */}
            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {groups.map((group) => {
                const isActive = group.id === activeGroupId;
                const totalAmount = group.expenses.reduce((acc, c) => acc + c.amount, 0);

                return (
                  <div
                    key={group.id}
                    onClick={() => {
                      selectGroup(group.id);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                      isActive
                        ? 'bg-teal-50/80 dark:bg-emerald-950/40 border-teal-200 dark:border-emerald-800'
                        : 'bg-zinc-50/60 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{group.name}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                        {group.members.length} üye • {totalAmount.toFixed(2)} {group.currency}
                      </span>
                    </div>

                    {groups.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupToDeleteId(group.id);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                        title="Grubu Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Şık Uygulama İçi Silme Onay Modalı */}
      <ConfirmModal
        isOpen={groupToDeleteId !== null}
        variant="danger"
        title={t.deleteGroupTitle}
        message={t.deleteGroupConfirm}
        confirmText={t.yesDelete}
        cancelText={t.cancel}
        onConfirm={handleConfirmDelete}
        onClose={() => setGroupToDeleteId(null)}
      />
    </>
  );
};