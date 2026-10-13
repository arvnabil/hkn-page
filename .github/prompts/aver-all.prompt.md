---
mode: agent
description: Jalankan satu tugas AVer (audit, links, images, seo) ke SEMUA halaman, satu per satu
---

Terapkan tugas "${input:tugas:audit | links | images | seo}" ke semua halaman berikut, SATU PER SATU, berurutan:

index.html, product.html, product-detail.html, perbandingan.html, article.html, solusi.html, panduan.html, panduan-detail.html, about.html, penawaran.html

Untuk setiap halaman, baca dan ikuti instruksi di file prompt yang sesuai:

- audit → `.github/prompts/aver-audit.prompt.md` (hanya laporan, jangan ubah file)
- links → `.github/prompts/aver-links.prompt.md`
- images → `.github/prompts/aver-images.prompt.md`
- seo → `.github/prompts/aver-seo.prompt.md`

Aturan kerja:

1. Selesaikan satu halaman penuh sebelum pindah ke halaman berikutnya. Jangan menggabungkan atau melewati halaman.
2. Baca ulang file dari disk di awal setiap halaman, jangan mengandalkan ingatan dari halaman sebelumnya.
3. Jangan mengubah file selain halaman yang sedang dikerjakan, dan jangan menyentuh folder `assets/` dan `legacy/`.
4. Jika sebuah halaman gagal atau ragu, catat alasannya lalu lanjut ke halaman berikutnya. Jangan menebak.
5. Untuk tugas selain "audit": setelah tiap halaman selesai, tulis satu baris "✔ nama-file: jumlah perubahan" sebelum lanjut.

Di akhir, buat satu tabel ringkasan: halaman, jumlah perubahan atau temuan, dan hal yang perlu saya cek manual. Untuk "audit", urutkan temuan dari tingkat tertinggi di semua halaman.
