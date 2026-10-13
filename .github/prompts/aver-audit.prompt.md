---
mode: agent
description: Audit satu halaman terhadap aturan AVer Kit (hanya laporan, tidak mengubah file)
---

Audit file yang sedang terbuka (${file}) terhadap `.github/copilot-instructions.md`. JANGAN mengubah file apa pun, hanya buat laporan.

Periksa dan laporkan nomor baris untuk setiap temuan:

1. Struktur: urutan `<head>`, ada `<aver-header>` dan `<aver-footer>`, satu `<h1>`, konten di `<main id="main">`, `<html>` tanpa class light/dark.
2. Warna: sisa `dark:`, hex hardcode (`[#...]`), `bg-white`, `bg-slate-*`, `text-gray-*`, dan nama kelas warna yang tidak ada di `assets/tailwind.config.js`.
3. Kontras di dark mode: `text-white` di atas `bg-primary` / `bg-secondary` / `bg-tertiary` / `bg-error` (harus `text-on-*`), teks gelap di atas latar navy tetap, kotak berwarna terang yang tidak berubah saat dark.
4. Mobile 360px: elemen berlebar tetap (`w-[###px]`), tabel tanpa `overflow-x-auto`, grid tanpa fallback 1 kolom, target sentuh di bawah 44px, elemen `fixed` di bawah layar.
5. Aksesibilitas: gambar tanpa `alt`, tombol ikon tanpa `aria-label`, urutan heading melompat, link `href="#"`.
6. SEO: `<title>`, meta description, Open Graph, favicon.

Format laporan: tabel dengan kolom Baris, Masalah, Saran perbaikan, Tingkat (tinggi/sedang/rendah). Tutup dengan tiga prioritas perbaikan teratas.
