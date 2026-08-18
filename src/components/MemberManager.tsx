import React, { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';

export const MemberManager: React.FC = () => {
  const { members, addMember, removeMember } = useGroupStore();
  const [name, setName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addMember(name.trim());
      setName('');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-800">Grup Üyeleri ({members.length})</h2>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Yeni kişi ekle (örn. Ali)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" /> Ekle
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <span
            key={member}
            className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold group hover:bg-red-50 hover:text-red-700 transition"
          >
            {member}
            <button
              onClick={() => removeMember(member)}
              className="text-slate-400 hover:text-red-600 transition"
              title="Üyeyi Sil"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {members.length === 0 && (
          <p className="text-xs text-slate-400 italic">Henüz kimse eklenmedi. Masraf eklemek için önce kişi ekleyin.</p>
        )}
      </div>
    </div>
  );
};