---
mode: agent
description: Rapikan semua gambar di halaman terbuka (alt, lazy-load, ukuran)
---

Rapikan semua `<img>` di file yang sedang terbuka (${file}).

1. `alt`: tulis deskripsi singkat yang bermakna dari konteks (nama produk, isi diagram). Gambar murni dekoratif diberi `alt=""`. Jangan mengisi alt dengan "gambar" atau nama file.
2. `loading="lazy"` dan `decoding="async"` untuk semua gambar KECUALI gambar pertama di hero atau di atas lipatan. Gambar hero diberi `fetchpriority="high"` dan tanpa lazy.
3. Cegah layout loncat: pastikan setiap gambar punya `width` dan `height`, atau wrapper dengan `aspect-*`. Jika ukuran asli tidak diketahui, pakai `aspect-*` pada wrapper dan `object-cover`, jangan menebak angka.
4. Responsif: `max-w-full h-auto` bila gambar bukan `object-cover` di wrapper.
5. Gambar yang jelas hanya placeholder (skeleton, `animate-pulse`) jangan diubah.
6. Jangan mengganti `src`, jangan mengubah layout, jangan menambah library.

Akhiri dengan tabel: baris, alt yang dibuat, status lazy/eager. Tandai alt yang sebaiknya saya periksa sendiri.
