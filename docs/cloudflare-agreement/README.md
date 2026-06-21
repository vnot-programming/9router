# Fitur Cloudflare One-Click Model Agreement

## Latar Belakang
Model Llama 3.2 Vision dari Meta di-host oleh Cloudflare Workers AI. Cloudflare mensyaratkan setiap pengguna (setiap Cloudflare Account ID) untuk secara eksplisit menyetujui *Terms of Service* (ToS) Meta sebelum model ini dapat digunakan (memunculkan error HTTP 403 `Model Agreement`).

## Cara Kerja Baru (One-Click Agreement)
Untuk mempermudah User Experience, 9router telah dilengkapi fitur persetujuan ToS cerdas:

1. **Deteksi Error Cerdas:** Saat pengguna melakukan *Add API Key* atau menguji *Test Connection*, endpoint `/api/providers/validate/route.js` dan `testUtils.js` tidak lagi menganggap `403` sebagai kegagalan validasi *invalid credentials* murni. API akan mengurai JSON Error yang dikembalikan oleh Cloudflare.
2. **Pemicu Khusus:** Jika JSON error mengandung frasa `"Model Agreement"`, status khusus `MODEL_AGREEMENT_REQUIRED` akan dikembalikan ke frontend.
3. **UI Responsif:** Komponen `AddApiKeyModal.js` di dashboard akan mendeteksi status ini dan secara dinamis memunculkan tombol **"Setujui Syarat & Ketentuan"**.
4. **Persetujuan Latar Belakang:** Ketika diklik, tombol tersebut menembak *endpoint* baru `/api/providers/cloudflare-agree/route.js` dengan mengirimkan payload JSON `{ prompt: "agree" }` menggunakan kredensial Account ID dan API Token milik pengguna.
5. **Sukses:** Jika persetujuan diterima, koneksi API secara otomatis tervalidasi sukses tanpa pengguna perlu masuk ke CLI / terminal sama sekali.

## Struktur File Berubah
- `src/app/api/providers/validate/route.js` (Modifikasi: Parser Error Model Agreement)
- `src/app/api/providers/[id]/test/testUtils.js` (Modifikasi: Parser Error untuk background jobs)
- `src/app/(dashboard)/dashboard/providers/[id]/AddApiKeyModal.js` (Modifikasi: Penambahan Tombol ToS UI)
- `src/app/api/providers/cloudflare-agree/route.js` (Baru: Endpoint eksekusi persetujuan)
