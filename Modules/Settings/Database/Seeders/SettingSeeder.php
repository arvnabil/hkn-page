<?php

namespace Modules\Settings\Database\Seeders;

use Modules\Settings\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'seo_default_title',
                'value' => 'Harry - AVer B2B Technical Advisor & Video Conference Solutions',
                'label' => 'Default Meta Title',
                'type' => 'text',
            ],
            [
                'key' => 'seo_default_description',
                'value' => 'Solusi video conference dan kamera AI tracking AVer resmi untuk ruang rapat korporat dan institusi bersama Harry.',
                'label' => 'Default Meta Description',
                'type' => 'textarea',
            ],
            [
                'key' => 'seo_default_og_image',
                'value' => null,
                'label' => 'Default OG Image',
                'type' => 'image',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
