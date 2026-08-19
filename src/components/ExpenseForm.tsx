import React, { useState, useRef, useEffect } from 'react';
import { Receipt, Plus, ChevronDown, Check, X, Sparkles } from 'lucide-react';
import { useGroupStore } from '../hooks/useGroupStore';
import { translations } from '../utils/translations';
import { Toast } from './Toast';

export const ExpenseForm: React.FC = () => {
  const {
    getActiveGroup,
    addExpense,
    updateExpense,
    editingExpenseId,
    setEditingExpenseId,
    lang,
  } = useGroupStore();

  const currentGroup = getActiveGroup();
  const { members, currency, expenses } = currentGroup;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState(members[0] || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(members);
  const [toastMessage, setToastMessage] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    if (editingExpenseId) {
      const exp = expenses.find((e) => e.id === editingExpenseId);
      if (exp) {
        setDescription(exp.description);
        setAmount(exp.amount.toString());
        setPayer(exp.payer);
        setSelectedParticipants(exp.participants);
      }
    }
  }, [editingExpenseId, expenses]);

  useEffect(() => {
    if (!editingExpenseId) {
      if (!members.includes(payer)) {
        setPayer(members[0] || '');
      }
      setSelectedParticipants((prev) => {
        const valid = prev.filter((m) => members.includes(m));
        return valid.length > 0 ? valid : members;
      });
    }
  }, [members, payer, editingExpenseId]);

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
      } else {
        setToastMessage({ msg: t.toastSelectParticipant, type: 'error' });
      }
    } else {
      setSelectedParticipants([...selectedParticipants, member]);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpenseId(null);
    setDescription('');
    setAmount('');
    setPayer(members[0] || '');
    setSelectedParticipants(members);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!description.trim()) return;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setToastMessage({ msg: t.toastInvalidAmount, type: 'error' });
      return;
    }

    if (parsedAmount > 10_000_000) {
      setToastMessage({ msg: t.toastMaxAmount, type: 'error' });
      return;
    }

    if (selectedParticipants.length === 0) {
      setToastMessage({ msg: t.toastSelectParticipant, type: 'error' });
      return;
    }

    if (editingExpenseId) {
      updateExpense(editingExpenseId, {
        description: description.trim(),
        amount: parsedAmount,
        payer,
        participants: selectedParticipants,
      });
      setToastMessage({ msg: t.toastExpenseUpdated, type: 'success' });
    } else {
      addExpense({
        description: description.trim(),
        amount: parsedAmount,
        payer,
        participants: selectedParticipants,
      });
      setToastMessage({ msg: t.toastExpenseAdded, type: 'success' });
    }

    setDescription('');
    setAmount('');
  };

  if (members.length === 0) return null;

  return (
    <>
      <div
        className={`bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-xs border transition-colors mb-6 ${
          editingExpenseId
            ? 'border-teal-500 dark:border-emerald-400 ring-2 ring-teal-500/20 dark:ring-emerald-400/20'
            : 'border-zinc-200/70 dark:border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600 dark:text-emerald-400" aria-hidden="true" />
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {editingExpenseId ? t.editExpense : t.newExpense}
            </h2>
          </div>
          {editingExpenseId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              aria-label={t.cancelEdit}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" /> {t.cancelEdit}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="expense-desc" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                {t.description}
              </label>
              <input
                id="expense-desc"
                type="text"
                maxLength={40}
                placeholder={t.descPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-emerald-500/20 focus:border-teal-600 dark:focus:border-emerald-400 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="expense-amount" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                {t.amount} ({currency})
              </label>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                max="10000000"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  if (e.target.value.length <= 11) setAmount(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-emerald-500/20 focus:border-teal-600 dark:focus:border-emerald-400 transition"
                required
              />
            </div>
          </div>

          {/* "Kim Ödedi" Seçim Menüsü */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{t.whoPaid}</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label={`${t.whoPaid}: ${members.includes(payer) ? payer : members[0] || ''}`}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-emerald-500/20 focus:border-teal-600 dark:focus:border-emerald-400 transition cursor-pointer"
            >
              <span>{members.includes(payer) ? payer : members[0] || ''}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-teal-600 dark:text-emerald-400' : ''}`} aria-hidden="true" />
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
                        aria-label={m}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-emerald-950/50 text-teal-700 dark:text-emerald-300 font-bold'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750'
                        }`}
                      >
                        <span>{m}</span>
                        {isSelected && <Check className="w-4 h-4 text-teal-600 dark:text-emerald-400" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{t.splitBetween}</label>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => {
                const isSelected = selectedParticipants.includes(member);
                return (
                  <button
                    type="button"
                    key={member}
                    onClick={() => toggleParticipant(member)}
                    aria-label={`${member} ${isSelected ? 'seçildi' : 'seçilmedi'}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-emerald-950/50 border border-teal-200 dark:border-emerald-800/80 text-teal-800 dark:text-emerald-300 font-bold'
                        : 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-750'
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
            aria-label={editingExpenseId ? t.updateExpense : t.saveExpense}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
          >
            {editingExpenseId ? <Sparkles className="w-4 h-4" aria-hidden="true" /> : <Plus className="w-4 h-4" aria-hidden="true" />}
            {editingExpenseId ? t.updateExpense : t.saveExpense}
          </button>
        </form>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage.msg}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
};