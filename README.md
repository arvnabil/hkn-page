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
