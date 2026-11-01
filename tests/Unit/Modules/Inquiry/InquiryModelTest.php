<?php

namespace Tests\Unit\Modules\Inquiry;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Inquiry\Models\Inquiry;
use Tests\TestCase;

class InquiryModelTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test inquiry fillable attributes match expected schema.
     */
    public function test_inquiry_has_correct_fillable_fields(): void
    {
        $inquiry = new Inquiry();
        $fillable = $inquiry->getFillable();

        $expected = [
            'name',
            'email',
            'phone',
            'company',
            'room_type',
            'participant_count',
            'current_platform',
            'budget_range',
            'notes',
            'status',
            'admin_notes',
            'ip_address',
        ];

        foreach ($expected as $field) {
            $this->assertContains($field, $fillable, "Field {$field} is missing from fillable");
        }
    }

    /**
     * Test inquiry status options helper.
     */
    public function test_inquiry_status_options_returns_expected_keys(): void
    {
        $options = Inquiry::statusOptions();

        $this->assertArrayHasKey('new', $options);
        $this->assertArrayHasKey('in_review', $options);
        $this->assertArrayHasKey('contacted', $options);
        $this->assertArrayHasKey('follow_up', $options);
        $this->assertArrayHasKey('closed', $options);
    }

    /**
     * Test inquiry room type options helper.
     */
    public function test_inquiry_room_type_options_returns_expected_keys(): void
    {
        $options = Inquiry::roomTypeOptions();

        $this->assertArrayHasKey('huddle', $options);
        $this->assertArrayHasKey('medium', $options);
        $this->assertArrayHasKey('boardroom', $options);
        $this->assertArrayHasKey('auditorium', $options);
    }

    /**
     * Test inquiry can transition through all valid status values.
     */
    public function test_inquiry_can_update_status(): void
    {
        $inquiry = Inquiry::create([
            'name'      => 'Ahmad Zaki',
            'email'     => 'zaki@techcorp.com',
            'phone'     => '0812345678',
            'company'   => 'TechCorp',
            'room_type' => 'medium',
        ]);

        $this->assertEquals('new', $inquiry->status);

        $statuses = ['in_review', 'contacted', 'follow_up', 'closed'];

        foreach ($statuses as $newStatus) {
            $inquiry->update(['status' => $newStatus]);
            $inquiry->refresh();
            $this->assertEquals($newStatus, $inquiry->status);
        }
    }

    /**
     * Test admin notes can be added and updated.
     */
    public function test_inquiry_can_store_admin_notes(): void
    {
        $inquiry = Inquiry::create([
            'name'        => 'Dewi Lestari',
            'email'       => 'dewi@consulting.co.id',
            'phone'       => '0813456789',
            'company'     => 'Lestari Consulting',
            'room_type'   => 'huddle',
            'admin_notes' => 'Klien minta dikirimkan brosur AVer VB342 Pro via WA.',
        ]);

        $this->assertEquals('Klien minta dikirimkan brosur AVer VB342 Pro via WA.', $inquiry->admin_notes);

        $inquiry->update([
            'admin_notes' => 'Sudah dikontak. Jadwal PoC tanggal 5 November.',
        ]);

        $inquiry->refresh();
        $this->assertEquals('Sudah dikontak. Jadwal PoC tanggal 5 November.', $inquiry->admin_notes);
    }
}

