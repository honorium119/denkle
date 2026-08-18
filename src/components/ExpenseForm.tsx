import React, { useState } from 'react';
import { Receipt, Plus } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';

export const ExpenseForm: React.FC = () => {
  const { members, currency, addExpense } = useGroupStore();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState(members[0] || '');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(members);

  // Üyeler değiştikçe varsayılanları güncelle
  React.useEffect(() => {
    if (!payer && members.length > 0) setPayer(members[0]);
    setSelectedParticipants(members);
  }, [members]);

  const toggleParticipant = (member: string) => {
    if (selectedParticipants.includes(member)) {
      if (selectedParticipants.length > 1) {
        setSelectedParticipants(selectedParticipants.filter((m) => m !== member));
      }
    } else {
      setSelectedParticipants([...selectedParticipants, member]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0 || !payer || selectedParticipants.length === 0) return;

    addExpense({
      description,
      amount: parsedAmount,
      payer,
      participants: selectedParticipants,
    });

    setDescription('');
    setAmount('');
  };

  if (members.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-800">Yeni Masraf Ekle</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Açıklama</label>
            <input
              type="text"
              placeholder="örn. Market, Akşam Yemeği"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tutar ({currency})</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Kim Ödedi?</label>
          <select
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
          >
            {members.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">Masrafı Kimler Paylaştı?</label>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => {
              const isSelected = selectedParticipants.includes(member);
              return (
                <button
                  type="button"
                  key={member}
                  onClick={() => toggleParticipant(member)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                      : 'bg-slate-50 border border-slate-200 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {member}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" /> Masrafı Kaydet
        </button>
      </form>
    </div>
  );
};