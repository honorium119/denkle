import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense } from '../utils/settleDebts';
import { decodeGroupData, type ShareableGroupData } from '../utils/urlState';

interface GroupState {
  groupName: string;
  currency: string;
  members: string[];
  expenses: Expense[];
  
  // Eylemler
  setGroupName: (name: string) => void;
  setCurrency: (currency: string) => void;
  addMember: (name: string) => void;
  removeMember: (name: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void; // Yeni eklendi
  resetGroup: () => void;
  loadFromData: (data: ShareableGroupData) => void;
  checkUrlForData: () => boolean;
}

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groupName: 'Tatil Masrafları',
      currency: '₺',
      members: ['Ahmet', 'Mehmet', 'Can'],
      expenses: [
        {
          id: 'demo-1',
          description: 'Akşam Yemeği',
          amount: 300,
          payer: 'Ahmet',
          participants: ['Ahmet', 'Mehmet', 'Can'],
        },
      ],

      setGroupName: (groupName) => set({ groupName }),
      setCurrency: (currency) => set({ currency }),

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
          expenses: expenses
            .filter((e) => e.payer !== name)
            .map((e) => ({
              ...e,
              participants: e.participants.filter((p) => p !== name),
            })),
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
          groupName: 'Yeni Grup',
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