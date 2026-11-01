<?php

namespace Modules\Inquiry\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Inquiry\Models\Inquiry;

class InquirySeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');

        $roomTypes    = ['huddle', 'medium', 'boardroom', 'auditorium'];
        $platforms    = ['teams', 'zoom', 'meet', 'other'];
        $statuses     = ['new', 'in_review', 'contacted', 'follow_up', 'closed'];
        $budgetRanges = ['< Rp 50 Juta', 'Rp 50-100 Juta', 'Rp 100-200 Juta', '> Rp 200 Juta'];

        $samples = [
            [
                'name'              => 'Budi Santoso',
                'email'             => 'budi.santoso@ptabc.co.id',
                'phone'             => '081234567890',
                'company'           => 'PT ABC Teknologi',
                'room_type'         => 'boardroom',
                'participant_count' => 20,
                'current_platform'  => 'teams',
                'budget_range'      => 'Rp 100-200 Juta',
                'notes'             => 'Kami memerlukan solusi video conferencing untuk boardroom utama kami yang digunakan untuk rapat direksi.',
                'status'            => 'new',
                'admin_notes'       => null,
            ],
            [
                'name'              => 'Siti Rahayu',
                'email'             => 'siti@globalindo.com',
                'phone'             => '082345678901',
                'company'           => 'PT Global Indo',
                'room_type'         => 'huddle',
                'participant_count' => 6,
                'current_platform'  => 'zoom',
                'budget_range'      => '< Rp 50 Juta',
                'notes'             => 'Butuh setup untuk 3 ruang huddle di kantor kami di Jakarta Selatan.',
                'status'            => 'in_review',
                'admin_notes'       => 'Sudah dihubungi via email, menunggu jadwal demo.',
            ],
            [
                'name'              => 'Andi Wijaya',
                'email'             => 'andi.w@manufaktur.id',
                'phone'             => '083456789012',
                'company'           => 'CV Manufaktur Indonesia',
                'room_type'         => 'medium',
                'participant_count' => 15,
                'current_platform'  => 'meet',
                'budget_range'      => 'Rp 50-100 Juta',
                'notes'             => 'Ingin upgrade dari sistem lama, saat ini menggunakan Google Meet namun kualitas audio kurang memuaskan.',
                'status'            => 'contacted',
                'admin_notes'       => 'Demo dijadwalkan 5 Nov 2026.',
            ],
            [
                'name'              => 'Dewi Kusuma',
                'email'             => 'dewi.kusuma@universitasmaju.ac.id',
                'phone'             => '084567890123',
                'company'           => 'Universitas Maju Bersama',
                'room_type'         => 'auditorium',
                'participant_count' => 200,
                'current_platform'  => 'other',
                'budget_range'      => '> Rp 200 Juta',
                'notes'             => 'Keperluan aula utama untuk wisuda hybrid dan seminar nasional.',
                'status'            => 'follow_up',
                'admin_notes'       => 'Sudah kirim proposal, menunggu persetujuan anggaran.',
            ],
            [
                'name'              => 'Rizky Pratama',
                'email'             => 'rizky@startup.io',
                'phone'             => '085678901234',
                'company'           => 'Startup Digital Indonesia',
                'room_type'         => 'huddle',
                'participant_count' => 4,
                'current_platform'  => 'zoom',
                'budget_range'      => '< Rp 50 Juta',
                'notes'             => 'Startup kami butuh solusi video call yang profesional untuk meeting dengan investor.',
                'status'            => 'closed',
                'admin_notes'       => 'Deal berhasil! Pembelian AVer VC520 Pro x2 unit.',
            ],
        ];

        foreach ($samples as $sample) {
            Inquiry::create($sample);
        }
    }
}
