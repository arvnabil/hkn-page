<?php

namespace Modules\CMS\Database\Seeders;

use Modules\CMS\Models\Page;
use Modules\CMS\Models\PageSection;
use Illuminate\Database\Seeder;

class ServicesPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create or Update Page
        $page = Page::updateOrCreate(
            ['slug' => 'services'],
            [
                'title' => 'Layanan & Solusi AVer',
                'type' => 'dynamic',
                'status' => 'published',
                'show_breadcrumb' => true,
            ]
        );

        // 2. Clear existing sections for this page
        PageSection::where('page_id', $page->id)->delete();

        // 3. Define Harry AVer Sections
        $sections = [
            [
                'section_key' => 'hero',
                'config' => [
                    'badge' => 'ARSITEKTUR & LAYANAN ENTERPRISE',
                    'title' => 'Layanan Konsultasi & Blueprint Solusi Ruang Rapat AVer',
                    'subtitle' => 'SOLUSI TERINTEGRASI END-TO-END',
                    'description' => 'Dari huddle room 2 orang hingga auditorium 200+ peserta, kami merancang konfigurasi kamera AI tracking, audio array ceiling, dan sistem display yang presisi.',
                    'primary_btn_text' => 'Minta Konsultasi Denah',
                    'primary_btn_url' => '/penawaran',
                    'secondary_btn_text' => 'Buka Studio Denah Interaktif',
                    'secondary_btn_url' => '/solusi',
                    'image' => '/assets/img/hero-ptz.png',
                    'stats' => [
                        ['value' => '5 Tipe', 'label' => 'Arsitektur Ruang Siap Pakai'],
                        ['value' => 'AI Cam', 'label' => 'Voice & Auto Tracking'],
                        ['value' => 'Teams/Zoom', 'label' => 'Native Certified'],
                        ['value' => '5 Tahun', 'label' => 'Garansi Resmi'],
                    ],
                ],
            ],
            [
                'section_key' => 'blueprint',
                'config' => [
                    'badge' => 'INTERACTIVE BLUEPRINT STUDIO',
                    'title' => 'Studio Denah Interaktif & Arsitektur Solusi Ruang',
                    'subtitle' => 'SIMULASI FOV KAMERA & AKUSTIK AUDIO RUANG RAPAT',
                    'description' => 'Eksplorasi penempatan kamera AVer, sudut pandang optimal (Field of View), dan jangkauan mikrofon beamforming untuk berbagai denah ruang rapat korporat dan institusi.',
                    'default_room' => 'huddle',
                ],
            ],
            [
                'section_key' => 'advisor',
                'config' => [
                    'badge' => 'SIMULATOR TEKNIS CERDAS',
                    'title' => 'AI Room Advisor & Recommendation HUD',
                    'subtitle' => 'SISTEM KONSULTASI INTERAKTIF PERANGKAT RUANG RAPAT',
                    'description' => 'Tentukan kapasitas peserta, platform UC yang digunakan, dan tipe pencahayaan untuk mendapatkan simulasi konfigurasi kamera dan audio AVer yang paling ideal secara instan.',
                ],
            ],
            [
                'section_key' => 'products',
                'config' => [
                    'badge' => 'KATALOG PERANGKAT RESMI',
                    'title' => 'Katalog Kamera PTZ & Sistem Audio AVer',
                    'subtitle' => 'HARDWARE BERMUTU TINGGI UNTUK ENTERPRISE & EDUCATION',
                    'description' => 'Temukan perangkat konferensi video AVer dengan zoom optik presisi tinggi, teknologi auto-framing cerdas, dan integrasi mulus dengan ekosistem Zoom, Teams, dan Google Meet.',
                    'limit' => 6,
                    'category' => 'all',
                    'cta_text' => 'Lihat Semua Kamera AVer',
                    'cta_url' => '/produk',
                ],
            ],
            [
                'section_key' => 'why_choose_us',
                'config' => [
                    'badge' => 'ENTERPRISE ASSURANCE',
                    'title' => 'Mengapa Memilih Ekosistem Konferensi AVer?',
                    'subtitle' => 'KEUNGGULAN ENTERPRISE KELAS DUNIA',
                    'description' => 'Dirancang untuk memberikan pengalaman komunikasi video tanpa hambatan dengan kecerdasan buatan terdepan dan reliabilitas hardware bersertifikasi global.',
                    'features' => [
                        [
                            'title' => 'Teknologi AI Voice & Gesture Tracking',
                            'description' => 'Kamera mendeteksi pembicara aktif secara otomatis dan dapat dikendalikan cukup dengan lambaian tangan tanpa remote.',
                            'icon' => 'psychology',
                        ],
                        [
                            'title' => 'Sertifikasi Resmi Teams, Zoom & Meet',
                            'description' => 'Kesesuaian protokol 100% tanpa delay, plug-and-play langsung tersambung dengan PC/Mac dan Microsoft Teams Rooms.',
                            'icon' => 'verified',
                        ],
                        [
                            'title' => 'Garansi Resmi Terpanjang: Hingga 5 Tahun',
                            'description' => 'Garansi standar 3 tahun dengan opsi ekstensi 2 tahun cuma-cuma melalui registrasi online untuk ketenangan jangka panjang.',
                            'icon' => 'shield',
                        ],
                        [
                            'title' => 'Dukungan Teknis & PoC Demo Lokal',
                            'description' => 'Tim ahli kami siap memberikan demonstrasi perangkat langsung di ruang rapat Anda sebelum proses pengadaan.',
                            'icon' => 'support_agent',
                        ],
                    ],
                    'show_button' => true,
                    'button_text' => 'Jadwalkan Demo / PoC',
                    'button_url' => '/penawaran',
                ],
            ],
            [
                'section_key' => 'inquiry',
                'config' => [
                    'badge' => 'B2B LEADS & INQUIRY',
                    'title' => 'Minta Penawaran Resmi & Jadwalkan PoC',
                    'subtitle' => 'KONSULTASI GRATIS DENGAN EXPERT AVer INDONESIA',
                    'description' => 'Isi formulir kebutuhan ruang rapat atau proyek Anda di bawah ini. Tim kami akan mengirimkan proposal harga resmi dan menghubungi Anda dalam 1x24 jam kerja.',
                ],
            ],
        ];

        // 4. Insert Sections
        foreach ($sections as $index => $section) {
            PageSection::create([
                'page_id' => $page->id,
                'section_key' => $section['section_key'],
                'position' => $index + 1,
                'is_active' => true,
                'config' => $section['config'],
            ]);
        }

        $this->command->info('Services Page Seeded Successfully!');
    }
}
