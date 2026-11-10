<?php

namespace Modules\CMS\Http\Controllers;

use Modules\CMS\Models\Page;
use Modules\CMS\Services\SectionDataResolver;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class PageController extends Controller
{
    protected $resolver;

    public function __construct(SectionDataResolver $resolver)
    {
        $this->resolver = $resolver;
    }

    public function resolveHomepage()
    {
        $homepage = Page::where('is_homepage', true)
            ->where('status', 'published')
            ->with(['sections' => function ($query) {
                $query->where('is_active', true)->orderBy('position');
            }, 'seo'])
            ->first();

        if (!$homepage) {
            // Fallback to static Home — legacy modules (Projects, Services, Clients) have been removed.
            return Inertia::render('Home', [
                'articles' => [],
                'seo'      => \Modules\SEO\Services\SeoResolver::staticPage('Home'),
            ]);
        }

        $sectionDataResolver = app(SectionDataResolver::class);
        $sections = $homepage->sections->map(function ($section) use ($sectionDataResolver) {
            return $sectionDataResolver->resolve($section);
        });



        return Inertia::render('DynamicPage', [
            'page' => [
                'id' => $homepage->id,
                'title' => $homepage->title,
                'slug' => $homepage->slug,
                'show_breadcrumb' => $homepage->show_breadcrumb,
                'breadcrumb_image' => $homepage->breadcrumb_image,
            ],
            'sections' => $sections,
            'seo' => \Modules\SEO\Services\SeoResolver::for($homepage),
        ]);
    }

    public function show($slug)
    {
        $page = Page::where('slug', $slug)
            ->where('status', 'published')
            ->with(['sections' => function ($query) {
                // Eager load only active sections
                $query->where('is_active', true)->orderBy('position');
            }, 'seo'])
            ->firstOrFail();

        // 1. Prepare Inertia props
        $sectionDataResolver = app(SectionDataResolver::class);
        $sections = $page->sections->map(function ($section) use ($sectionDataResolver) {
            return $sectionDataResolver->resolve($section);
        });

        // 2. Render View
        // DEBUG: Check resolved data for contact section
        // dd($sections->toArray());

        return Inertia::render('DynamicPage', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'show_breadcrumb' => $page->show_breadcrumb,
                'breadcrumb_image' => $page->breadcrumb_image,
            ],
            'sections' => $sections,
            'seo' => \Modules\SEO\Services\SeoResolver::for($page),
        ]);
    }
}
