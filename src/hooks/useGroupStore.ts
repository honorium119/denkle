import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense } from '../utils/settleDebts';
import { decodeGroupData, type ShareableGroupData } from '../utils/urlState';
import type { Language } from '../utils/translations';

interface GroupState {
  groupName: string;
  currency: string;
  members: string[];
  expenses: Expense[];
  theme: 'light' | 'dark';
  lang: Language;
  
  // Eylemler
  setGroupName: (name: string) => void;
  setCurrency: (currency: string) => void;
  setLang: (lang: Language) => void;
  toggleTheme: () => void;
  addMember: (name: string) => void;
  removeMember: (name: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void;
  resetGroup: () => void;
  loadFromData: (data: ShareableGroupData) => void;
  checkUrlForData: () => boolean;
}

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groupName: 'Yeni Grup',
      currency: '₺',
      members: [],
      expenses: [],
      theme: 'light',
      lang: 'tr',

      setGroupName: (groupName) => set({ groupName }),
      setCurrency: (currency) => set({ currency }),
      setLang: (lang) => set({ lang }),

      toggleTheme: () => {
        const nextTheme = get().theme === 'light' ? 'dark' : 'light';
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme: nextTheme });
      },

      addMember: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const { members } = get();
        if (!members.includes(trimmed)) {
          set({ members: [...members, trimmed] });
        }
      },

      removeMember: (name) => {
        const { members, expenses } = get();
        set({
          members: members.filter((m) => m !== name),
          // DÜZELTME 1: Katılımcısı kalmayan masrafları da güvenle temizle
          expenses: expenses
            .filter((e) => e.payer !== name)
            .map((e) => ({
              ...e,
              participants: e.participants.filter((p) => p !== name),
            }))
            .filter((e) => e.participants.length > 0),
        });
      },

      addExpense: (expenseData) => {
        const newExpense: Expense = {
          ...expenseData,
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
      },

      clearExpenses: () => {
        set({ expenses: [] });
        window.location.hash = '';
      },

      resetGroup: () => {
        set({
          groupName: get().lang === 'tr' ? 'Yeni Grup' : 'New Group',
          currency: '₺',
          members: [],
          expenses: [],
        });
        window.location.hash = '';
      },

      loadFromData: (data) => {
        set({
          groupName: data.groupName || 'Paylaşılan Grup',
          currency: data.currency || '₺',
          members: data.members || [],
          expenses: data.expenses || [],
        });
      },

      checkUrlForData: () => {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#data=')) {
          const encoded = hash.replace('#data=', '');
          const data = decodeGroupData(encoded);
          if (data) {
            get().loadFromData(data);
            // DÜZELTME 2: Veri yüklendikten sonra URL'deki eski hash'i temizle
            window.history.replaceState(null, '', window.location.pathname);
            return true;
          }
        }
        return false;
      },
    }),
    {
      name: 'fairsplit-storage',
    }
  )
);