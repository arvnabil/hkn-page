<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

// ─── Auth ───────────────────────────────────────────────
Route::get('/login', function () {
    return redirect()->route('filament.activioncms.auth.login');
})->name('login');

Route::get('/dashboard', function () {
    return redirect('/activioncms');
})->name('dashboard');

Route::get('/admin', function () {
    return redirect('/activioncms');
});

// ─── Harry Public Pages (AVer Solutions Advisor) ──────────
Route::get('/', function () {
    $articles = json_decode(file_get_contents(resource_path('js/data/articles.json')), true) ?: [];
    $imagesBySlug = DB::table('news')
        ->whereIn('slug', array_column($articles, 'slug'))
        ->pluck('featured_image', 'slug');

    foreach ($articles as &$article) {
        $image = $imagesBySlug[$article['slug']] ?? null;
        if ($image) {
            $article['thumbnail'] = str_starts_with($image, 'http')
                ? $image
                : asset('storage/'.ltrim($image, '/'));
        }
    }
    unset($article);

    return Inertia::render('Home', ['articles' => $articles]);
})->name('home');

Route::get('/tentang', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/solusi', function () {
    return Inertia::render('Solutions');
})->name('solutions');

Route::get('/penawaran', function () {
    return Inertia::render('Inquiry');
})->name('inquiry');

Route::get('/produk', function () {
    return Inertia::render('Products/Index');
})->name('products.index');

Route::get('/produk/{id}', function ($id) {
    return Inertia::render('Products/Show', ['id' => $id]);
})->name('products.show');

Route::get('/perbandingan', function () {
    return Inertia::render('Comparison');
})->name('comparison');
Route::redirect('/komparasi', '/perbandingan');

Route::get('/artikel', function () {
    return Inertia::render('Articles/Index');
})->name('articles.index');

Route::get('/artikel/{slug}', function ($slug) {
    $articles = json_decode(file_get_contents(resource_path('js/data/articles.json')), true) ?: [];
    $article = collect($articles)->first(fn ($item) => ($item['slug'] ?? null) === $slug);

    // Keep old links such as /artikel/681 working, then canonicalize them.
    if (!$article && ctype_digit((string) $slug)) {
        $article = collect($articles)->first(fn ($item) => (string) ($item['id'] ?? '') === (string) $slug);

        if ($article) {
            return redirect()->route('articles.show', ['slug' => $article['slug']], 301);
        }
    }

    abort_unless($article, 404);

    return Inertia::render('Articles/Show', ['article' => $article]);
})->name('articles.show');

Route::get('/panduan', function () {
    return Inertia::render('Guides/Index');
})->name('guides.index');

Route::get('/panduan/{slug}', function ($slug) {
    return Inertia::render('Guides/Show', ['slug' => $slug]);
})->name('guides.show');

// ─── Search ─────────────────────────────────────────────
// Moved to Modules/Search/Routes/web.php

// ─── Form Submission ────────────────────────────────────
// Moved to Modules/FormBuilder/Routes/web.php

// ─── WhatsApp ───────────────────────────────────────────
// Moved to Modules/WhatsApp/Routes/web.php

// ─── News ───────────────────────────────────────────────
// Moved to Modules/News/Routes/web.php

// ─── Brand Product List ─────────────────────────────────
Route::get('/{brandSlug}/products', [\Modules\ProductCatalog\Http\Controllers\BrandController::class, 'productList'])->name('brand.products');

// ─── Page Builder (Admin) ───────────────────────────────
// Moved to Modules/CMS/Routes/web.php

// ─── Catch-All Dynamic Pages (MUST BE LAST) ────────────────
// Route::get('/', [\Modules\CMS\Http\Controllers\PageController::class, 'resolveHomepage'])->name('home');
Route::get('/{slug}', [\Modules\CMS\Http\Controllers\DynamicResolverController::class, 'resolve'])
    ->name('dynamic.resolve')
    ->where('slug', '^(?!products|configurator|activioncms|admin|nova|api|storage|build|assets|favicon|docs|solusi|penawaran|perbandingan|artikel|panduan|tentang).*$');
