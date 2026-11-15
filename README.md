# AVer Kit

Aplikasi Laravel 13 memakai PHP **8.3 atau lebih baru**. Docker menggunakan
`php:8.3-fpm`; Composer mengunci resolusi dependency terhadap PHP 8.3.
Di production, arahkan PHP web/FPM, CLI, queue worker, dan scheduler ke versi
yang sama. Jalankan `composer check-platform-reqs --no-dev` sebelum deployment
untuk memeriksa versi dan ekstensi, termasuk `sodium` untuk dependency JWT.

Buka `showcase.html` untuk melihat semua token dan komponen. Klik ikon bulan/matahari di header untuk berganti mode.

```
aver-kit/
  template.html        halaman kosong (salin untuk halaman baru)
  showcase.html        pratinjau design system (light + dark)
  assets/
    theme.css          token warna light/dark (CSS variable)
    tailwind.config.js satu config untuk semua halaman (CDN atau build)
    theme.js           toggle terang/gelap/sistem, tersimpan, tanpa flash
    layout.js          <aver-header>, <aver-footer>, bottom-nav + drawer mobile
```

Letakkan folder `assets/` sejajar dengan file HTML Anda. Jika HTML ada di subfolder, ubah path di head.

Ubah menu: `NAV` di `layout.js`. Ubah kolom footer: `FOOT`. Tombol cari di header (`data-search`) masih kosong, sambungkan ke fitur pencarian Anda.

Pakai build Tailwind (bukan CDN): `module.exports` sudah tersedia di `tailwind.config.js`, lalu arahkan `content` ke file HTML Anda.

Kartu konten memakai `ui-card`: border 1px, radius 16px, tanpa bayangan saat diam.
Tambahkan `ui-card--interactive` untuk kartu yang berisi tautan atau kontrol;
hover dan fokus memberi penegasan border serta bayangan ringan. Pilih latar
`bg-surface-container-lowest` untuk kartu standar atau `bg-surface-alt` untuk
sorotan. Gambar di dalam kartu cukup memakai radius 8px; badge dan baris daftar
tidak perlu dijadikan kartu lagi. Panel CTA dan status boleh memakai aksen khusus.

phpMyAdmin lokal tersedia di http://127.0.0.1:8081 setelah menjalankan
`docker compose up -d db phpmyadmin`. Service ini terhubung ke MySQL melalui
`db:3306` di jaringan Compose dan otomatis login memakai `DB_USERNAME` serta
`DB_PASSWORD` dari `.env`. Port phpMyAdmin hanya diikat ke loopback komputer lokal.

Form Products mendukung satu gambar utama (`image_path`) dan sampai 10 gambar
galeri tambahan (`image_paths`, JSON berurutan). Upload disimpan di disk lokal
`public`, sedangkan database menyimpan path relatif. Jalankan `php artisan
storage:link` pada instalasi baru agar file dapat diakses melalui `/storage`.
Ringkasan kartu menggunakan `short_description`; detail memakai deskripsi lengkap,
spesifikasi berkelompok, fitur, datasheet, harga, dan pesan konsultasi produk.
Ringkasan spesifikasi dikelola terpisah dari `specs.technical` agar sertifikasi
dan data kartu tidak berubah format saat produk diedit. `solution_type` dan
`thumbnail_path` tetap dipertahankan untuk kompatibilitas data lama; thumbnail
lama hanya menjadi cadangan ketika gambar utama/galeri belum tersedia.

Untuk gambar seed lama dari `lh3.googleusercontent.com`, jalankan `php artisan
products:localize-images --dry-run`, lalu tanpa `--dry-run` untuk mengunduh dan
mengganti URL dengan path lokal. URL sumber lain tidak diunduh otomatis; unggah
file melalui form. Konten file diverifikasi sebagai JPG, PNG, atau WebP.

Semua formulir penawaran (halaman `/penawaran` dan blok Inquiry di CMS) mengirim
ke `POST /penawaran`. Lead, arsip FormSubmission, dan log kiriman sukses disimpan
dalam satu transaksi. Pengelolaan dan statistik hanya ditampilkan melalui menu
**Penawaran Masuk**; menu Form Inbox lama disembunyikan. Gunakan
`php artisan forms:sync-inquiries` untuk menautkan penawaran lama tanpa membuat
ulang lead, mengirim email, atau membuat statistik historis palsu.

Tampilan form dicatat saat form terlihat dan dihitung sekali per sesi/halaman
dalam 30 menit. Honeypot dan pembatasan 10 kiriman per menit selalu aktif.
reCAPTCHA v3 otomatis digunakan jika site key dan secret diatur melalui Site
Branding/Setting atau `.env` (`RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`). Secret
tetap di server. Dashboard menampilkan status konfigurasi sebenarnya; tanpa key
yang diaktifkan, perlindungan memakai honeypot dan pembatasan kiriman.

Tombol WhatsApp aktif memakai helper `resources/js/lib/whatsapp.js` dan selalu
melewati `/wa`. Nomor hanya dibaca dari **Settings → WhatsApp Bubble → WhatsApp
Number**; parameter URL `phone` tidak dapat menggantinya. Pesan setiap tombol
tetap dapat berbeda. Campaign default mengikuti konteks (`product_consultation`,
`article_consultation`, `guide_consultation`, `room_consultation`,
`product_comparison`, `footer_contact`, `advisor_consultation`, `floating_contact`).
UTM pengunjung yang sudah ada dipertahankan untuk source/medium/campaign/term;
`utm_content` dan `cta_position` mengidentifikasi tombol, sedangkan `page_route`
menyimpan halaman asal. Satu event dibaca oleh Click Events dan WhatsApp Logs.
Klik berulang hanya digabung untuk sesi, target, halaman, entity, dan UTM yang
sama dalam satu jam; tidak digabung hanya berdasarkan IP.

WhatsApp Bubble ditampilkan oleh `AppLayout` sesuai pengaturan aktif, halaman,
warna, ikon, posisi, offset, animasi, dan pesan di Filament. Di mobile, posisi
bawah dijaga di atas navigasi bawah. Tombol dari rich text dan menu CMS lama
juga dinormalisasi ke `/wa` agar tidak memakai nomor yang tertulis pada URL lama.

Import export SQL ke production tanpa phpMyAdmin tersedia melalui
`bash scripts/import-database.sh --check`. Panduan Docker dan server tanpa Docker,
backup otomatis, serta pemulihan ada di [scripts/IMPORT_DATABASE.md](scripts/IMPORT_DATABASE.md).
