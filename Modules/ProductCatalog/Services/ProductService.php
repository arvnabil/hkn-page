<?php

namespace Modules\ProductCatalog\Services;

use Modules\ProductCatalog\Repositories\ProductRepository;
use Modules\ProductCatalog\Models\Brand;
use Modules\ProductCatalog\Models\ProductCategory;
use Modules\CMS\Models\Page;

class ProductService
{
    protected $repository;

    public function __construct(ProductRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get data for the product index page
     */
    public function getIndexData(array $filters)
    {
        $products = $this->repository->getPaginatedWithFilters($filters)
            ->through(fn ($product) => $product->toFrontendArray());

        $brands = Brand::orderBy('name')->get(['id', 'name']);
        $categories = ProductCategory::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        
        $page = Page::where('slug', 'products')->first();

        return [
            'products'        => $products,
            'brands'          => $brands,
            'categories'      => $categories,
            'page_title'      => $page?->title ?? 'All Products',
            'breadcrumb_image'=> $page?->breadcrumb_image,
            'show_breadcrumb' => $page?->show_breadcrumb ?? true,
        ];
    }

    /**
     * Get data for a single product detail page
     */
    public function getDetailData(string $slug): array
    {
        $product = $this->repository->findBySlug($slug);
        $related = $this->repository->getRelatedProducts($product->brand_id, $product->id)
            ->map->toFrontendArray()->values()->all();

        return array_merge($product->toFrontendArray(), ['related_products' => $related]);
    }
}
