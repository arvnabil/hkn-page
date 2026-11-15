# Import database production tanpa phpMyAdmin

Script ini dijalankan melalui terminal/SSH di folder proyek, bukan lewat browser.
File default adalah `data/harry_db.sql` (export MySQL 8 dari phpMyAdmin).
Upload script dan SQL **di luar folder public**. Gunakan hanya SQL export tepercaya.
Nomor database dan kredensial lokal tidak disalin otomatis ke production.

## Production menggunakan Docker Compose proyek ini

Pastikan environment service `db` (`MYSQL_DATABASE`, `MYSQL_USER`,
`MYSQL_PASSWORD`) menunjuk database production yang benar. Periksa target:

```bash
bash scripts/import-database.sh --check
```

Untuk database kosong:

```bash
docker compose exec -T app php artisan down
# Hentikan juga worker queue / scheduler dan proses lain yang menulis database.
bash scripts/import-database.sh
docker compose exec -T app php artisan migrate --force
docker compose exec -T app php artisan optimize:clear
docker compose exec -T app php artisan up
```

Untuk **mengganti seluruh isi database yang sudah ada**, tambahkan `--replace`.
Script membuat backup terlebih dahulu; kegagalan backup membatalkan penghapusan.

```bash
docker compose exec -T app php artisan down
# Hentikan worker queue / scheduler sebelum lanjut.
bash scripts/import-database.sh --replace
# Jalankan langkah berikut hanya jika import berhasil.
docker compose exec -T app php artisan migrate --force
docker compose exec -T app php artisan optimize:clear
docker compose exec -T app php artisan up
```

Backup disimpan di `storage/app/private/backups`, permission file baru hanya
untuk pemilik. Simpan salinannya di lokasi aman. Untuk pemulihan, gunakan script
yang sama dengan `--file /path/backup.sql --replace`. Jangan membuka maintenance
atau menjalankan worker ketika import/migration gagal. Import bukan transaksi
atomik: CREATE/DROP TABLE melakukan implicit commit di MySQL.

## Production tanpa Docker

Butuh Bash, PHP aplikasi, dan **MySQL 8 client** (`mysql`, `mysqldump`).
Masukkan kredensial production dari konfigurasi database hosting. Password
dibaca tersembunyi, tidak ditulis di argumen command atau history:

```bash
export MYSQL_HOST='127.0.0.1'
export MYSQL_TCP_PORT='3306'
export MYSQL_DATABASE='nama_database_production'
export MYSQL_USER='user_database_production'
read -r -s -p 'Password database: ' MYSQL_PWD; echo
export MYSQL_PWD
bash scripts/import-database.sh --native --check
php artisan down
# Hentikan worker queue / scheduler juga.
bash scripts/import-database.sh --native --replace
# Lanjut hanya jika berhasil:
php artisan migrate --force
php artisan optimize:clear
php artisan up
unset MYSQL_PWD
```

Hilangkan `--replace` untuk database kosong. `--file` memilih SQL lain.
Untuk koneksi remote dengan CA TLS gunakan `MYSQL_SSL_CA=/path/ca.pem`;
untuk Unix socket gunakan `MYSQL_UNIX_PORT=/path/mysql.sock`.
Jika hosting tidak menyediakan SSH/terminal, minta hosting menjalankan perintah
ini atau menggunakan fasilitas restore database mereka.

## Setelah import

- Sesuaikan `.env` production (`APP_URL`, DB, mail, cache) lalu bangun ulang
  config cache sesuai proses deployment. Script tidak mengubah `.env`.
- Export tanggal 15 November mendahului perubahan produk/inbox tanggal 16
  November. Karena itu `migrate --force` wajib agar schema sesuai kode terbaru.
- SQL tidak berisi file gambar. Salin juga `storage/app/public`, lalu jalankan
  `php artisan storage:link` di aplikasi production.
- Periksa akun admin, pengaturan WhatsApp, serta URL/gambar yang tersimpan
  sebelum mengaktifkan kembali trafik. Data production baru yang tidak ada
  di export akan tergantikan jika menggunakan `--replace`.
