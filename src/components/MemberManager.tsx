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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-100 dark:border-slate-800 mb-6 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
          {t.groupMembers} ({members.length})
        </h2>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={t.addMemberPlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {t.add}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <span
            key={member}
            className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition"
          >
            {member}
            <button
              onClick={() => removeMember(member)}
              className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {members.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">{t.noMembers}</p>
        )}
      </div>
    </div>
  );
};