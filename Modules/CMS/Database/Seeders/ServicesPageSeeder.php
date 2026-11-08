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

        // 3. Define Sections
        $sections = [
            // 1. Service List (Breadcrumb handled by Page model)
            [
                'section_key' => 'service_list',
                'config' => [
                    'title' => 'Layanan Konsultasi & Integrasi Audio Visual AVer',
                    'subtitle' => 'Layanan Profesional Kami',
                    'description' => "Harry menghadirkan rangkaian layanan terpadu mulai dari asesmen denah ruang, pengujian akustik & FOV kamera, hingga pendampingan instalasi perangkat video conference AVer.",
                    'limit' => 12,
                    'order' => 'asc',
                ],
            ],
            // 2. Solution
            [
                'section_key' => 'service_solution',
                'config' => [
                    'title' => 'Solusi Ruang Rapat Cerdas',
                    'subtitle' => 'Arsitektur Ruang',
                    'description' => "Bersama Harry dan teknologi AVer, kami merancang ruang kolaborasi cerdas yang mengintegrasikan kamera AI auto tracking, mikrofon beamforming, dan tampilan interaktif untuk pengalaman meeting terbaik.",
                    'btn_text' => 'Konsultasi Ruang Sekarang',
                    'btn_url' => '/contact',
                    'images' => [
                        '/assets/img/choose/choose_4_1.jpg',
                        '/assets/img/choose/choose_4_2.jpg',
                        '/assets/img/choose/choose_4_3.jpg',
                    ],
                    'features' => [
                        ['text' => 'Huddle & Medium Room Solution'],
                        ['text' => 'Boardroom & Executive Conference'],
                        ['text' => 'Auditorium & Townhall PTZ System'],
                        ['text' => 'Smart Classroom & Distance Learning'],
                        ['text' => 'Akustik & Mikrofon Beamforming'],
                    ],
                ],
            ],
            // 3. CTA
            [
                'section_key' => 'service_cta',
                'config' => [
                    'title' => 'Rencanakan Ruang Rapat Anda Bersama Harry',
                    'subtitle' => 'Konsultasi Spesifikasi & Penawaran',
                    'description' => "Diskusikan kebutuhan ruang rapat Anda untuk rekomendasi spesifikasi teknis dan penawaran resmi perangkat AVer.",
                    'btn_text' => 'Hubungi Kami via WhatsApp',
                    'btn_url' => 'https://wa.me/6285162994602',
                    'bg_image' => '/assets/img/normal/cta-img-6.jpg',
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
