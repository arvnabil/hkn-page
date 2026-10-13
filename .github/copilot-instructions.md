# Aturan proyek: AVer Editorial (Harry Kusumo Negoro)

Situs statis HTML + Tailwind CSS (CDN v3) + JavaScript vanilla. Bahasa konten: Indonesia.

## Wajib di setiap halaman

- Salin `aver-kit/template.html`. Urutan di `<head>` jangan diubah: `theme.css` → `theme.js` (sinkron) → Tailwind CDN → `tailwind.config.js` → `layout.js` (defer).
- Header dan footer HANYA lewat `<aver-header>` dan `<aver-footer>`. Jangan menulis ulang header/footer/menu di halaman. Ubah menu atau footer di `aver-kit/assets/layout.js` (konstanta NAV dan FOOT).
- Satu `<h1>` per halaman, konten di dalam `<main id="main">`.

## Warna dan mode gelap

- Pakai token semantik saja: `bg-surface`, `bg-surface-container(-low/-high)`, `text-on-surface`, `text-on-surface-variant`, `text-muted-slate`, `border-border-clean`, `bg-primary text-on-primary`, `bg-secondary-container text-on-secondary-container`, `bg-tertiary`, `bg-error`.
- DILARANG: kelas `dark:`, hex hardcode (`bg-[#0B1F33]` dst.), `bg-white`, `bg-slate-*`, `text-gray-*`. Token sudah berganti otomatis saat mode berubah.
- Warna baru ditambah di `assets/theme.css` (versi light dan `:root.dark`) dan di daftar `names` pada `tailwind.config.js`.

## Tipografi

- Heading `font-display`, isi `font-body`, label/telemetri `font-mono`. Skala: `text-display(-mobile)`, `text-headline-lg/md/sm`, `text-title-md`, `text-body-md/sm`, `text-caption`, `text-label-mono`, `text-label-telemetry`.

## Mobile-first

- Tulis kelas dasar untuk mobile, lalu `md:` / `lg:`. Satu file untuk semua ukuran, tidak ada lagi file `*-mobile.html`.
- Target sentuh minimal 44px (`h-11`/`min-h-11`). Padding halaman: `px-gutter-mobile md:px-gutter`. Lebar maksimum: `max-w-page`.
- Tabel lebar dibungkus `overflow-x-auto`. Gambar `max-w-full h-auto` dengan `width`/`height` atau `aspect-*`.
- Jangan menambah elemen `fixed` di bawah layar: area itu dipakai bottom-nav dari `layout.js`.

## Aksesibilitas

- Fokus terlihat, `alt` pada gambar, `aria-label` pada tombol ikon, kontras minimal AA, hormati `prefers-reduced-motion`.
