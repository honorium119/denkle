# ⚡ FairSplit — Serverless & Local-First Harcama Paylaştırıcı

> Arkadaş grupları, seyahatler ve ev arkadaşları için üyelik, veritabanı veya internet bağlantısı gerektirmeyen minimalist borç dengeleme uygulaması.

[![CI Pipeline](https://github.com/honorium119/fairsplit/actions/workflows/ci.yml/badge.svg)](https://github.com/honorium119/fairsplit/actions)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=flat&logo=vercel)](https://fairsplit-one.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)

---

## 💡 Çözülen Problem

Grup tatillerinde veya etkinliklerde harcamaları bölüşmek için kullanılan popüler uygulamalar; zorunlu üyelik, reklamlar, karmaşık arayüzler ve internet bağlantısı gerektirir. 

**FairSplit**, hiçbir sunucu veya kullanıcı kaydı gerektirmeden:
1. Tüm veriyi yerel tarayıcıda (`localStorage`) tutar.
2. Harcama durumunu sıkıştırılmış URL hash'i (`LZ-String`) veya **QR Kod** ile anında arkadaşlarla paylaşmayı sağlar.
3. Borçları **Minimum Nakit Akışı (Greedy Debt Simplification)** algoritmasıyla en az para transferi sayısına indirger.

---

## ✨ Temel Özellikler

- 🔐 **Sıfır Veri Toplama / No-Auth:** Hesap açma, e-posta veya parola yok. Veriler sadece cihazınızda kalır.
- 🔄 **URL & QR Senkronizasyonu:** Veritabanı olmadan tek tıkla durumu link veya QR kod ile paylaşabilme.
- 🧮 **Akıllı Borç Sadeleştirme:** Karmaşık çoklu harcamaları minimum transferle çözen $O(N \log N)$ graf sadeleştirme algoritması.
- 📱 **Mobil Öncelikli & Modern Arayüz:** Tailwind CSS ve Lucide Icons ile hızlı ve sade kullanıcı deneyimi.
- 🧪 **Otomatik Test & CI/CD:** GitHub Actions üzerinde Vitest ile test edilen çekirdek mantık.

---

## 🧠 Borç Dengeleme Mantığı (Algorithm)

Uygulama, klasik $N$ kişinin birbirine tek tek borçlandığı karmaşık senaryolar yerine açgözlü (greedy) yaklaşım kullanır:
1. Her üyenin toplam ödediği ve borçlandığı miktar üzerinden **Net Bakiye** hesaplanır ($+\text{Alacaklı}, -\text{Borçlu}$).
2. Alacaklılar ve borçlular büyükten küçüğe sıralanır.
3. En büyük borçlu ile en büyük alacaklı eşleştirilerek minimum transfer adımıyla borçlar sıfırlanır.

---

## 🛠️ Yerel Geliştirme (Local Setup)

```bash
# Repoyu klonlayın
git clone [https://github.com/](https://github.com/)honorium119/fairsplit.git
cd fairsplit

# Bağımlılıkları yükleyin
npm install

# Birim testlerini çalıştırın
npm test

# Geliştirme sunucusunu başlatın
npm run dev

📄 Lisans
Bu proje MIT Lisansı altında açık kaynak olarak lisanslanmıştır.