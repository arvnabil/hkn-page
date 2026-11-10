<?php

namespace Modules\CMS\Http\Controllers;

use Modules\News\Models\News;
use Modules\CMS\Models\Page;
use Modules\SEO\Services\SeoResolver;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\ProductCatalog\Models\Brand;
use App\Http\Controllers\Controller;

class DynamicResolverController extends Controller
{
    /**
     * Resolve the slug to a Page, Brand, or News.
     * Priority: Page > Brand > News
     *
     * Note: Modules\Projects and Modules\Services have been removed from this project.
     */
    public function resolve(string $slug)
    {
        // 1. Check Pages
        $page = Page::where('slug', $slug)->where('status', 'published')->first();
        if ($page) {
            $page->load(['sections' => function ($query) {
                $query->where('is_active', true)->orderBy('position');
            }]);

            $sectionDataResolver = app(\Modules\CMS\Services\SectionDataResolver::class);
            $sections = $page->sections->map(function ($section) use ($sectionDataResolver) {
                return $sectionDataResolver->resolve($section);
            });

            return Inertia::render('DynamicPage', [
                'page' => [
                    'id' => $page->id,
                    'title' => $page->title,
                    'slug' => $page->slug,
                    'show_breadcrumb' => $page->show_breadcrumb,
                    'breadcrumb_image' => $page->breadcrumb_image,
                ],
                'sections' => $sections,
                'seo' => SeoResolver::for($page),
            ]);
        }

        // 2. Check Brands
        $brand = Brand::where('slug', $slug)
            ->orWhere('name', 'LIKE', str_replace('-', ' ', $slug))
            ->first();

        if ($brand || Brand::where('name', 'LIKE', $slug)->exists()) {
            return app(\Modules\ProductCatalog\Http\Controllers\BrandController::class)->show($slug);
        }

        // 3. Check News
        $news = News::with(['categories', 'tags'])->where('slug', $slug)->where('status', 'published')->first();
        if ($news) {
            $resolvePath = function ($path) {
                if (!$path) return null;
                if (str_starts_with($path, 'http')) return $path;
                if (str_starts_with($path, 'assets') || str_starts_with($path, '/assets')) {
                    return str_starts_with($path, '/') ? $path : "/{$path}";
                }
                return "/storage/{$path}";
            };

            $recentPosts = News::where('status', 'published')
                ->where('id', '!=', $news->id)
                ->latest('published_at')
                ->take(3)
                ->get()
                ->map(function ($post) use ($resolvePath) {
                    return [
                        'id'    => $post->id,
                        'title' => $post->title,
                        'date'  => $post->published_at ? $post->published_at->format('d M, Y') : '',
                        'image' => $resolvePath($post->thumbnail),
                        'link'  => route('dynamic.resolve', $post->slug),
                    ];
                });

            $categories = \Modules\News\Models\NewsCategory::withCount('posts')->orderBy('name')->get();
            $tags       = \Modules\News\Models\NewsTag::orderBy('name')->take(20)->get();

            $postData                    = $news->toArray();
            $postData['image']           = $resolvePath($news->thumbnail);
            $postData['thumbnail']       = $postData['image'];
            $postData['content']         = \App\Helpers\SanitizerHelper::sanitizeHtml($news->content);
            $postData['excerpt']         = \App\Helpers\SanitizerHelper::sanitizeHtml($news->excerpt);
            $postData['breadcrumb_image'] = $news->breadcrumb_image;
            $postData['show_breadcrumb'] = $news->show_breadcrumb;

            return Inertia::render('News/Detail', [
                'post'        => $postData,
                'recentPosts' => $recentPosts,
                'categories'  => $categories,
                'tags'        => $tags,
                'seo'         => SeoResolver::for($news),
            ]);
        }

        abort(404);
    }
}
