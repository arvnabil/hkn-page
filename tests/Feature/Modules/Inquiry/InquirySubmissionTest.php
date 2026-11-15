<?php

namespace Tests\Feature\Modules\Inquiry;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Inquiry\Models\Inquiry;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Modules\FormBuilder\Models\FormSubmission;
use Modules\FormBuilder\Services\FormSecurity;

class InquirySubmissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.recaptcha.key' => null, 'services.recaptcha.secret' => null]);
    }

    private function validPayload(): array
    {
        return ['name' => 'Uji Integrasi', 'email' => 'integration@example.test', 'phone' => '081234567890',
            'company' => 'QA Test', 'room_type' => 'medium', 'page_slug' => '/penawaran'];
    }

    public function test_duplicate_form_inbox_menu_is_hidden(): void
    {
        $this->assertFalse(\Modules\FormBuilder\Filament\Resources\FormSubmissionResource::shouldRegisterNavigation());
        $page = new \Modules\Inquiry\Filament\Resources\InquiryResource\Pages\ListInquiries;
        $method = new \ReflectionMethod($page, 'getHeaderWidgets');
        $this->assertContains(\Modules\FormBuilder\Filament\Widgets\FormSecurityOverview::class, $method->invoke($page));
    }

    public function test_json_submission_is_linked_to_inbox_and_logged_only_after_persistence(): void
    {
        $this->postJson('/penawaran', $this->validPayload())->assertCreated()->assertJson(['success' => true]);
        $inquiry = Inquiry::firstOrFail();
        $submission = FormSubmission::firstOrFail();
        $this->assertSame($inquiry->id, $submission->inquiry_id);
        $this->assertSame('inquiry', $submission->form_key);
        $this->assertSame($inquiry->email, $submission->payload['email']);
        $this->assertArrayNotHasKey('recaptcha_token', $submission->payload);
        $this->assertDatabaseHas('form_security_logs', ['form_key' => 'inquiry', 'decision' => 'allow']);
    }

    public function test_honeypot_blocks_submission_and_records_spam_without_creating_a_lead(): void
    {
        $this->postJson('/penawaran', $this->validPayload() + ['website' => 'spam.test'])
            ->assertUnprocessable()->assertJsonValidationErrors('security');
        $this->assertDatabaseCount('inquiries', 0);
        $this->assertDatabaseCount('form_submissions', 0);
        $this->assertDatabaseHas('form_security_logs', ['decision' => 'block', 'reason' => 'honeypot_triggered']);
    }

    public function test_form_view_is_deduplicated_per_session_and_page(): void
    {
        $payload = ['form_key' => 'inquiry', 'page_slug' => '/penawaran'];
        $this->postJson('/form/view', $payload)->assertOk();
        $this->postJson('/form/view', $payload)->assertOk();
        $this->assertDatabaseCount('form_analytics', 1);
        $this->postJson('/form/view', ['form_key' => 'inquiry', 'page_slug' => '/'])->assertOk();
        $this->assertDatabaseCount('form_analytics', 2);
    }

    public function test_captcha_token_is_required_and_verified_when_configured(): void
    {
        config(['services.recaptcha.key' => 'public-test-key', 'services.recaptcha.secret' => 'private-test-secret']);
        Http::fake(['www.google.com/recaptcha/api/siteverify' => Http::response([
            'success' => true, 'score' => 0.9, 'action' => 'penawaran', 'hostname' => 'localhost',
        ])]);
        $this->postJson('/penawaran', $this->validPayload())->assertUnprocessable();
        Http::assertNothingSent();
        $this->postJson('/penawaran', $this->validPayload() + ['recaptcha_token' => 'valid-token'])
            ->assertCreated();
        $this->assertDatabaseCount('inquiries', 1);
        $this->assertArrayNotHasKey('recaptcha_token', FormSubmission::firstOrFail()->payload);
        $public = app(FormSecurity::class)->publicConfiguration('inquiry');
        $this->assertArrayNotHasKey('secret', $public);
        $this->assertStringNotContainsString('private-test-secret', json_encode($public));
    }

    public function test_captcha_rejection_does_not_create_inquiry_or_inbox_data(): void
    {
        config(['services.recaptcha.key' => 'key', 'services.recaptcha.secret' => 'secret']);
        Http::fake(['*' => Http::response(['success' => true, 'score' => 0.9, 'action' => 'wrong-form', 'hostname' => 'localhost'])]);
        $this->postJson('/penawaran', $this->validPayload() + ['recaptcha_token' => 'token'])->assertUnprocessable();
        $this->assertDatabaseCount('inquiries', 0);
        $this->assertDatabaseCount('form_submissions', 0);
        $this->assertDatabaseHas('form_security_logs', ['decision' => 'block', 'reason' => 'captcha_verification_failed']);
    }

    public function test_inbox_failure_rolls_back_the_inquiry(): void
    {
        $this->partialMock(FormSecurity::class, function ($mock) {
            $mock->shouldReceive('log')->once()->andThrow(new \RuntimeException('Simulated persistence failure'));
        });
        $this->postJson('/penawaran', $this->validPayload())->assertStatus(500);
        $this->assertDatabaseCount('inquiries', 0);
        $this->assertDatabaseCount('form_submissions', 0);
    }

    public function test_syncing_historical_inquiries_is_idempotent_and_does_not_fake_analytics(): void
    {
        Inquiry::create(\Illuminate\Support\Arr::except($this->validPayload(), 'page_slug'));
        $this->artisan('forms:sync-inquiries')->assertSuccessful();
        $this->artisan('forms:sync-inquiries')->assertSuccessful();
        $this->assertDatabaseCount('inquiries', 1);
        $this->assertDatabaseCount('form_submissions', 1);
        $this->assertDatabaseCount('form_analytics', 0);
        $this->assertDatabaseCount('form_security_logs', 0);
    }

    public function test_generic_endpoint_cannot_spoof_an_inquiry_entry(): void
    {
        $this->postJson('/form/submit', ['form_key' => 'inquiry', 'fields' => $this->validPayload()])
            ->assertUnprocessable()->assertJsonValidationErrors('form_key');
        $this->assertDatabaseCount('form_submissions', 0);
    }

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

