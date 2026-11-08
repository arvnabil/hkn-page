<?php

namespace Modules\CMS\Database\Seeders;

use Modules\CMS\Models\Page;
use Modules\CMS\Models\PageSection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

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

        // 2. Define Sections (Order matters)
        $sections = [
            [
                // New Slider Section (Variant: Hero, Source: Static)
                'key' => 'slider',
                'config' => [
                    'variant' => 'hero',
                    'source' => 'static',
                    'delay' => 5000,
                    'slides' => [
                        [
                            'title' => 'Tumbuh Bersama Teknologi yang Terhubung',
                            'description' => 'Kami membantu bisnis Anda menyelaraskan infrastruktur ICT agar setiap sistem dapat berkomunikasi dengan sempurna, memberikan Anda ruang lebih untuk fokus pada hal yang paling utama: Kesuksesan Bisnis.',
                            'bg_image' => '/assets/img/hero/hero_bg_3_1.png',
                            'buttons' => [
                                ['text' => 'Download Company Profile', 'url' => '#', 'style' => 'style7'],
                                ['text' => 'Hubungi via WhatsApp', 'url' => 'https://wa.me/6285162994602', 'style' => 'style2', 'open_new_tab' => true]
                            ]
                        ],
                        [
                            'title' => 'Kolaborasi Sempurna, Perangkat Terpercaya',
                            'description' => 'Spesialis integrasi system audio video conference berpengalaman yang memastikan setiap pertemuan Anda berjalan tanpa kendala teknis untuk setiap komunikasi bisnis Anda.',
                            'bg_image' => '/assets/img/hero/hero_bg_2_1.png',
                            'buttons' => [
                                ['text' => 'Lihat Projects', 'url' => '/projects', 'style' => 'style7'],
                                ['text' => 'Hubungi Kami', 'url' => '/contact', 'style' => 'style2']
                            ]
                        ],
                        [
                            'title' => 'Integritas Infrastruktur, Kreativitas Software, Kesuksesan Bisnis.',
                            'description' => 'Kami menghadirkan pengalaman solusi ICT profesional yang dipadukan dengan pengembangan perangkat lunak kustom untuk memastikan setiap sistem teknologi bekerja tepat sesuai kebutuhan bisnis Anda.',
                            'bg_image' => '/assets/img/hero/hero_bg_2_2.png',
                            'buttons' => [
                                ['text' => 'Konsultasi Software Custom', 'url' => '/contact', 'style' => 'style7'],
                            ]
                        ],
                        [
                            'title' => 'Keahlian dalam Pemasangan, Komitmen dalam Perawatan.',
                            'description' => 'Kami hadir memastikan setiap infrastruktur IT dan ruang kolaborasi Anda tetap dalam performa puncak, memberikan Anda kebebasan untuk fokus sepenuhnya pada pertumbuhan bisnis tanpa khawatir hambatan teknis',
                            'bg_image' => '/assets/img/hero/hero_bg_4_1.png',
                            'buttons' => [
                                ['text' => 'Paket Maintenance', 'url' => '/services', 'style' => 'style7'],
                                ['text' => 'Konsultasi Instalasi', 'url' => '/contact', 'style' => 'style2']
                            ]
                        ]
                    ]
                ]
            ],
            [
                'key' => 'about',
                'config' => [
                    'variant' => 'home',
                    'title' => 'Optimalisasi Komunikasi & Kolaborasi Audio Visual Enterprise.',
                    'subtitle' => 'Tentang Harry & AVer Solutions',
                    'description' => 'Harry hadir sebagai B2B technical advisor dan konsultan spesialis solusi video conference serta kamera AI tracking AVer di Indonesia. Berbekal keahlian teknis dalam integrasi ruang rapat enterprise, smart classroom, dan auditorium, kami membantu organisasi merancang ekosistem audio-visual yang andal, modern, dan presisi sesuai kebutuhan ruang Anda.',
                    'images' => [
                        '/assets/img/normal/about_7_1.jpg',
                        '/assets/img/normal/about_7_2.jpg',
                        '/assets/img/normal/about_7_3.jpg'
                    ],
                    'features' => [
                        [
                            'title' => 'AVer Enterprise Certified Solutions',
                            'text' => 'Konsultasi dan penyediaan lini kamera PTZ, USB conference cam, dan audio beamforming resmi bergaransi.',
                            'icon' => '/assets/img/icon/shield.svg'
                        ],
                        [
                            'title' => 'Desain Solusi & Blueprint Interaktif',
                            'text' => 'Simulasi tata letak FOV kamera, akustik mikrofon, dan kompatibilitas platform UC (Zoom, Teams, Google Meet).',
                            'icon' => '/assets/img/icon/shield.svg'
                        ]
                    ]
                ]
            ],
            [
                'key' => 'services',
                'config' => [
                    'limit' => 6,
                    'order' => 'asc'
                ]
            ],
            [
                // Brand Partners Section
                'key' => 'brand_partners',
                'config' => [
                    'title' => '',
                    'subtitle' => '',
                    'brands' => [
                         ['image' => '/assets/img/brand/brand_1_1.svg', 'url' => '#', 'name' => 'Brand 1'],
                         ['image' => '/assets/img/brand/brand_1_2.svg', 'url' => '#', 'name' => 'Brand 2'],
                         ['image' => '/assets/img/brand/brand_1_3.svg', 'url' => '#', 'name' => 'Brand 3'],
                         ['image' => '/assets/img/brand/brand_1_4.svg', 'url' => '#', 'name' => 'Brand 4'],
                         ['image' => '/assets/img/brand/brand_1_5.svg', 'url' => '#', 'name' => 'Brand 5'],
                         ['image' => '/assets/img/brand/brand_1_6.svg', 'url' => '#', 'name' => 'Brand 6'],
                         ['image' => '/assets/img/brand/brand_1_7.svg', 'url' => '#', 'name' => 'Brand 7']
                    ]
                ]
            ],
            [
                'key' => 'why_choose_us',
                'config' => [
                    'title' => 'Standar Tertinggi Kolaborasi Digital dengan Solusi AVer Teruji.',
                    'subtitle' => 'Mengapa Memilih Harry',
                    'description' => 'Kami tidak sekadar menawarkan perangkat, melainkan solusi menyeluruh mulai dari asesmen denah ruang, simulasi teknis AI HUD, hingga panduan instalasi profesional agar investasi teknologi Anda memberikan hasil kolaborasi terbaik.',
                    'features' => [
                        [
                            'title' => 'Keahlian Teknis Audio Visual',
                            'text' => 'Didukung pengalaman mendalam dalam integrasi sistem video conference dan akustik ruang korporat.',
                            'icon' => '/assets/img/icon/shield.svg'
                        ],
                        [
                            'title' => 'Rekomendasi Berbasis AI & Blueprint',
                            'text' => 'Perhitungan akurat kapasitas peserta, pencahayaan, dan sudut pandang kamera untuk hasil optimal.',
                            'icon' => '/assets/img/icon/shield.svg'
                        ]
                    ],
                    'images' => [
                         '/assets/img/normal/about_4_1.jpg',
                         '/assets/img/normal/about_4_2.jpg'
                    ],
                    'video_url' => 'https://www.youtube.com/watch?v=hIIQbkkKnno'
                ]
            ],
            [
                'key' => 'projects',
                'config' => [
                    'limit' => 8
                ]
            ],
            [
                'key' => 'cta', // ClientSection
                'config' => [
                    'title' => 'Our Clients',
                    'subtitle' => 'Clients',
                    'clients' => ["1_1", "1_2", "1_3", "1_4", "1_5", "1_6", "1_7", "1_1", "1_4", "1_3", "1_2", "1_1", "1_1", "1_1"]
                ]
            ],
            [
                'key' => 'news',
                'config' => [
                    'title' => 'Berita & Wawasan Terkini',
                    'subtitle' => 'Kabar & Artikel Audio Visual',
                    'limit' => 3
                ]
            ]
        ];

        // 3. Insert Sections
        foreach ($sections as $index => $section) {
            PageSection::create([
                'page_id' => $homePage->id,
                'section_key' => $section['key'],
                'position' => $index + 1,
                'is_active' => true,
                'config' => $section['config'],
            ]);
        }

        // 4. Create or Update About Us Page
        $aboutPage = Page::updateOrCreate(
            ['slug' => 'about-us'],
            [
                'title' => 'About Us',
                'type' => 'dynamic', // Or whatever generic type implies dynamic
                'status' => 'published',
                'is_homepage' => false,
                'show_breadcrumb' => true, // Ensure breadcrumb is shown
            ]
        );

        PageSection::where('page_id', $aboutPage->id)->delete();

        $aboutSections = [
             // 1. About Content (Legacy)
            [
                'key' => 'about_content',
                'config' => [
                    'subtitle' => 'Tentang Harry',
                    'title' => 'Menghubungkan Kolaborasi dan Teknologi Ruang Rapat Modern.',
                    'description' => 'Harry adalah technical advisor terpercaya untuk pengadaan dan integrasi sistem video conferencing AVer di Indonesia. Kami berdedikasi memberikan konsultasi B2B profesional untuk perusahaan, institusi pendidikan, dan instansi pemerintahan dalam merancang ruang kolaborasi masa depan.',
                    'images' => [
                        '/assets/img/normal/about_7_1.jpg',
                        '/assets/img/normal/about_7_2.jpg',
                        '/assets/img/normal/about_7_3.jpg',
                    ],
                    'video_url' => 'https://www.youtube.com/watch?v=hIIQbkkKnno',
                    'features' => [
                        [
                            'title' => 'Konsultan Spesialis AVer',
                            'description' => 'Fokus mendalam pada ekosistem AVer: kamera AI auto tracking, video bar, dan sistem mikrofon konferensi.',
                            'icon' => '/assets/img/icon/guide.svg',
                        ],
                        [
                            'title' => 'Dukungan Teknis Komprehensif',
                            'description' => 'Membantu evaluasi arsitektur ruang rapat, rekomendasi penempatan perangkat, dan konfigurasi sistem audio-visual.',
                            'icon' => '/assets/img/icon/policy.svg',
                        ],
                        [
                            'title' => 'Kemitraan Resmi & Bergaransi',
                            'description' => 'Jaminan produk resmi, garansi pabrikan, dan kesinambungan layanan purna jual yang profesional.',
                            'icon' => '/assets/img/icon/support.svg',
                        ],
                    ],
                ]
            ],
             // 2. Vision & Mission (Legacy)
            [
                'key' => 'vision_mission',
                'config' => [
                    'vision_title' => 'Visi Kami',
                    'vision_text' => 'Menjadi mitra rujukan utama B2B di Indonesia dalam implementasi solusi audio-visual dan smart collaboration room berstandar global.',
                    'mission_title' => 'Misi Kami',
                    'mission_items' => [
                        ['text' => 'Menyediakan konsultasi teknis yang objektif, presisi, dan sesuai dengan kapasitas serta anggaran ruang kerja Anda.'],
                        ['text' => 'Mengembangkan perangkat interaktif (AI Advisor HUD & Blueprint Studio) guna mempermudah pemilihan solusi AV.'],
                        ['text' => 'Memberikan edukasi dan pendampingan implementasi teknologi kamera cerdas (AI auto tracking & voice tracking).'],
                        ['text' => 'Memastikan kepuasan jangka panjang klien melalui dukungan teknis yang responsif dan berintegritas.'],
                    ],
                    'goal_title' => 'Tujuan Kami',
                    'goal_text' => 'Menciptakan pengalaman rapat hibrida yang lancar, bebas hambatan teknis, dan meningkatkan produktivitas seluruh tim organisasi.',
                ]
            ],
             // 3. Testimonial (Legacy)
            [
                'key' => 'testimonial',
                'config' => [
                    'title' => 'What Client Say About us',
                    'subtitle' => 'Testimonials',
                    'testimonials' => [
                        [
                            'name' => 'Sarah Rahman',
                            'role' => 'UI/UX Designer',
                            'quote' => 'Cybersecurity is more critical than ever. We implemented a comprehensive security strategy that includes firewall protection and regular audits.',
                            'rating' => 5,
                            'image' => '/assets/img/testimonial/testi_4_1.png',
                        ],
                        [
                            'name' => 'Rina Sartika',
                            'role' => 'Product Manager',
                            'quote' => 'Cloud computing has revolutionized how we operate. It offers scalability and flexibility, allowing us to access data from anywhere.',
                            'rating' => 5,
                            'image' => '/assets/img/testimonial/testi_4_2.png',
                        ],
                        [
                            'name' => 'Michael Chen',
                            'role' => 'Developer',
                            'quote' => 'Data analytics is key to understanding our customers. We use advanced tools to analyze trends and make data-driven decisions.',
                            'rating' => 5,
                            'image' => '/assets/img/testimonial/testi_4_3.png',
                        ],
                        [
                            'name' => 'Dewi Santoso',
                            'role' => 'Data Analyst',
                            'quote' => 'Artificial Intelligence is transforming our industry. We are exploring AI solutions to automate routine tasks and improve efficiency.',
                            'rating' => 5,
                            'image' => '/assets/img/testimonial/testi_4_4.png',
                        ],
                    ],
                ]
            ],
             // 4. Contact & Map (Legacy)
            [
                'key' => 'contact',
                'config' => [
                    'title' => 'Informasi Kontak',
                    'subtitle' => 'Konsultasi Bersama Harry',
                    'intro_text' => 'Terima kasih atas minat Anda pada solusi Harry & AVer. Tim kami siap mendiskusikan kebutuhan ruang rapat dan kolaborasi organisasi Anda. Silakan hubungi kami melalui saluran berikut:',
                    'phone' => '(+62) 21-50110987',
                    'whatsapp' => '(+62) 851-6299-4602',
                    'email' => 'contact@harryaver.com',
                    'address_office' => 'Jakarta Selatan, DKI Jakarta 12210, Indonesia',
                    'address_representative' => 'Tangerang Selatan, Banten 15318, Indonesia',
                    'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.2831252033!2d106.759478!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%20Selatan!5e0!3m2!1sid!2sid!4v1716968007353!5m2!1sid!2sid',
                    'form_fields' => [
                        [
                            'label' => 'Your Name',
                            'name' => 'name',
                            'type' => 'text',
                            'placeholder' => 'Your Name',
                            'width' => 'col-sm-6',
                            'required' => true,
                            'icon' => '/assets/img/icon/user.svg'
                        ],
                        [
                            'label' => 'Email Address',
                            'name' => 'email',
                            'type' => 'email',
                            'placeholder' => 'Email Address',
                            'width' => 'col-sm-6',
                            'required' => true,
                            'icon' => '/assets/img/icon/mail.svg'
                        ],
                        [
                            'label' => 'Phone Number',
                            'name' => 'number',
                            'type' => 'tel',
                            'placeholder' => 'Phone Number',
                            'width' => 'col-sm-6',
                            'required' => false,
                            'icon' => '/assets/img/icon/call.svg'
                        ],
                        [
                            'label' => 'Subject',
                            'name' => 'subject',
                            'type' => 'select',
                            'options' => 'Quotation,Technical Support,Billing',
                            'placeholder' => 'Select Subject',
                            'width' => 'col-sm-6',
                            'required' => true
                        ],
                        [
                            'label' => 'Your Message',
                            'name' => 'message',
                            'type' => 'textarea',
                            'placeholder' => 'Your Message',
                            'width' => 'col-12',
                            'required' => true,
                            'icon' => '/assets/img/icon/chat.svg'
                        ]
                    ]
                ]
            ]
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
