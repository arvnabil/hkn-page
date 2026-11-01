import React, { useState, useMemo } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import ProductCard from '../../Components/ProductCard';
import defaultProducts from '../../data/products.json';

export default function ProductsIndex({ products = defaultProducts }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const list = [{ code: 'all', label: 'Semua Kategori' }];
    const seen = new Set();
    products.forEach((p) => {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        list.push({ code: p.category, label: p.categoryLabel || p.category.toUpperCase() });
      }
    });
    return list;
  }, [products]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <AppLayout title="Katalog Produk AVer">
      <div className="mx-auto max-w-page px-gutter-mobile py-space-xl md:px-gutter md:py-space-2xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-xs text-primary font-bold uppercase mb-2">
            HARDWARE PORTFOLIO
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline-lg font-extrabold text-on-surface">
            Katalog Perangkat Video Konferensi AVer
          </h1>
          <p className="font-body-md text-secondary mt-2 max-w-3xl">
            Solusi kamera optik presisi, video bar terintegrasi, dan perangkat audio yang dirancang khusus untuk ekosistem Microsoft Teams, Zoom Rooms, dan Google Meet.
          </p>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar">
            {categories.map((c) => {
              const active = selectedCategory === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCategory(c.code)}
                  className={`px-4 py-2 rounded-full font-body-sm text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-alt border border-border-clean text-on-surface hover:border-primary'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </AppLayout>
  );
}
