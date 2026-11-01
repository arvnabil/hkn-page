# Panduan Integrasi Frontend React + Inertia.js ke Laravel

Repositori ini telah disiapkan dengan struktur komponen React modular (esources/js/) dan dataset JSON dinamis (esources/js/data/), siap digunakan langsung untuk integrasi ke dalam **Laravel + Inertia.js + React**.

---

## 1. Analisis File HTML Root & Pemetaan ke Inertia Page

| File HTML Asli | URL / Route Laravel | Komponen Inertia Page | Sumber Data Dinamis (JSON / DB) |
| :--- | :--- | :--- | :--- |
| index.html | / (home) | esources/js/Pages/Home.jsx | rticles.json, products.json, dvisor.json |
| bout.html | /tentang (bout) | esources/js/Pages/About.jsx | dvisor.json, site.json |
| rticle.html | /artikel (rticles.index) | esources/js/Pages/Articles/Index.jsx | rticles.json (dari data/news.json) |
| panduan-detail.html | /artikel/{slug} (rticles.show) | esources/js/Pages/Articles/Show.jsx | Data artikel spesifik + konten HTML |
| product.html | /produk (products.index) | esources/js/Pages/Products/Index.jsx | products.json |
| product-detail.html | /produk/{id} (products.show) | esources/js/Pages/Products/Show.jsx | Objek spesifikasi produk |
| solusi.html | /solusi (solutions) | esources/js/Pages/Solutions.jsx | solutions.json |
| penawaran.html | /penawaran (inquiry) | esources/js/Pages/Inquiry.jsx | Form interaktif + pengiriman penawaran |
| perbandingan.html | /perbandingan (compare) | esources/js/Pages/Compare.jsx | Matriks komparasi produk |
| panduan.html | /panduan (guides.index) | esources/js/Pages/Guides/Index.jsx | Kategori panduan teknis |

---

## 2. Struktur Folder Komponen React (esources/js/)

`
resources/js/
├── app.jsx                       # Entry point Inertia
├── Layouts/
│   └── AppLayout.jsx             # Shell layout: Navbar, Children, Footer, BottomNav
├── Components/
│   ├── Navbar.jsx                # Header navigasi desktop & drawer mobile
│   ├── Footer.jsx                # Kolom tautan & legal copyright
│   ├── BottomNav.jsx             # Navigasi bawah khusus mobile
│   ├── ArticleCard.jsx           # Kartu artikel dengan reticle & telemetri
│   ├── ProductCard.jsx           # Kartu katalog produk AVer & spek ringkas
│   └── AdvisorHUDCard.jsx        # Kartu potret HUD Harry Kusumo (ID: HKN-AV)
├── data/
│   ├── site.json                 # Konfigurasi menu, kontak, medsos, footer
│   ├── articles.json             # 14 artikel terpilih dari data/news.json
│   ├── products.json             # Spek lengkap kamera PTZ & video bar AVer
│   ├── solutions.json            # Topologi ruang: Huddle, Medium, Boardroom, Classroom
│   └── advisor.json              # Data bio, kredensial, & layanan Harry Kusumo
└── Pages/
    ├── Home.jsx                  # Halaman utama majalah kolaborasi
    ├── About.jsx                 # Halaman profil advisor
    ├── Solutions.jsx             # Halaman rekomendasi solusi ruang
    ├── Inquiry.jsx               # Form permintaan penawaran
    ├── Articles/
    │   ├── Index.jsx             # Arsip artikel dengan live search & filter kategori
    │   └── Show.jsx              # Reader artikel lengkap dengan bio penulis
    └── Products/
        └── Index.jsx             # Katalog produk AVer filterable
`

---

## 3. Contoh Implementasi di Laravel (outes/web.php & Controller)

### outes/web.php
`php
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SolutionController;
use App\Http\Controllers\InquiryController;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang', fn() => Inertia::render('About'))->name('about');
Route::get('/solusi', [SolutionController::class, 'index'])->name('solutions');
Route::get('/penawaran', [InquiryController::class, 'index'])->name('inquiry');
Route::post('/penawaran', [InquiryController::class, 'store'])->name('inquiry.store');

Route::prefix('artikel')->group(function () {
    Route::get('/', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/{slug}', [ArticleController::class, 'show'])->name('articles.show');
});

Route::prefix('produk')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('products.index');
    Route::get('/{id}', [ProductController::class, 'show'])->name('products.show');
});
`

### ArticleController.php
`php
namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        // Mengambil artikel dari database (tabel news hasil migrasi data/news.json)
         = News::select('id', 'title', 'slug', 'excerpt', 'thumbnail', 'created_at')
            ->latest()
            ->paginate(12);

        return Inertia::render('Articles/Index', [
            'articles' => ->items(),
            'pagination' => ,
        ]);
    }

    public function show()
    {
         = News::where('slug', )->firstOrFail();

        return Inertia::render('Articles/Show', [
            'article' => ,
        ]);
    }
}
`

---

## 4. Keunggulan Komponen React yang Dibuat

1. **Dual-Mode (Fallback & Props)**:
   Semua komponen halaman (Home.jsx, Articles/Index.jsx, dll.) memiliki default fallback ke data JSON lokal (defaultArticles, defaultProducts, defaultAdvisor). Jika Laravel Inertia mengirim data baru lewat props, komponen akan otomatis menggunakan data dinamis dari database tanpa perlu penyesuaian kode.

2. **Pencarian & Filter Klien Instan**:
   Pada Articles/Index.jsx, pencarian kata kunci dan filter kategori berjalan secara reaktif dan mulus di sisi browser.

3. **Konsistensi Desain Tokens**:
   Komponen menggunakan token Tailwind (g-surface, 	ext-on-surface, ui-card, ont-label-mono, order-border-clean) sehingga adaptasi mode terang/gelap dan palet AVer tetap terjaga.