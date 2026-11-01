<?php

namespace Modules\ProductCatalog\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\ProductCatalog\Models\Brand;
use Modules\ProductCatalog\Models\Product;
use Modules\SEO\Services\SeoResolver;

class BrandController extends Controller
{
    public function show($slug)
    {
        // 1. Fetch Brand (by slug or name)
        $brand = Brand::where('slug', $slug)
            ->orWhere('name', 'LIKE', str_replace('-', ' ', $slug))
            ->orWhere('name', 'LIKE', $slug)
            ->first();

        if (!$brand) {
            abort(404);
        }

        // 2. Real "Categories" (Services that have products for this brand)
        // Frontend expects: { name, slug, image }
        // 2. Real "Categories" (Device Types)
        // Frontend expects: { name, slug, image }
        $categories = \Modules\ProductCatalog\Models\ProductCategory::whereHas('products', function ($q) use ($brand) {
            $q->where('brand_id', $brand->id)->where('is_active', true);
        })->orderBy('sort_order')->get()->map(function ($cat) {
            return (object) [
                'name' => $cat->name,
                'slug' => $cat->slug,
                // Fallback image logic if icon is missing
                'image' => $cat->icon ?? '/assets/default.png'
            ];
        });

        // 3. Dynamic Service Solutions (No longer tied to legacy Services module)
        $groupedServices = [];

        // 4. Real "Latest Products" (Filtered by New Arrival)
        // Frontend expects: { name, image_path, price, category (service name), is_active, is_new }
        $products = Product::where('brand_id', $brand->id)
            ->where('is_active', true)
            ->where('is_new', true) // Only New Arrivals
            ->with('categories') // Eager load categories
            ->latest()
            ->take(8) // Limit to 8 as per UI design
            ->get()
            ->map(function ($product) {
                // Get first category name
                $categoryName = $product->categories->first()?->name ?? 'General';
                
                return (object) [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image_path' => $product->image_path ?? '/assets/default.png', // Fallback
                    'price' => $product->price ?? 0,
                    'category' => $categoryName,
                    'is_active' => $product->is_active,
                    'is_new' => $product->is_new,
                    'slug' => $product->slug
                ];
            });

        // 5. SEO
        $seo = SeoResolver::for($brand);

        return Inertia::render('Partners/BrandLanding', [
            'brand' => $brand,
            'products' => $products,
            'categories' => $categories,
            'relatedServices' => $groupedServices,
            'breadcrumb_image' => $brand->breadcrumb_image,
            'show_breadcrumb' => $brand->show_breadcrumb,
            'seo' => $seo
        ]);
    }

    /**
     * Brand Product List Page (/{brandSlug}/products)
     */
    public function productList(Request $request, string $brandSlug)
    {
        \Log::info("BrandController@productList HIT with: " . $brandSlug);
        $brand = Brand::where('slug', $brandSlug)
            ->orWhere('name', 'LIKE', str_replace('-', ' ', $brandSlug))
            ->first();

        if (!$brand) {
            abort(404);
        }

        // Base Query
        $query = $brand->products()->where('is_active', true)->with(['categories']);

        // Filter by Search Term
        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filter by Device Category (ProductCategory)
        if ($request->filled('category')) {
            $categorySlug = $request->input('category');
            $query->whereHas('categories', function ($q) use ($categorySlug) {
                 $q->where('slug', $categorySlug);
            });
        }

        // Sort
        $sort = $request->input('sort', 'newest');
        if ($sort === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'price_desc') {
             $query->orderBy('price', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate(12)->withQueryString();

        // Device Categories available for this brand
        $categories = \Modules\ProductCatalog\Models\ProductCategory::whereHas('products', function ($q) use ($brand) {
            $q->where('brand_id', $brand->id)->where('is_active', true);
        })->orderBy('sort_order')->get()->map(function ($cat) use ($brand) {
            return (object) [
                'name' => $cat->name,
                'slug' => $cat->slug,
                'image' => $cat->icon,
                'count' => $cat->products()->where('brand_id', $brand->id)->where('is_active', true)->count()
            ];
        });

        // Service Solutions available for this brand
        $serviceSolutions = [];

        return Inertia::render('Partners/BrandProductList', [
            'brand' => $brand,
            'products' => $products,
            'categories' => $categories,
            'serviceSolutions' => $serviceSolutions,
            'serviceItemLabel' => 'Solutions',
            'filters' => $request->all(),
            'seo' => SeoResolver::for($brand)
        ]);
    }
}
