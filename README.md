# Laporan Keuangan Kelas VI

Aplikasi manajemen keuangan kelas sederhana yang dibuat menggunakan React, Tailwind CSS, dan library jsPDF. Aplikasi ini dirancang untuk kemudahan penggunaan oleh bendahara kelas.

## Panduan Deploy ke GitHub Pages (Gratis)

Karena aplikasi ini menggunakan **Babel Standalone**, Anda tidak perlu melakukan proses `build` yang rumit. Cukup ikuti langkah berikut:

### 1. Buat Repository di GitHub
1. Masuk ke akun [GitHub](https://github.com/) Anda.
2. Klik tombol **New** untuk membuat repository baru.
3. Beri nama (misal: `laporan-keuangan-kelas`).
4. Pastikan disetel ke **Public**, lalu klik **Create repository**.

### 2. Unggah File
1. Di halaman repository baru Anda, pilih link **"uploading an existing file"**.
2. Tarik (drag & drop) semua file dan folder berikut ke area upload:
   - `index.html`
   - `index.tsx`
   - `App.tsx`
   - `types.ts`
   - `constants.ts`
   - `theme.ts`
   - `metadata.json`
   - Folder `components/` (beserta seluruh isinya)
   - Folder `contexts/` (beserta seluruh isinya)
3. Klik **Commit changes**.

### 3. Aktifkan Fitur Pages
1. Klik tab **Settings** di bagian atas repository GitHub Anda.
2. Di menu samping kiri, klik **Pages**.
3. Di bawah bagian **Build and deployment > Branch**, pilih branch `main` (atau `master`).
4. Pastikan folder yang dipilih adalah `/(root)`.
5. Klik **Save**.

### 4. Selesai
Tunggu sekitar 1-2 menit. Segarkan halaman **Settings > Pages**. Anda akan melihat link URL aplikasi Anda yang sudah aktif (misal: `https://username.github.io/laporan-keuangan-kelas/`).

---

## Catatan Penting
- **Koneksi Internet**: Aplikasi memerlukan koneksi internet untuk memuat React, Tailwind, dan library lainnya melalui CDN.
- **MIME Types**: GitHub Pages secara otomatis menangani file `.tsx` karena diproses oleh Babel di sisi klien melalui tag `<script type="text/babel">` di `index.html`.
