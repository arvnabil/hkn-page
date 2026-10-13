---
mode: agent
description: Migrasi satu halaman HTML lama ke AVer Kit (Tailwind + dark/light + header/footer konsisten + mobile)
---

Migrasikan file yang sedang terbuka (${file}) ke AVer Kit. Ikuti `.github/copilot-instructions.md`.

Langkah:

1. Baca `aver-kit/template.html` dan `aver-kit/assets/layout.js` sebagai acuan struktur.
2. Di `<head>`: ganti blok `tailwind.config = {...}`, `<style>` warna/font, dan link font dengan 6 baris head dari template (pertahankan `<title>` dan meta halaman).
3. Hapus seluruh `<header>`, `<aside>` utility bar, `<footer>`, dan menu mobile buatan sendiri. Ganti dengan `<aver-header></aver-header>` dan `<aver-footer></aver-footer>`. Bila halaman ini bagian dari menu tertentu, isi atribut `active="produk|artikel|solusi|panduan|tentang"`.
4. Konversi warna: hapus semua `dark:*`, hex hardcode, `bg-white`, `bg-slate-*`, `text-slate-*`, `bg-navy*`, `text-gray-*` menjadi token semantik (lihat daftar di instructions). Jika ragu, pilih token terdekat dan catat di ringkasan.
5. Mobile: pastikan tidak ada scroll horizontal di lebar 360px, target sentuh ≥44px, grid menjadi 1 kolom di bawah `md`, tabel dibungkus `overflow-x-auto`. Jika ada padanan `*-mobile.html`, gabungkan perbedaannya ke file ini dengan kelas responsif lalu laporkan bahwa file mobile bisa dihapus.
6. Jangan mengubah teks konten, URL, atau struktur heading. Jangan menambah dependensi baru.
7. Akhiri dengan ringkasan singkat: apa yang diganti, token yang dipilih dengan ragu, dan hal yang perlu dicek manual.
