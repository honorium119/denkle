import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense } from '../utils/settleDebts';
import { decodeGroupData, type ShareableGroupData } from '../utils/urlState';
import type { Language } from '../utils/translations';

export interface GroupItem {
  id: string;
  name: string;
  currency: string;
  members: string[];
  expenses: Expense[];
  createdAt: number;
}

interface GroupState {
  groups: GroupItem[];
  activeGroupId: string;
  theme: 'light' | 'dark';
  lang: Language;
  editingExpenseId: string | null;

  // Grup Eylemleri
  getActiveGroup: () => GroupItem;
  createGroup: (name: string) => void;
  selectGroup: (id: string) => void;
  deleteGroup: (id: string) => void;
  setGroupName: (name: string) => void;
  setCurrency: (currency: string) => void;
  setLang: (lang: Language) => void;
  toggleTheme: () => void;

  // Masraf ve Üye Eylemleri
  addMember: (name: string) => void;
  removeMember: (name: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  setEditingExpenseId: (id: string | null) => void;
  clearExpenses: () => void;
  resetGroup: () => void;
  loadFromData: (data: ShareableGroupData) => void;
  checkUrlForData: () => boolean;
}

const defaultInitialGroup: GroupItem = {
  id: 'default-group',
  name: 'Yeni Grup',
  currency: '₺',
  members: [],
  expenses: [],
  createdAt: Date.now(),
};

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groups: [defaultInitialGroup],
      activeGroupId: 'default-group',
      theme: 'light',
      lang: 'tr',
      editingExpenseId: null,

      getActiveGroup: () => {
        const { groups, activeGroupId } = get();
        return groups.find((g) => g.id === activeGroupId) || groups[0] || defaultInitialGroup;
      },

      createGroup: (name) => {
        const newGroup: GroupItem = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
          name: name.trim() || (get().lang === 'tr' ? 'Yeni Grup' : 'New Group'),
          currency: '₺',
          members: [],
          expenses: [],
          createdAt: Date.now(),
        };
        set((state) => ({
          groups: [newGroup, ...state.groups],
          activeGroupId: newGroup.id,
          editingExpenseId: null,
        }));
      },

      selectGroup: (id) => {
        set({ activeGroupId: id, editingExpenseId: null });
      },

      deleteGroup: (id) => {
        const { groups, activeGroupId } = get();
        if (groups.length <= 1) {
          get().resetGroup();
          return;
        }
        const remaining = groups.filter((g) => g.id !== id);
        set({
          groups: remaining,
          activeGroupId: activeGroupId === id ? remaining[0].id : activeGroupId,
          editingExpenseId: null,
        });
      },

      setGroupName: (name) => {
        set((state) => ({
          groups: state.groups.map((g) => (g.id === state.activeGroupId ? { ...g, name } : g)),
        }));
      },

      setCurrency: (currency) => {
        set((state) => ({
          groups: state.groups.map((g) => (g.id === state.activeGroupId ? { ...g, currency } : g)),
        }));
      },

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
        const current = get().getActiveGroup();
        if (!current.members.includes(trimmed)) {
          set((state) => ({
            groups: state.groups.map((g) =>
              g.id === state.activeGroupId ? { ...g, members: [...g.members, trimmed] } : g
            ),
          }));
        }
      },

      removeMember: (name) => {
        set((state) => ({
          groups: state.groups.map((g) => {
            if (g.id !== state.activeGroupId) return g;
            return {
              ...g,
              members: g.members.filter((m) => m !== name),
              expenses: g.expenses
                .filter((e) => e.payer !== name)
                .map((e) => ({
                  ...e,
                  participants: e.participants.filter((p) => p !== name),
                }))
                .filter((e) => e.participants.length > 0),
            };
          }),
        }));
      },

      addExpense: (expenseData) => {
        const newExpense: Expense = {
          ...expenseData,
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        };
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId ? { ...g, expenses: [newExpense, ...g.expenses] } : g
          ),
        }));
      },

      updateExpense: (id, expenseData) => {
        set((state) => ({
          groups: state.groups.map((g) => {
            if (g.id !== state.activeGroupId) return g;
            return {
              ...g,
              expenses: g.expenses.map((e) => (e.id === id ? { ...expenseData, id } : e)),
            };
          }),
          editingExpenseId: null,
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId ? { ...g, expenses: g.expenses.filter((e) => e.id !== id) } : g
          ),
        }));
      },

      setEditingExpenseId: (id) => set({ editingExpenseId: id }),

      clearExpenses: () => {
        set((state) => ({
          groups: state.groups.map((g) => (g.id === state.activeGroupId ? { ...g, expenses: [] } : g)),
        }));
        window.location.hash = '';
      },

      resetGroup: () => {
        const resetItem: GroupItem = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
          name: get().lang === 'tr' ? 'Yeni Grup' : 'New Group',
          currency: '₺',
          members: [],
          expenses: [],
          createdAt: Date.now(),
        };
        set({
          groups: [resetItem],
          activeGroupId: resetItem.id,
          editingExpenseId: null,
        });
        window.location.hash = '';
      },

      loadFromData: (data) => {
        const importedGroup: GroupItem = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
          name: data.groupName || (get().lang === 'tr' ? 'Paylaşılan Grup' : 'Shared Group'),
          currency: data.currency || '₺',
          members: data.members || [],
          expenses: data.expenses || [],
          createdAt: Date.now(),
        };
        set((state) => ({
          groups: [importedGroup, ...state.groups.filter((g) => g.name !== importedGroup.name)],
          activeGroupId: importedGroup.id,
          editingExpenseId: null,
        }));
      },

      checkUrlForData: () => {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#data=')) {
          const encoded = hash.replace('#data=', '');
          const data = decodeGroupData(encoded);
          if (data) {
            get().loadFromData(data);
            window.history.replaceState(null, '', window.location.pathname);
            return true;
          }
        }
        return false;
      },
    }),
    {
      name: 'fairsplit-storage-v2',
    }
  )
);