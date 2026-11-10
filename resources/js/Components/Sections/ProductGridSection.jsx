import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import ProductCard from '../ProductCard';
import defaultProducts from '../../data/products.json';

export default function ProductGridSection({
  title = "Katalog Kamera PTZ & Sistem Audio AVer",
  subtitle = "HARDWARE BERMUTU TINGGI UNTUK ENTERPRISE & EDUCATION",
  description = "Temukan perangkat konferensi video AVer dengan zoom optik presisi tinggi, teknologi auto-framing cerdas, dan integrasi mulus dengan ekosistem Zoom, Teams, dan Google Meet.",
  badge = "KATALOG PERANGKAT RESMI",
  category = "all",
  limit = 6,
  show_filter = true,
  cta_text = "Lihat Semua Kamera AVer",
  cta_url = "/produk",
  items = null,
}) {
  const [selectedCategory, setSelectedCategory] = useState(category);

  const categories = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'ptz', label: 'Enterprise PTZ' },
    { id: 'tracking', label: 'AI Auto Tracking' },
    { id: 'soundbar', label: 'All-in-One Bar' },
    { id: 'classroom', label: 'Education PTZ' },
  ];

  const sourceProducts = Array.isArray(items) && items.length > 0 ? items : defaultProducts;

  const filteredProducts = sourceProducts
    .filter((p) => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'ptz') return p.tags?.includes('PTZ') || p.category?.toLowerCase().includes('ptz');
      if (selectedCategory === 'tracking') return p.tags?.includes('Auto-Tracking') || p.tags?.includes('Voice Tracking');
      if (selectedCategory === 'soundbar') return p.tags?.includes('Soundbar') || p.category?.toLowerCase().includes('bar');
      if (selectedCategory === 'classroom') return p.category?.toLowerCase().includes('education') || p.category?.toLowerCase().includes('kelas');
      return true;
    })
    .slice(0, Number(limit) || 6);

  return (
    <section className="py-16 md:py-24 bg-surface border-b border-border-clean relative">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-border-clean">
          <div className="max-w-2xl">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-primary font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-aver-red animate-pulse" />
                <span>{badge}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight tracking-tight mb-3">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm font-mono text-muted-slate uppercase tracking-wider mb-2">
                {subtitle}
              </p>
            )}
            <p className="font-body-md text-secondary leading-relaxed">
              {description}
            </p>
          </div>

          {show_filter && (
            <div className="flex flex-wrap gap-1.5 p-1 bg-surface-alt border border-border-clean rounded-xl self-start md:self-auto">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedCategory === c.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-secondary hover:text-on-surface hover:bg-surface'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Footer CTA */}
        {cta_text && (
          <div className="text-center pt-6">
            <Link
              href={cta_url || '/produk'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-alt hover:bg-surface-container border border-border-clean font-bold text-sm text-on-surface transition-all hover:-translate-y-0.5"
            >
              <span>{cta_text}</span>
              <span className="material-symbols-outlined text-sm font-bold text-primary">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

