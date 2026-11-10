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

        // 2. Define Harry AVer Editorial Magazine Sections (Layout 1)
        $homeSections = [
            [
                'key' => 'editorial_hero',
                'config' => [
                    'badge' => 'LIPUTAN UTAMA',
                    'sidebar_title' => 'TREN & ANALISIS TEKNIS',
                ]
            ],
            [
                'key' => 'ecosystem_alliance',
                'config' => [
                    'alliance_label' => 'ECOSYSTEM ALLIANCE',
                    'item_1' => 'Microsoft Teams Certified',
                    'item_2' => 'Zoom Rooms Certified',
                    'item_3' => 'Google Meet Compatible',
                    'item_4' => '3+2 Years Warranty',
                ]
            ],
            [
                'key' => 'advisor',
                'config' => [
                    'badge' => 'PROFIL ADVISOR · KONSULTASI PROFESIONAL',
                    'tagline' => 'Membantu Anda memilih solusi kolaborasi terbaik',
                    'bio' => 'Berdedikasi mendampingi organisasi, institusi pendidikan, dan konsultan arsitektur ruang dalam merancang ekosistem video konferensi modern. Fokus utama pada pemilihan konfigurasi kamera optik presisi dan teknologi AI tracking AVer yang selaras dengan dimensi fisik dan kebutuhan interaksi pengguna.',
                    'specialty' => 'AVer Optics & PTZ Systems',
                    'room_focus' => 'Huddle Space hingga Auditorium',
                    'approach' => 'Konsultatif Edukatif & Audit Fisik',
                    'whatsapp_text' => 'Konsultasi WhatsApp',
                    'whatsapp_url' => 'https://wa.me/6281200000000?text=Halo%20Harry,%20saya%20ingin%20konsultasi%20solusi%20AVer',
                    'profile_text' => 'Lihat Profil Lengkap',
                    'profile_url' => '/tentang',
                ]
            ],
            [
                'key' => 'articles',
                'config' => [
                    'subtitle' => 'DOKUMENTASI & PANDUAN TERBARU',
                    'title' => 'Arsip Artikel & Studi Kasus',
                    'limit' => '6',
                    'cta_text' => 'Lihat Semua Artikel',
                    'cta_url' => '/artikel',
                ]
            ],
            [
                'key' => 'products',
                'config' => [
                    'subtitle' => 'KATALOG HARDWARE ENTERPRISE',
                    'title' => 'Solusi Kamera & Video Bar AVer',
                    'limit' => '8',
                    'cta_text' => 'Lihat Semua Produk',
                    'cta_url' => '/produk',
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
