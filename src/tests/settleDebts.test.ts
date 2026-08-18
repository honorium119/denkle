import { describe, it, expect } from 'vitest';
import { calculateSettlements, type Expense } from '../utils/settleDebts';

describe('Borç Sadeleştirme Algoritması (Debt Settlement)', () => {
  it('3 kişilik grupta tek kişi 300 TL ödediğinde diğerleri 100 TL borçlanmalı', () => {
    const members = ['Ahmet', 'Mehmet', 'Can'];
    const expenses: Expense[] = [
      {
        id: '1',
        description: 'Akşam Yemeği',
        amount: 300,
        payer: 'Ahmet',
        participants: ['Ahmet', 'Mehmet', 'Can'],
      },
    ];

    const result = calculateSettlements(members, expenses);

    expect(result).toHaveLength(2);
    expect(result).toContainEqual({ from: 'Mehmet', to: 'Ahmet', amount: 100 });
    expect(result).toContainEqual({ from: 'Can', to: 'Ahmet', amount: 100 });
  });

  it('Karşılıklı harcamaları en az transferle sadeleştirmeli', () => {
    const members = ['Ali', 'Ayşe', 'Burak'];
    const expenses: Expense[] = [
      {
        id: '1',
        description: 'Market',
        amount: 150,
        payer: 'Ali',
        participants: ['Ali', 'Ayşe', 'Burak'], // Kişi başı 50
      },
      {
        id: '2',
        description: 'Taksi',
        amount: 60,
        payer: 'Ayşe',
        participants: ['Ali', 'Ayşe', 'Burak'], // Kişi başı 20
      },
    ];

    // Net durum:
    // Ali: +150 ödedi, 70 masrafı var -> +80 alacaklı
    // Ayşe: +60 ödedi, 70 masrafı var -> -10 borçlu
    // Burak: 0 ödedi, 70 masrafı var -> -70 borçlu
    const result = calculateSettlements(members, expenses);

    expect(result).toEqual([
      { from: 'Burak', to: 'Ali', amount: 70 },
      { from: 'Ayşe', to: 'Ali', amount: 10 },
    ]);
  });
});