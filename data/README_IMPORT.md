# WordPress -> Laravel News (5 tabel)

Semua JSON memiliki nama kolom sesuai ERD yang dikirim.

## Isi
- news.json: artikel, id 1..716
- news_categories.json: kategori, id 1..N
- news_tags.json: tag, id 1..N
- news_category_post.json: relasi news_id -> news_categories.id
- news_tag_post.json: relasi news_id -> news_tags.id
- migration_report.json: statistik dan peringatan

## PENTING
- Paket ini untuk target TABEL KOSONG. Semua `id` ditetapkan secara eksplisit sehingga foreign key pivot tepat. JANGAN import langsung ke database production yang sudah berisi baris.
- Backup database lebih dulu; gunakan staging database dan validasi semua foreign key.
- Nilai `user_id=1` diwarisi dari JSON sebelumnya: pastikan users.id=1 ada, atau ubah secara konsisten.
- Status `published`/`draft` harus sesuai enum/aturan aplikasi.
- Thumbnail dan URL media masih dapat mengarah ke WordPress lama.
- JSON bukan file yang otomatis dapat langsung diproses oleh fitur phpMyAdmin Import; gunakan command/seeder Laravel yang membaca tiap file.
- Import berurutan: news_categories, news_tags, news, news_category_post, news_tag_post.
- Jika tabel telah berisi data, gunakan importer yang melakukan upsert kategori/tag berdasarkan slug dan artikel berdasarkan mapping legacy WordPress ID, lalu bangun pivot memakai ID aktual hasil query DB. Jangan gunakan ID hardcoded dalam file ini.
- JSON tidak mencakup parent-child kategori (tidak ada kolomnya dalam ERD).
