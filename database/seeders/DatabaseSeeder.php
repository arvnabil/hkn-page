<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'admin@harryaver.com'],
            [
                'name' => 'Harry Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('123123123'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Ensure the seeded account receives the administrator role required
        // by User::canAccessPanel() before it tries to sign in to Filament.
        $this->call(RolesAndPermissionsSeeder::class);

        // Legacy root seeders have been migrated to their respective modules
        // and will be executed by the auto-discovery loop below.

        // Auto-discover and run Module seeders
        $modules = glob(base_path('Modules/*'), GLOB_ONLYDIR);
        foreach ($modules as $modulePath) {
            $moduleName = basename($modulePath);
            $seederClass = "Modules\\{$moduleName}\\Database\\Seeders\\{$moduleName}DatabaseSeeder";

            if (class_exists($seederClass)) {
                $this->call($seederClass);
            }
        }
    }
}
