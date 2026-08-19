import type { GroupItem } from '../hooks/useGroupStore';
import { calculateSettlements } from './settleDebts';
import { encodeGroupData } from './urlState';
import type { Language } from './translations';

export function generateWhatsAppSummary(group: GroupItem, lang: Language = 'tr'): string {
  const { name, currency, members, expenses } = group;
  const settlements = calculateSettlements(members, expenses);
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const avg = members.length > 0 ? totalAmount / members.length : 0;
  const isTr = lang === 'tr';

  let text = `📊 *${name || (isTr ? 'Grup' : 'Group')} — ${isTr ? 'Hesap Özeti' : 'Expense Summary'}*\n`;
  text += `💰 *${isTr ? 'Toplam Masraf' : 'Total Expense'}:* ${totalAmount.toFixed(2)} ${currency}\n`;

  if (members.length > 0 && totalAmount > 0) {
    text += `👥 *${isTr ? 'Kişi Başı Ortalama' : 'Average Per Person'}:* ${avg.toFixed(2)} ${currency}\n`;
  }

  text += `\n`;

  if (expenses.length === 0) {
    text += isTr
      ? `ℹ️ *Durum:* Henüz kaydedilmiş bir masraf bulunmuyor.\n\n`
      : `ℹ️ *Status:* No expenses recorded yet.\n\n`;
  } else if (settlements.length === 0) {
    text += isTr
      ? `✅ *Hesaplar Tamamen Dengede!* Kimsenin kimseye borcu kalmadı.\n\n`
      : `✅ *All Settled Up!* No outstanding debts remaining.\n\n`;
  } else {
    text += isTr ? `🔄 *Ödeme Transferleri:*\n` : `🔄 *Settlement Transfers:*\n`;
    settlements.forEach((s) => {
      text += `• *${s.from}* ➡️ *${s.to}*: ${s.amount.toFixed(2)} ${currency}\n`;
    });
    text += `\n`;
  }

  // Canlı Grup Bağlantısı (Seçenek 3)
  if (typeof window !== 'undefined') {
    const encoded = encodeGroupData({
      groupName: name,
      currency,
      members,
      expenses,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}#data=${encoded}`;
    text += `🔗 ${shareUrl}\n\n`;
  }

  // Minimalist Fintech İmzası
  text += isTr
    ? `💸 *Denkle — Akıllı Masraf Paylaştırıcı*`
    : `💸 *Denkle — Smart Expense Splitter*`;

  return text;
}