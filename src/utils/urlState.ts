import LZString from 'lz-string';
import type { Expense } from './settleDebts';

export interface ShareableGroupData {
  groupName: string;
  currency: string;
  members: string[];
  expenses: Expense[];
}

// Veriyi URL için süper sıkıştırılmış bir koda çevirir
export function encodeGroupData(data: ShareableGroupData): string {
  try {
    const json = JSON.stringify(data);
    return LZString.compressToEncodedURIComponent(json);
  } catch (error) {
    console.error('URL encode hatası:', error);
    return '';
  }
}

// URL'den gelen sıkıştırılmış kodu tekrar veriye dönüştürür
export function decodeGroupData(encoded: string): ShareableGroupData | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;
    return JSON.parse(decompressed) as ShareableGroupData;
  } catch (error) {
    console.error('URL decode hatası:', error);
    return null;
  }
}