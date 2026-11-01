<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\CMS\Models\Page;
use Modules\CMS\Models\PageSection;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PageBuilderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'administrator', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'viewer', 'guard_name' => 'web']);
    }

    protected function createAdminUser(): User
    {
        $user = User::create([
            'name'              => 'Harry Admin',
            'email'             => 'admin@aver-advisor.com',
            'password'          => bcrypt('secret123'),
            'email_verified_at' => now(),
            'is_active'         => true,
        ]);

        $user->assignRole('administrator');

        return $user;
    }

    /**
     * Guest cannot access page builder without auth.
     */
    public function test_guest_cannot_access_page_builder(): void
    {
        $page = Page::create([
            'title'  => 'Test Page',
            'slug'   => 'test-page',
            'type'   => 'standard',
            'status' => 'draft',
        ]);

        $response = $this->get("/activioncms/page-builder/{$page->id}");

        $response->assertStatus(302);
    }

    /**
     * Admin can view PageBuilder Inertia interface.
     */
    public function test_admin_can_access_page_builder_editor(): void
    {
        $admin = $this->createAdminUser();

        $page = Page::create([
            'title'  => 'Landing Solusi Enterprise',
            'slug'   => 'landing-enterprise',
            'type'   => 'standard',
            'status' => 'draft',
        ]);

        PageSection::create([
            'page_id'     => $page->id,
            'section_key' => 'hero',
            'position'    => 0,
            'is_active'   => true,
            'config'      => [
                'title' => 'Solusi Kamera PTZ Enterprise AVer',
            ],
        ]);

        $response = $this->actingAs($admin)->get("/activioncms/page-builder/{$page->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert
            ->component('Activioncms/PageBuilder/PageBuilder')
            ->has('page')
            ->has('sections', 1)
        );
    }

    /**
     * Admin can save and persist sections via PageBuilder API.
     */
    public function test_admin_can_save_sections_via_page_builder(): void
    {
        $admin = $this->createAdminUser();

        $page = Page::create([
            'title'  => 'Showcase Ruang Rapat',
            'slug'   => 'showcase-ruang-rapat',
            'type'   => 'standard',
            'status' => 'draft',
        ]);

        $payload = [
            'status'          => 'published',
            'show_breadcrumb' => true,
            'sections'        => [
                [
                    'id'          => 'new-1',
                    'section_key' => 'hero',
                    'position'    => 0,
                    'is_active'   => true,
                    'config'      => json_encode([
                        'badge' => 'AVer INDONESIA',
                        'title' => 'Solusi Video Conference Terbaik',
                    ]),
                ],
                [
                    'id'          => 'new-2',
                    'section_key' => 'blueprint',
                    'position'    => 1,
                    'is_active'   => true,
                    'config'      => json_encode([
                        'default_room' => 'boardroom',
                    ]),
                ],
                [
                    'id'          => 'new-3',
                    'section_key' => 'inquiry',
                    'position'    => 2,
                    'is_active'   => true,
                    'config'      => json_encode([
                        'title' => 'Hubungi Expert AVer',
                    ]),
                ],
            ],
        ];

        $response = $this->actingAs($admin)
            ->from("/activioncms/page-builder/{$page->id}")
            ->post("/activioncms/page-builder/{$page->id}/save", $payload);

        $response->assertRedirect("/activioncms/page-builder/{$page->id}");

        $this->assertDatabaseHas('pages', [
            'id'     => $page->id,
            'status' => 'published',
        ]);

        $this->assertDatabaseCount('page_sections', 3);
        $this->assertDatabaseHas('page_sections', [
            'page_id'     => $page->id,
            'section_key' => 'hero',
            'position'    => 0,
        ]);
        $this->assertDatabaseHas('page_sections', [
            'page_id'     => $page->id,
            'section_key' => 'blueprint',
            'position'    => 1,
        ]);
        $this->assertDatabaseHas('page_sections', [
            'page_id'     => $page->id,
            'section_key' => 'inquiry',
            'position'    => 2,
        ]);
    }

    /**
     * Admin can delete sections by removing them from payload.
     */
    public function test_admin_can_remove_sections_when_saving(): void
    {
        $admin = $this->createAdminUser();

        $page = Page::create([
            'title'  => 'Page with Removable Sections',
            'slug'   => 'removable-page',
            'type'   => 'standard',
            'status' => 'published',
        ]);

        $sec1 = PageSection::create([
            'page_id'     => $page->id,
            'section_key' => 'hero',
            'position'    => 0,
            'is_active'   => true,
            'config'      => ['title' => 'Keep Me'],
        ]);

        $sec2 = PageSection::create([
            'page_id'     => $page->id,
            'section_key' => 'faq',
            'position'    => 1,
            'is_active'   => true,
            'config'      => ['title' => 'Delete Me'],
        ]);

        // Submit only sec1
        $payload = [
            'status'   => 'published',
            'sections' => [
                [
                    'id'          => $sec1->id,
                    'section_key' => 'hero',
                    'position'    => 0,
                    'is_active'   => true,
                    'config'      => json_encode(['title' => 'Keep Me']),
                ],
            ],
        ];

        $response = $this->actingAs($admin)
            ->post("/activioncms/page-builder/{$page->id}/save", $payload);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('page_sections', ['id' => $sec1->id]);
        $this->assertDatabaseMissing('page_sections', ['id' => $sec2->id]);
    }

    /**
     * Dynamic resolver serves published page with sections via DynamicPage Inertia component.
     */
    public function test_dynamic_resolver_serves_published_page(): void
    {
        $page = Page::create([
            'title'           => 'Solusi Ruang Hybrid AVer',
            'slug'            => 'aver-smart-room',
            'type'            => 'standard',
            'status'          => 'published',
            'show_breadcrumb' => true,
        ]);

        PageSection::create([
            'page_id'     => $page->id,
            'section_key' => 'hero',
            'position'    => 0,
            'is_active'   => true,
            'config'      => [
                'title' => 'Ruang Hybrid Masa Depan',
            ],
        ]);

        $response = $this->get('/aver-smart-room');

        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert
            ->component('DynamicPage')
            ->has('page')
            ->where('page.title', 'Solusi Ruang Hybrid AVer')
            ->has('sections', 1)
        );
    }
}
