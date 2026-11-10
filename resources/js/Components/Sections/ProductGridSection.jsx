import React from 'react';
import { Link } from '@inertiajs/react';
import ProductCard from '../ProductCard';
import defaultProducts from '../../data/products.json';

export default function ProductGridSection({
  title = "Solusi Kamera & Video Bar AVer",
  subtitle = "KATALOG HARDWARE ENTERPRISE",
  limit = 8,
  cta_text = "Lihat Semua Produk",
  cta_url = "/produk",
  items = null,
}) {
  const sourceProducts = Array.isArray(items) && items.length > 0 ? items : defaultProducts;
  const filteredProducts = sourceProducts.slice(0, Number(limit) || 8);

  return (
    <section className="mb-12">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-border-clean">
          <div>
            {subtitle && (
              <span className="font-label-mono text-label-telemetry text-primary font-bold uppercase tracking-wider block">
                {subtitle}
              </span>
            )}
            <h2 className="text-2xl font-headline-md font-bold text-on-surface">
              {title}
            </h2>
          </div>
          {cta_text && (
            <Link
              href={cta_url || '/produk'}
              className="text-sm font-label-mono text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>{cta_text}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          )}
        </div>

        {/* Product Cards Grid - 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
