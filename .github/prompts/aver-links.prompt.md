---
mode: agent
description: Ganti semua href="#" di halaman terbuka dengan tujuan yang benar
---

Perbaiki link kosong di file yang sedang terbuka (${file}).

Halaman yang ada: index.html, product.html, product-detail.html, perbandingan.html, article.html, solusi.html, panduan.html, panduan-detail.html, about.html, penawaran.html.

Aturan:

1. Cari semua `href="#"`. Tentukan tujuannya dari teks link dan konteksnya, lalu isi dengan halaman yang paling sesuai dari daftar di atas (kartu artikel → article.html, kartu panduan → panduan-detail.html, kartu produk → product-detail.html, breadcrumb "Beranda" → index.html, tombol penawaran → penawaran.html).
2. Anchor internal (`#produk-unggulan`, dll.) hanya dipertahankan jika id tujuannya benar-benar ada di halaman ini. Jika tidak ada, laporkan.
3. Link yang tujuannya tidak bisa ditentukan: JANGAN ditebak. Biarkan `href="#"` dan daftarkan di akhir.
4. Breadcrumb item terakhir (halaman saat ini) boleh tanpa link: ubah jadi `<span aria-current="page">`.
5. Link eksternal wajib `target="_blank" rel="noopener noreferrer"`.
6. Jangan mengubah teks, class, atau struktur lain.

Akhiri dengan tabel: baris, teks link, tujuan baru, tingkat keyakinan.
