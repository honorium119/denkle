import type { GroupItem } from '../hooks/useGroupStore';
import { calculateSettlements } from './settleDebts';
import type { Language } from './translations';

export function generateWhatsAppSummary(group: GroupItem, lang: Language = 'tr'): string {
  const { name, currency, members, expenses } = group;
  const settlements = calculateSettlements(members, expenses);
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const avg = members.length > 0 ? totalAmount / members.length : 0;
  const isTr = lang === 'tr';

  let text = `📊 *${name || (isTr ? 'Grup' : 'Group')} — ${isTr ? 'Hesap Özeti' : 'Hesap Özeti'}*\n`;
  text += `💰 *${isTr ? 'Toplam Masraf' : 'Total Expense'}:* ${totalAmount.toFixed(2)} ${currency}\n`;

  if (members.length > 0 && totalAmount > 0) {
    text += `👥 *${isTr ? 'Kişi Başı Ortalama' : 'Average Per Person'}:* ${avg.toFixed(2)} ${currency}\n`;
  }

  text += `\n`;

  if (expenses.length === 0) {
    text += isTr
      ? `ℹ️ *Durum:* Henüz kaydedilmiş bir masraf bulunmuyor.`
      : `ℹ️ *Status:* No expenses recorded yet.`;
  } else if (settlements.length === 0) {
    text += isTr
      ? `✅ *Hesaplar Tamamen Dengede!* Kimsenin kimseye borcu kalmadı.`
      : `✅ *All Settled Up!* No outstanding debts remaining.`;
  } else {
    text += isTr ? `🔄 *Ödeme Transferleri:*\n` : `🔄 *Settlement Transfers:*\n`;
    settlements.forEach((s) => {
      text += `• *${s.from}* ➡️ *${s.to}*: ${s.amount.toFixed(2)} ${currency}\n`;
    });
  }

  text += `\n🔗 *${isTr ? 'Denkle ile anında denkleştirildi.' : 'Instantly settled with Denkle.'}*`;

  return text;
}