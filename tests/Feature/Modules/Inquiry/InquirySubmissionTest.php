<?php

namespace Tests\Feature\Modules\Inquiry;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Inquiry\Models\Inquiry;
use Tests\TestCase;

class InquirySubmissionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test guest can submit a valid inquiry form.
     */
    public function test_guest_can_submit_inquiry_form(): void
    {
        $payload = [
            'name'              => 'Budi Santoso',
            'email'             => 'budi@ptmaju.co.id',
            'phone'             => '+6281234567890',
            'company'           => 'PT Maju Bersama',
            'room_type'         => 'medium',
            'participant_count' => 10,
            'current_platform'  => 'teams',
            'budget_range'      => 'Rp 50 - 100 Juta',
            'notes'             => 'Kamera konferensi AVer untuk ruang rapat direksi lantai 3.',
        ];

        $response = $this->post(route('inquiry.store'), $payload);

        $response->assertStatus(302);
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('inquiries', [
            'name'       => 'Budi Santoso',
            'email'      => 'budi@ptmaju.co.id',
            'company'    => 'PT Maju Bersama',
            'room_type'  => 'medium',
            'status'     => 'new',
        ]);
    }

    /**
     * Test inquiry validation fails when name is missing.
     */
    public function test_inquiry_requires_name(): void
    {
        $payload = [
            'email'     => 'test@company.com',
            'phone'     => '08123456789',
            'company'   => 'PT Test',
            'room_type' => 'huddle',
        ];

        $response = $this->post(route('inquiry.store'), $payload);
        $response->assertSessionHasErrors('name');
        $this->assertEquals(0, Inquiry::count());
    }

    /**
     * Test inquiry validation fails when email is invalid.
     */
    public function test_inquiry_requires_valid_email(): void
    {
        $payload = [
            'name'      => 'John Doe',
            'email'     => 'not-an-email',
            'phone'     => '08123456789',
            'company'   => 'PT Test',
            'room_type' => 'boardroom',
        ];

        $response = $this->post(route('inquiry.store'), $payload);
        $response->assertSessionHasErrors('email');
        $this->assertEquals(0, Inquiry::count());
    }

    /**
     * Test inquiry validation fails when phone is missing.
     */
    public function test_inquiry_requires_phone(): void
    {
        $payload = [
            'name'      => 'John Doe',
            'email'     => 'john@company.com',
            'company'   => 'PT Test',
            'room_type' => 'boardroom',
        ];

        $response = $this->post(route('inquiry.store'), $payload);
        $response->assertSessionHasErrors('phone');
        $this->assertEquals(0, Inquiry::count());
    }

    /**
     * Test inquiry validation fails when company is missing.
     */
    public function test_inquiry_requires_company(): void
    {
        $payload = [
            'name'      => 'John Doe',
            'email'     => 'john@company.com',
            'phone'     => '08123456789',
            'room_type' => 'huddle',
        ];

        $response = $this->post(route('inquiry.store'), $payload);
        $response->assertSessionHasErrors('company');
        $this->assertEquals(0, Inquiry::count());
    }

    /**
     * Test inquiry validation fails when room_type is invalid.
     */
    public function test_inquiry_requires_valid_room_type(): void
    {
        $payload = [
            'name'      => 'John Doe',
            'email'     => 'john@company.com',
            'phone'     => '08123456789',
            'company'   => 'PT Test',
            'room_type' => 'invalid_room_type',
        ];

        $response = $this->post(route('inquiry.store'), $payload);
        $response->assertSessionHasErrors('room_type');
        $this->assertEquals(0, Inquiry::count());
    }

    /**
     * Test inquiry status defaults to 'new'.
     */
    public function test_inquiry_status_defaults_to_new(): void
    {
        $inquiry = Inquiry::create([
            'name'      => 'Siti Rahma',
            'email'     => 'siti@holding.id',
            'phone'     => '0811998877',
            'company'   => 'Holding Nusantara',
            'room_type' => 'auditorium',
        ]);

        $this->assertEquals('new', $inquiry->status);
    }

    /**
     * Test all fields are stored accurately in database.
     */
    public function test_inquiry_stores_all_fields_correctly(): void
    {
        $payload = [
            'name'              => 'Rian Firmansyah',
            'email'             => 'rian@fintech.co.id',
            'phone'             => '+62817889900',
            'company'           => 'PT Fintech Solusi',
            'room_type'         => 'boardroom',
            'participant_count' => 20,
            'current_platform'  => 'zoom',
            'budget_range'      => 'Rp 100 - 200 Juta',
            'notes'             => 'Butuh integrasi dual-display dan speaker tracking.',
        ];

        $this->post(route('inquiry.store'), $payload);

        $saved = Inquiry::first();
        $this->assertNotNull($saved);
        $this->assertEquals('Rian Firmansyah', $saved->name);
        $this->assertEquals('rian@fintech.co.id', $saved->email);
        $this->assertEquals('+62817889900', $saved->phone);
        $this->assertEquals('PT Fintech Solusi', $saved->company);
        $this->assertEquals('boardroom', $saved->room_type);
        $this->assertEquals(20, $saved->participant_count);
        $this->assertEquals('zoom', $saved->current_platform);
        $this->assertEquals('Rp 100 - 200 Juta', $saved->budget_range);
        $this->assertEquals('Butuh integrasi dual-display dan speaker tracking.', $saved->notes);
        $this->assertEquals('new', $saved->status);
    }
}

