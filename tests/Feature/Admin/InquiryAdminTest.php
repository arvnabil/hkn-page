<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Inquiry\Models\Inquiry;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class InquiryAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create standard roles for Spatie
        Role::firstOrCreate(['name' => 'administrator', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'viewer', 'guard_name' => 'web']);
    }

    protected function createAdminUser(): User
    {
        $user = User::create([
            'name'      => 'Harry Kusumo',
            'email'     => 'harry@aver-advisor.com',
            'password'  => bcrypt('secret123'),
            'is_active' => true,
        ]);

        $user->assignRole('administrator');

        return $user;
    }

    /**
     * Test unauthenticated guest cannot access the Inquiry admin resource.
     */
    public function test_guest_cannot_access_filament_inquiry_resource(): void
    {
        $response = $this->get('/activioncms/inquiries');

        // Should redirect to Filament login
        $response->assertStatus(302);
        $response->assertRedirect('/activioncms/login');
    }

    /**
     * Test active administrator can access the Filament panel.
     */
    public function test_admin_can_access_filament_dashboard(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->actingAs($admin)->get('/activioncms');

        $response->assertStatus(200);
    }

    /**
     * Test active administrator can view the Inquiries list.
     */
    public function test_admin_can_view_inquiries_list(): void
    {
        $admin = $this->createAdminUser();

        Inquiry::create([
            'name'      => 'Klien PT ABC',
            'email'     => 'pic@ptabc.co.id',
            'phone'     => '0812998877',
            'company'   => 'PT ABC Indonesia',
            'room_type' => 'boardroom',
            'status'    => 'new',
        ]);

        $response = $this->actingAs($admin)->get('/activioncms/inquiries');

        $response->assertStatus(200);
        $response->assertSee('PT ABC Indonesia');
    }

    /**
     * Test inactive user cannot access the panel even with administrator role.
     */
    public function test_inactive_user_cannot_access_panel(): void
    {
        $user = User::create([
            'name'      => 'Inactive Admin',
            'email'     => 'inactive@company.com',
            'password'  => bcrypt('secret123'),
            'is_active' => false,
        ]);

        $user->assignRole('administrator');

        $response = $this->actingAs($user)->get('/activioncms');

        $response->assertStatus(403);
    }

    /**
     * Test admin can update inquiry status and internal notes.
     */
    public function test_inquiry_can_be_updated_by_admin(): void
    {
        $inquiry = Inquiry::create([
            'name'      => 'PT Maju Terus',
            'email'     => 'procurement@majuterus.com',
            'phone'     => '08122334455',
            'company'   => 'PT Maju Terus',
            'room_type' => 'medium',
            'status'    => 'new',
        ]);

        $inquiry->update([
            'status'      => 'contacted',
            'admin_notes' => 'Sudah ditelepon, tertarik paket CAM550 + FONE540.',
        ]);

        $this->assertDatabaseHas('inquiries', [
            'id'          => $inquiry->id,
            'status'      => 'contacted',
            'admin_notes' => 'Sudah ditelepon, tertarik paket CAM550 + FONE540.',
        ]);
    }
}

