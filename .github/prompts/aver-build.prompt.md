---
mode: agent
description: Ganti Tailwind CDN dengan build CSS untuk produksi (seluruh proyek)
---

Siapkan build Tailwind CSS v3 untuk seluruh proyek ini dan hentikan pemakaian CDN. Kerjakan bertahap dan tanya saya sebelum menjalankan perintah yang menginstal paket.

1. Buat `package.json` bila belum ada. devDependencies: `tailwindcss@3` dan `@tailwindcss/forms` dan `@tailwindcss/container-queries`. Script: `"dev": "tailwindcss -i ./src/input.css -o ./assets/app.css --watch"` dan `"build": "tailwindcss -i ./src/input.css -o ./assets/app.css --minify"`.
2. Buat `src/input.css` berisi tiga direktif `@tailwind base; @tailwind components; @tailwind utilities;` lalu `@import`-kan atau salin isi `assets/theme.css` setelahnya (token warna `:root` / `:root.dark` dan utilitas khusus harus ikut ter-build).
3. Ubah `assets/tailwind.config.js` agar tetap kompatibel dengan CDN dan build: tambahkan `content: ["./*.html", "./assets/layout.js"]` dan `plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")]` hanya jika `typeof require !== "undefined"`. Penting: `layout.js` WAJIB masuk `content` karena class header/footer ada di dalamnya.
4. Di SEMUA file `.html`: hapus tag `<script src="https://cdn.tailwindcss.com...">` dan `<script src="assets/tailwind.config.js">`. Ganti `<link rel="stylesheet" href="assets/theme.css" />` dengan `<link rel="stylesheet" href="assets/app.css" />`. Pertahankan `assets/theme.js` sinkron di `<head>` dan `assets/layout.js` defer.
5. Tambahkan `.gitignore` berisi `node_modules/`. Biarkan `assets/app.css` ikut di-commit agar situs bisa langsung di-host statis.
6. Jangan mengubah class atau konten halaman. Setelah selesai, jalankan `npm run build` dan laporkan ukuran `assets/app.css`.
7. Tulis di akhir cara menjalankan `npm run dev` dan hal yang perlu dicek: class dinamis di `layout.js` yang mungkin tidak terdeteksi (cari di hasil build), tampilan terang/gelap, dan mobile 360px.
