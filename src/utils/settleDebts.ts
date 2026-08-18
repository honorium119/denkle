export interface Expense {
  id: string;
  description: string;
  amount: number;
  payer: string;
  participants: string[]; // Masrafı paylaşanlar
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export function calculateSettlements(
  members: string[],
  expenses: Expense[]
): Transaction[] {
  // 1. Herkesin net bakiyesini hesapla (+ alacaklı, - borçlu)
  const balances: Record<string, number> = {};
  members.forEach((m) => (balances[m] = 0));

  for (const expense of expenses) {
    if (!expense.participants || expense.participants.length === 0) continue;
    
    const splitAmount = expense.amount / expense.participants.length;
    balances[expense.payer] = (balances[expense.payer] || 0) + expense.amount;

    for (const participant of expense.participants) {
      balances[participant] = (balances[participant] || 0) - splitAmount;
    }
  }

  // 2. Alacaklıları ve borçluları ayır
  const debtors: { name: string; amount: number }[] = [];
  const creditors: { name: string; amount: number }[] = [];

  for (const [name, balance] of Object.entries(balances)) {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.01) debtors.push({ name, amount: -rounded });
    else if (rounded > 0.01) creditors.push({ name, amount: rounded });
  }

  // Büyük tutarları önce eşleştirmek için sırala
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  // 3. Minimum transferle borçları kapat
  const transactions: Transaction[] = [];
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    const settlementAmount = Math.min(debtor.amount, creditor.amount);

    if (settlementAmount > 0.01) {
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(settlementAmount * 100) / 100,
      });
    }

    debtor.amount -= settlementAmount;
    creditor.amount -= settlementAmount;

    if (debtor.amount <= 0.01) d++;
    if (creditor.amount <= 0.01) c++;
  }

  return transactions;
}