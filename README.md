# AVer Kit

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
