<?php

namespace Modules\Settings\Database\Seeders;

use Modules\Settings\Models\Setting;
use Illuminate\Database\Seeder;

class LocalBusinessSettingsSeeder extends Seeder
{
    /**
     * Seed the settings table with LocalBusiness data for SEO Schema.
     */
    public function run(): void
    {
        $settings = [
            // Company Identity
            ['key' => 'company_name', 'value' => 'Harry AVer Solutions', 'label' => 'Company Name'],
            ['key' => 'company_tagline', 'value' => 'B2B Technical Advisor & Video Conference Specialist', 'label' => 'Company Tagline'],
            
            // Contact Information
            ['key' => 'company_phone', 'value' => '+62 21 5011 0987', 'label' => 'Company Phone'],
            ['key' => 'company_email', 'value' => 'contact@harryaver.com', 'label' => 'Company Email'],
            ['key' => 'company_whatsapp', 'value' => '+62 851 6299 4602', 'label' => 'Company WhatsApp'],
            
            // Address
            ['key' => 'company_address', 'value' => 'Jakarta Selatan', 'label' => 'Company Address'],
            ['key' => 'company_city', 'value' => 'Jakarta Selatan', 'label' => 'Company City'],
            ['key' => 'company_province', 'value' => 'DKI Jakarta', 'label' => 'Company Province'],
            ['key' => 'company_postal_code', 'value' => '12210', 'label' => 'Company Postal Code'],
            ['key' => 'company_country', 'value' => 'Indonesia', 'label' => 'Company Country'],
            
            // Branding
            ['key' => 'company_logo', 'value' => 'logos/harry-logo.png', 'label' => 'Company Logo'],
            
            // Social Media (for Organization sameAs)
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/harryaver', 'label' => 'Facebook URL'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/harryaver', 'label' => 'Instagram URL'],
            ['key' => 'social_linkedin', 'value' => 'https://linkedin.com/company/harryaver', 'label' => 'LinkedIn URL'],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/harryaver', 'label' => 'Twitter URL'],
            ['key' => 'social_youtube', 'value' => 'https://youtube.com/@harryaver', 'label' => 'YouTube URL'],
            
            // Opening Hours (JSON format for flexibility)
            ['key' => 'company_opening_hours', 'value' => json_encode([
                ['days' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 'opens' => '09:00', 'closes' => '17:00'],
            ]), 'label' => 'Opening Hours'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'label' => $setting['label'] ?? null,
                ]
            );
        }

        $this->command->info('LocalBusiness settings seeded successfully!');
    }
}
