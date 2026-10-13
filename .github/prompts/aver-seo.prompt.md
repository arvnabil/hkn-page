---
mode: agent
description: Tambah SEO dasar (title, meta description, Open Graph, favicon) ke halaman terbuka
---

Lengkapi SEO dasar file yang sedang terbuka (${file}). Bahasa Indonesia.

Tambahkan di `<head>`, setelah `<meta name="viewport">` dan sebelum link CSS/font. Jangan mengubah urutan script `theme.js`, Tailwind, `tailwind.config.js`, dan `layout.js`:

1. `<title>`: maksimal 60 karakter, format "Judul halaman | Harry Kusumo Negoro". Pakai judul dari `<h1>`.
2. `<meta name="description">`: 130–155 karakter, ditulis dari isi halaman, jangan generik dan jangan mengarang spesifikasi atau angka yang tidak ada di halaman.
3. `<link rel="canonical" href="https://DOMAIN-ANDA/NAMA-FILE.html">` (biarkan DOMAIN-ANDA persis seperti itu agar mudah dicari dan diganti).
4. Open Graph: `og:type` (article untuk halaman artikel/panduan, selain itu website), `og:title`, `og:description`, `og:url`, `og:locale` = id_ID, `og:image` = `https://DOMAIN-ANDA/assets/og-default.png`. Tambah `twitter:card` = summary_large_image.
5. Favicon: `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`.
6. Pastikan `<meta name="theme-color" content="#F8F9FF">` ada (nilainya diubah otomatis oleh `theme.js`).
7. Halaman artikel/panduan: tambahkan JSON-LD `Article` dengan headline, description, author "Harry Kusumo Negoro", dan tanggal hanya jika tanggalnya memang tertulis di halaman.

Akhiri dengan daftar placeholder yang masih harus saya isi (domain, og-default.png, favicon.svg).
