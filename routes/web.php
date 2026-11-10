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
$getEnrichedArticles = function () {
    $articles = json_decode(file_get_contents(resource_path('js/data/articles.json')), true) ?: [];
    $newsRecords = DB::table('news')
        ->whereIn('slug', array_column($articles, 'slug'))
        ->get(['slug', 'featured_image', 'published_at'])
        ->keyBy('slug');

    foreach ($articles as &$article) {
        $news = $newsRecords->get($article['slug']);
        if ($news && $news->featured_image) {
            $image = $news->featured_image;
            $article['thumbnail'] = str_starts_with($image, 'http')
                ? $image
                : asset('storage/'.ltrim($image, '/'));
        }
        if ($news && $news->published_at) {
            $article['publishedAt'] = \Carbon\Carbon::parse($news->published_at)->isoFormat('D MMM Y');
        }
    }
    unset($article);

    return $articles;
};

$getDynamicProducts = function () {
    if (class_exists(\Modules\ProductCatalog\Models\Product::class)) {
        $dbProducts = \Modules\ProductCatalog\Models\Product::where('is_active', true)
            ->with('categories')
            ->orderBy('id', 'asc')
            ->get();

        if ($dbProducts->isNotEmpty()) {
            return $dbProducts->map->toFrontendArray()->values()->all();
        }
    }

    return json_decode(file_get_contents(resource_path('js/data/products.json')), true) ?: [];
};

// Layout 1 (Editorial Magazine) as the primary dynamic homepage
Route::get('/', function () use ($getEnrichedArticles, $getDynamicProducts) {
    return Inertia::render('Home', [
        'articles' => $getEnrichedArticles(),
        'products' => $getDynamicProducts(),
    ]);
})->name('home');

// Layout 2 (B2B Solution Landing from Page Builder)
Route::get('/landing', [\Modules\CMS\Http\Controllers\PageController::class, 'resolveHomepage'])->name('landing');
Route::get('/editorial', function () use ($getEnrichedArticles, $getDynamicProducts) {
    return Inertia::render('Home', [
        'articles' => $getEnrichedArticles(),
        'products' => $getDynamicProducts(),
    ]);
})->name('editorial');

Route::get('/tentang', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/solusi', function () {
    return Inertia::render('Solutions');
})->name('solutions');

Route::get('/penawaran', function () {
    return Inertia::render('Inquiry');
})->name('inquiry');

Route::get('/produk', function () use ($getDynamicProducts) {
    return Inertia::render('Products/Index', [
        'products' => $getDynamicProducts(),
    ]);
})->name('products.index');

Route::get('/produk/{id}', function ($id) use ($getDynamicProducts) {
    $products = $getDynamicProducts();
    $product = collect($products)->first(fn ($p) => (string) ($p['id'] ?? '') === (string) $id || (string) ($p['slug'] ?? '') === (string) $id);

    abort_unless($product, 404);

    return Inertia::render('Products/Show', [
        'product'  => $product,
        'products' => $products,
    ]);
})->name('products.show');

Route::get('/perbandingan', function () {
    return Inertia::render('Comparison');
})->name('comparison');
Route::redirect('/komparasi', '/perbandingan');

Route::get('/artikel', function () use ($getEnrichedArticles) {
    return Inertia::render('Articles/Index', ['articles' => $getEnrichedArticles()]);
})->name('articles.index');

Route::get('/artikel/{slug}', function ($slug) use ($getEnrichedArticles) {
    $articles = $getEnrichedArticles();
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
