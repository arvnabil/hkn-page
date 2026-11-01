<?php

namespace Modules\ProductCatalog\Repositories;

use Modules\ProductCatalog\Models\Product;

class ProductRepository
{
    /**
     * Get base query for active products with relations
     */
    public function getBaseQuery()
    {
        return Product::with(['brand', 'categories'])
            ->where('is_active', true);
    }

    /**
     * Get paginated products with filters
     */
    public function getPaginatedWithFilters(array $filters, int $perPage = 9)
    {
        $query = $this->getBaseQuery();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['brand'])) {
            $query->where('brand_id', $filters['brand']);
        }

        if (!empty($filters['category'])) {
            $query->whereHas('categories', function($q) use ($filters) {
                $q->where('product_categories.id', $filters['category']);
            });
        }

        $sort = $filters['orderby'] ?? 'menu_order';
        if ($sort === 'date') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sort === 'name') {
            $query->orderBy('name', 'asc');
        } else {
            $query->orderBy('id', 'desc');
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Find a single active product by slug
     */
    public function findBySlug(string $slug)
    {
        return Product::with(['brand', 'categories'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    /**
     * Get related products based on brand_id
     */
    public function getRelatedProducts(?int $brandId, int $excludeProductId, int $limit = 4)
    {
        $query = Product::with(['brand', 'categories'])
            ->where('is_active', true)
            ->where('id', '!=', $excludeProductId);

        if ($brandId) {
            $query->where('brand_id', $brandId);
        }

        return $query->limit($limit)->get();
    }
}
