import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { decodeGroupData } from '../utils/urlState';
import type { Language } from '../utils/translations';

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  payer: string;
  participants: string[];
  date: string;
}

export interface GroupItem {
  id: string;
  name: string;
  currency: string;
  members: string[];
  expenses: ExpenseItem[];
}

export interface GroupState {
  groups: GroupItem[];
  activeGroupId: string;
  editingExpenseId: string | null;
  theme: 'light' | 'dark';
  lang: Language;
  isReceiptOpen: boolean;

  // Grup Eylemleri
  getActiveGroup: () => GroupItem;
  setActiveGroupId: (id: string) => void;
  createGroup: (name: string) => void;
  deleteGroup: (id: string) => void;
  setGroupName: (name: string) => void;
  setCurrency: (currency: string) => void;
  resetGroup: () => void;

  // Üye Eylemleri
  addMember: (name: string) => void;
  removeMember: (name: string) => void;

  // Masraf Eylemleri
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'date'>) => void;
  updateExpense: (id: string, expense: Omit<ExpenseItem, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void;
  setEditingExpenseId: (id: string | null) => void;

  // Genel Ayarlar & Durumlar
  toggleTheme: () => void;
  setLang: (lang: Language) => void;
  setIsReceiptOpen: (isOpen: boolean) => void;
  checkUrlForData: () => void;
}

const defaultGroupId = 'default-group-1';

// TEMİZ BAŞLANGIÇ: Sahte kullanıcılar kaldırıldı, tertemiz boş liste
const initialDefaultGroup: GroupItem = {
  id: defaultGroupId,
  name: 'Yeni Grup',
  currency: '₺',
  members: [], // Sıfır üye
  expenses: [], // Sıfır masraf
};

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groups: [initialDefaultGroup],
      activeGroupId: defaultGroupId,
      editingExpenseId: null,
      theme: 'dark',
      lang: 'tr',
      isReceiptOpen: false,

      getActiveGroup: () => {
        const state = get();
        return (
          state.groups.find((g) => g.id === state.activeGroupId) ||
          state.groups[0] ||
          initialDefaultGroup
        );
      },

      setActiveGroupId: (id: string) => set({ activeGroupId: id }),

      setEditingExpenseId: (id: string | null) => set({ editingExpenseId: id }),

      createGroup: (name: string) => {
        const newGroup: GroupItem = {
          id: `group-${Date.now()}`,
          name: name.trim() || 'Yeni Grup',
          currency: '₺',
          members: [],
          expenses: [],
        };
        set((state) => ({
          groups: [...state.groups, newGroup],
          activeGroupId: newGroup.id,
        }));
      },

      deleteGroup: (id: string) => {
        set((state) => {
          const filtered = state.groups.filter((g) => g.id !== id);
          if (filtered.length === 0) {
            return {
              groups: [initialDefaultGroup],
              activeGroupId: defaultGroupId,
            };
          }
          return {
            groups: filtered,
            activeGroupId: state.activeGroupId === id ? filtered[0].id : state.activeGroupId,
          };
        });
      },

      setGroupName: (name: string) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId ? { ...g, name } : g
          ),
        }));
      },

      setCurrency: (currency: string) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId ? { ...g, currency } : g
          ),
        }));
      },

      resetGroup: () => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId
              ? { ...g, members: [], expenses: [] }
              : g
          ),
        }));
      },

      addMember: (name: string) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId && !g.members.includes(name)
              ? { ...g, members: [...g.members, name] }
              : g
          ),
        }));
      },

      removeMember: (name: string) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId
              ? {
                  ...g,
                  members: g.members.filter((m) => m !== name),
                  expenses: g.expenses
                    .filter((e) => e.payer !== name)
                    .map((e) => ({
                      ...e,
                      participants: e.participants.filter((p) => p !== name),
                    }))
                    .filter((e) => e.participants.length > 0),
                }
              : g
          ),
        }));
      },

      addExpense: (expenseData) => {
        const newExpense: ExpenseItem = {
          ...expenseData,
          id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          date: new Date().toISOString(),
        };
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId
              ? { ...g, expenses: [newExpense, ...g.expenses] }
              : g
          ),
        }));
      },

      updateExpense: (id, expenseData) => {
        set((state) => ({
          editingExpenseId: null,
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId
              ? {
                  ...g,
                  expenses: g.expenses.map((e) =>
                    e.id === id ? { ...e, ...expenseData } : e
                  ),
                }
              : g
          ),
        }));
      },

      deleteExpense: (id: string) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId
              ? { ...g, expenses: g.expenses.filter((e) => e.id !== id) }
              : g
          ),
        }));
      },

      clearExpenses: () => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === state.activeGroupId ? { ...g, expenses: [] } : g
          ),
        }));
      },

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      },

      setLang: (lang: Language) => set({ lang }),

      setIsReceiptOpen: (isReceiptOpen: boolean) => set({ isReceiptOpen }),

      checkUrlForData: () => {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash;
        if (hash.includes('data=')) {
          const encoded = hash.split('data=')[1];
          const decoded = decodeGroupData(encoded);
          if (decoded && decoded.members && decoded.expenses) {
            const formattedExpenses: ExpenseItem[] = (decoded.expenses as any[]).map((exp) => ({
              id: exp.id || `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              description: exp.description,
              amount: exp.amount,
              payer: exp.payer,
              participants: exp.participants,
              date: exp.date || new Date().toISOString(),
            }));

            const importedGroup: GroupItem = {
              id: `imported-${Date.now()}`,
              name: decoded.groupName || 'Paylaşılan Grup',
              currency: decoded.currency || '₺',
              members: decoded.members,
              expenses: formattedExpenses,
            };

            set((state) => ({
              groups: [importedGroup, ...state.groups.filter((g) => g.name !== importedGroup.name)],
              activeGroupId: importedGroup.id,
            }));

            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      },
    }),
    {
      name: 'denkle-multi-groups-v3', // v3 olarak güncelledik ki eski sahte verili hafıza sıfırlansın
      partialize: (state) => ({
        groups: state.groups,
        activeGroupId: state.activeGroupId,
        theme: state.theme,
        lang: state.lang,
      }),
    }
  )
);