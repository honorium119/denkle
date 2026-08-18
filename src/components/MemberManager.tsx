import React, { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { translations } from '../utils/translations';

export const MemberManager: React.FC = () => {
  const { members, addMember, removeMember, lang } = useGroupStore();
  const [name, setName] = useState('');
  const t = translations[lang];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addMember(name.trim());
      setName('');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-xs border border-zinc-200/70 dark:border-zinc-800 mb-6 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-teal-600 dark:text-emerald-400" />
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {t.groupMembers} <span className="text-zinc-400 text-sm font-normal">({members.length})</span>
        </h2>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={t.addMemberPlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-emerald-500/20 focus:border-teal-600 dark:focus:border-emerald-400 transition"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 disabled:opacity-40 rounded-xl text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> {t.add}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <span
            key={member}
            className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition border border-zinc-200/50 dark:border-zinc-700/50"
          >
            {member}
            <button
              onClick={() => removeMember(member)}
              className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {members.length === 0 && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">{t.noMembers}</p>
        )}
      </div>
    </div>
  );
};