<?php

namespace Modules\CMS\Database\Seeders;

use Modules\CMS\Models\Page;
use Modules\CMS\Models\PageSection;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create or Update Home Page
        $homePage = Page::updateOrCreate(
            ['slug' => 'home'],
            [
                'title' => 'Home',
                'type' => 'home',
                'status' => 'published',
                'is_homepage' => true,
                'show_breadcrumb' => false,
            ]
        );

        // Clear existing sections for this page to avoid duplicates on re-seed
        PageSection::where('page_id', $homePage->id)->delete();

        // 2. Define Harry AVer Specialized Sections (Order matters)
        $homeSections = [
            [
                'key' => 'hero',
                'config' => [
                    'badge' => 'AVer INDONESIA ENTERPRISE PARTNER',
                    'title' => 'Solusi Video Conference & Kamera PTZ Enterprise AVer',
                    'subtitle' => 'TEKNOLOGI HYBRID WORKPLACE RESMI',
                    'description' => 'Optimalisasi ruang rapat, auditorium, dan ruang kelas Anda dengan teknologi kamera tracking berbasis AI, audio array bersertifikasi Microsoft Teams & Zoom, serta garansi resmi 5 tahun.',
                    'primary_btn_text' => 'Minta Penawaran B2B',
                    'primary_btn_url' => '/penawaran',
                    'secondary_btn_text' => 'Eksplorasi Denah Solusi',
                    'secondary_btn_url' => '/solusi',
                    'image' => '/assets/img/hero-ptz.png',
                    'stats' => [
                        ['value' => '4K / 60fps', 'label' => 'Resolusi Optik Ultra HD'],
                        ['value' => '30X', 'label' => 'Optical Zoom Lossless'],
                        ['value' => 'AI Tracking', 'label' => 'Voice & Preset Tracking Otomatis'],
                        ['value' => '5 Tahun', 'label' => 'Garansi Resmi Enterprise'],
                    ],
                ]
            ],
            [
                'key' => 'advisor',
                'config' => [
                    'badge' => 'SIMULATOR TEKNIS CERDAS',
                    'title' => 'AI Room Advisor & Recommendation HUD',
                    'subtitle' => 'SISTEM KONSULTASI INTERAKTIF PERANGKAT RUANG RAPAT',
                    'description' => 'Tentukan kapasitas peserta, platform UC yang digunakan, dan tipe pencahayaan untuk mendapatkan simulasi konfigurasi kamera dan audio AVer yang paling ideal secara instan.',
                ]
            ],
            [
                'key' => 'blueprint',
                'config' => [
                    'badge' => 'INTERACTIVE BLUEPRINT STUDIO',
                    'title' => 'Studio Denah Interaktif & Arsitektur Solusi Ruang',
                    'subtitle' => 'SIMULASI FOV KAMERA & AKUSTIK AUDIO RUANG RAPAT',
                    'description' => 'Eksplorasi penempatan kamera AVer, sudut pandang optimal (Field of View), dan jangkauan mikrofon beamforming untuk berbagai denah ruang rapat korporat dan institusi.',
                    'default_room' => 'huddle',
                ]
            ],
            [
                'key' => 'products',
                'config' => [
                    'badge' => 'KATALOG PERANGKAT RESMI',
                    'title' => 'Katalog Kamera PTZ & Sistem Audio AVer',
                    'subtitle' => 'HARDWARE BERMUTU TINGGI UNTUK ENTERPRISE & EDUCATION',
                    'description' => 'Temukan perangkat konferensi video AVer dengan zoom optik presisi tinggi, teknologi auto-framing cerdas, dan integrasi mulus dengan ekosistem Zoom, Teams, dan Google Meet.',
                    'limit' => 6,
                    'category' => 'all',
                    'cta_text' => 'Lihat Semua Kamera AVer',
                    'cta_url' => '/produk',
                ]
            ],
            [
                'key' => 'comparison',
                'config' => [
                    'badge' => 'TECHNICAL SPECIFICATION MATRIX',
                    'title' => 'Matriks Perbandingan Kamera PTZ AVer',
                    'subtitle' => 'KOMPARASI SPESIFIKASI TEKNIS & FITUR ENTERPRISE',
                    'description' => 'Bandingkan resolusi optik, kemampuan zoom, sudut pandang fov, dan sertifikasi platform antar tipe kamera AVer untuk memilih perangkat yang paling tepat.',
                    'product_1' => 'cam570',
                    'product_2' => 'cam550',
                    'product_3' => 'cam520-pro3',
                ]
            ],
            [
                'key' => 'why_choose_us',
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
                ]
            ],
            [
                'key' => 'articles',
                'config' => [
                    'badge' => 'EDITORIAL & TECH BRIEFS',
                    'title' => 'Wawasan Teknis & Panduan Ruang Hybrid',
                    'subtitle' => 'PUBLIKASI & BEDAH TEKNOLOGI PRO AV',
                    'description' => 'Eksplorasi artikel terkini mengenai arsitektur ruang rapat modern, tips akustik, panduan pemilihan lensa PTZ, dan studi kasus implementasi nyata di Indonesia.',
                    'limit' => 3,
                    'cta_text' => 'Lihat Semua Artikel',
                    'cta_url' => '/artikel',
                ]
            ],
            [
                'key' => 'faq',
                'config' => [
                    'badge' => 'FREQUENTLY ASKED QUESTIONS',
                    'title' => 'Pertanyaan Umum Seputar Solusi AVer (FAQ)',
                    'subtitle' => 'INFORMASI TEKNIS & PENGADAAN ENTERPRISE',
                    'description' => 'Temukan jawaban cepat mengenai garansi, kompatibilitas software, integrasi audio ceiling, hingga mekanisme uji coba perangkat (PoC).',
                    'items' => [
                        [
                            'question' => 'Apakah kamera AVer kompatibel dengan Microsoft Teams Rooms dan Zoom Rooms?',
                            'answer' => 'Ya, seluruh lini produk kamera AVer (seperti CAM570, CAM550, dan VB342 Pro) telah bersertifikasi resmi oleh Microsoft Teams dan Zoom, serta mendukung fitur kontrol native dari layar sentuh konsol ruang rapat.',
                        ],
                        [
                            'question' => 'Bagaimana cara mengajukan Proof of Concept (PoC) di kantor kami?',
                            'answer' => 'Anda dapat mengisi formulir Permintaan Penawaran atau menghubungi Harry via WhatsApp. Tim teknis kami akan mengantarkan unit demo ke kantor Anda di wilayah Jabodetabek, Surabaya, dan sekitarnya.',
                        ],
                        [
                            'question' => 'Berapa lama masa garansi resmi kamera AVer di Indonesia?',
                            'answer' => 'Semua kamera enterprise AVer dilengkapi garansi standar 3 tahun, dengan tambahan 2 tahun gratis (total 5 tahun) cukup dengan mendaftarkan nomor seri produk di portal registrasi resmi AVer.',
                        ],
                        [
                            'question' => 'Apakah AVer bisa diintegrasikan dengan mikrofon ceiling pihak ketiga (Shure / Sennheiser)?',
                            'answer' => 'Sangat bisa. Seri kamera seperti CAM570 dan CAM550 mendukung integrasi audio-tracking via preset triggering dari DSP Shure IntelliMix, Sennheiser TeamConnect, dan Yamaha RM-CG.',
                        ],
                    ],
                ]
            ],
            [
                'key' => 'inquiry',
                'config' => [
                    'badge' => 'B2B LEADS & INQUIRY',
                    'title' => 'Minta Penawaran Resmi & Jadwalkan PoC',
                    'subtitle' => 'KONSULTASI GRATIS DENGAN EXPERT AVer INDONESIA',
                    'description' => 'Isi formulir kebutuhan ruang rapat atau proyek Anda di bawah ini. Tim kami akan mengirimkan proposal harga resmi dan menghubungi Anda dalam 1x24 jam kerja.',
                ]
            ],
        ];

        foreach ($homeSections as $index => $section) {
            PageSection::create([
                'page_id' => $homePage->id,
                'section_key' => $section['key'],
                'position' => $index + 1,
                'is_active' => true,
                'config' => $section['config'],
            ]);
        }

        // 3. Create or Update About Us Page
        $aboutPage = Page::updateOrCreate(
            ['slug' => 'about-us'],
            [
                'title' => 'About Us',
                'type' => 'dynamic',
                'status' => 'published',
                'is_homepage' => false,
                'show_breadcrumb' => true,
            ]
        );

        PageSection::where('page_id', $aboutPage->id)->delete();

        $aboutSections = [
            [
                'key' => 'hero',
                'config' => [
                    'badge' => 'TENTANG HARRY & AVer SOLUTIONS',
                    'title' => 'Konsultan Spesialis & Technical Advisor Audio Visual Enterprise',
                    'subtitle' => 'PENGALAMAN & INTEGRITAS TEKNOLOGI HYBRID',
                    'description' => 'Harry hadir sebagai technical advisor dan partner pengadaan resmi perangkat video conference AVer di Indonesia, membantu institusi merancang ruang rapat, auditorium, dan kelas cerdas berstandar internasional.',
                    'primary_btn_text' => 'Konsultasi Sekarang',
                    'primary_btn_url' => '/penawaran',
                    'secondary_btn_text' => 'Lihat Produk AVer',
                    'secondary_btn_url' => '/produk',
                    'image' => '/assets/harrys.png',
                    'stats' => [
                        ['value' => '10+ Thn', 'label' => 'Pengalaman Implementasi AV'],
                        ['value' => '100+', 'label' => 'Ruang Rapat Terpasang'],
                        ['value' => 'Official', 'label' => 'Partner Perangkat AVer'],
                        ['value' => '5 Tahun', 'label' => 'Garansi Resmi Enterprise'],
                    ],
                ]
            ],
            [
                'key' => 'rich_text',
                'config' => [
                    'badge' => 'COMPANY OVERVIEW',
                    'title' => 'Mengenal Harry Kusumo Negoro & Solusi AVer',
                    'subtitle' => 'DEDIKASI UNTUK KOLABORASI MODERN DI INDONESIA',
                    'content' => '<p>Di tengah pesatnya perkembangan sistem kerja hybrid, kualitas komunikasi visual dan kejernihan audio bukan lagi sekadar fasilitas pendukung, melainkan penentu produktivitas dan citra profesional organisasi.</p><p>Harry berfokus menyediakan konsultasi teknis, evaluasi tata letak ruang, perhitungan jangkauan FOV lensa, serta integrasi kamera PTZ AVer berstandar Microsoft Teams Rooms, Zoom Rooms, dan Google Meet. Kami memastikan setiap investasi perangkat tepat guna, andal, dan siap mendukung pertumbuhan jangka panjang bisnis Anda.</p>',
                ]
            ],
            [
                'key' => 'why_choose_us',
                'config' => [
                    'badge' => 'STANDAR LAYANAN',
                    'title' => 'Komitmen Kami untuk Setiap Klien',
                    'subtitle' => 'NILAI TAMBAH KONSULTASI PROFESIONAL',
                    'description' => 'Setiap proyek ruang rapat ditangani dengan pendekatan menyeluruh mulai dari asesmen akustik hingga pelatihan operasional tim internal Anda.',
                    'features' => [
                        [
                            'title' => 'Konsultasi Objektif & Tepat Kebutuhan',
                            'description' => 'Rekomendasi perangkat disesuaikan dengan dimensi ruang, akustik, dan platform UC yang digunakan.',
                            'icon' => 'verified',
                        ],
                        [
                            'title' => 'Simulasi Interaktif Blueprint & FOV',
                            'description' => 'Visualisasikan denah dan sudut pandang kamera sebelum pengadaan perangkat dilakukan.',
                            'icon' => 'architecture',
                        ],
                        [
                            'title' => 'Fasilitas Demo Unit & PoC Langsung',
                            'description' => 'Uji performa kamera AI tracking langsung di ruang rapat Anda sebelum memutuskan pembelian.',
                            'icon' => 'devices',
                        ],
                        [
                            'title' => 'Garansi Resmi & Dukungan Purna Jual',
                            'description' => 'Jaminan unit original dengan dukungan garansi resmi AVer hingga 5 tahun dan tim teknis responsif.',
                            'icon' => 'shield',
                        ],
                    ],
                    'show_button' => true,
                    'button_text' => 'Diskusikan Kebutuhan Anda',
                    'button_url' => '/penawaran',
                ]
            ],
            [
                'key' => 'faq',
                'config' => [
                    'badge' => 'TANYA JAWAB',
                    'title' => 'Pertanyaan Seputar Layanan Konsultasi',
                    'subtitle' => 'INFORMASI PENGADAAN & PROSES POC',
                    'description' => 'Hal-hal yang sering ditanyakan oleh klien enterprise mengenai alur konsultasi dan uji coba perangkat.',
                    'items' => [
                        [
                            'question' => 'Apakah konsultasi awal dan simulasi denah dikenakan biaya?',
                            'answer' => 'Tidak, konsultasi awal dan rekomendasi teknis diberikan secara cuma-cuma sebagai bagian dari komitmen kami membantu Anda menemukan solusi terbaik.',
                        ],
                        [
                            'question' => 'Bagaimana cara mengajukan uji coba unit (Proof of Concept)?',
                            'answer' => 'Cukup kirimkan permintaan melalui form penawaran atau WhatsApp kami. Kami akan menjadwalkan kunjungan teknisi untuk instalasi sementara demo unit di lokasi Anda.',
                        ],
                    ],
                ]
            ],
            [
                'key' => 'inquiry',
                'config' => [
                    'badge' => 'HUBUNGI HARRY',
                    'title' => 'Konsultasi Spesifikasi & Jadwal PoC',
                    'subtitle' => 'RESPON CEPAT 1X24 JAM KERJA',
                    'description' => 'Silakan tinggalkan pesan mengenai ruang pertemuan atau proyek Anda. Kami akan menghubungi Anda untuk memberikan rekomendasi arsitektur terbaik.',
                ]
            ],
        ];

        foreach ($aboutSections as $index => $section) {
            PageSection::create([
                'page_id' => $aboutPage->id,
                'section_key' => $section['key'],
                'position' => $index + 1,
                'is_active' => true,
                'config' => $section['config'],
            ]);
        }
    }
}
