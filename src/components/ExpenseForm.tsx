import React, { useState, useRef, useEffect } from 'react';
import { Receipt, Plus, ChevronDown, Check } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { translations } from '../utils/translations';

export const ExpenseForm: React.FC = () => {
  const { members, currency, addExpense, lang } = useGroupStore();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState(members[0] || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(members);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    if (!payer && members.length > 0) setPayer(members[0]);
    setSelectedParticipants(members);
  }, [members]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-xs border border-zinc-200/70 dark:border-zinc-800 mb-6 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-teal-600 dark:text-emerald-400" />
        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{t.newExpense}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">{t.description}</label>
            <input
              type="text"
              placeholder={t.descPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-emerald-500/20 focus:border-teal-600 dark:focus:border-emerald-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              {t.amount} ({currency})
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-emerald-500/20 focus:border-teal-600 dark:focus:border-emerald-400 transition"
              required
            />
          </div>
        </div>

        {/* Özel "Kim Ödedi" Seçim Menüsü */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">{t.whoPaid}</label>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-emerald-500/20 focus:border-teal-600 dark:focus:border-emerald-400 transition cursor-pointer"
          >
            <span>{payer || members[0]}</span>
            <ChevronDown className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-teal-600 dark:text-emerald-400' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="max-h-48 overflow-y-auto space-y-1">
                {members.map((m) => {
                  const isSelected = m === payer;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setPayer(m);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50 dark:bg-emerald-950/50 text-teal-700 dark:text-emerald-300 font-bold'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60'
                      }`}
                    >
                      <span>{m}</span>
                      {isSelected && <Check className="w-4 h-4 text-teal-600 dark:text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">{t.splitBetween}</label>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => {
              const isSelected = selectedParticipants.includes(member);
              return (
                <button
                  type="button"
                  key={member}
                  onClick={() => toggleParticipant(member)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-emerald-950/50 border border-teal-200 dark:border-emerald-800/80 text-teal-800 dark:text-emerald-300 font-bold'
                      : 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-750'
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
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {t.saveExpense}
        </button>
      </form>
    </div>
  );
};