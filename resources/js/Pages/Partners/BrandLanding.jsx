import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import ProductCard from '../../Components/ProductCard';

export default function BrandLanding({ brand, products = [], categories = [] }) {
  const hero = brand.landing_config?.hero || {};
  const catalogUrl = `/${encodeURIComponent(brand.slug)}/products`;
  const title = hero.title || brand.name;

  return (
    <AppLayout title={title}>
      <Head title={title} />
      <div className="mx-auto max-w-page px-gutter-mobile py-space-2xl md:px-gutter">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-slate mb-8">
          <a href="/" className="hover:text-primary">Beranda</a>
          <span className="mx-2">/</span>{brand.name}
        </nav>
        <section className="ui-card bg-surface-alt p-6 md:p-10 mb-12">
          {hero.eyebrow && <p className="text-sm text-primary font-semibold mb-3">{hero.eyebrow}</p>}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          {hero.subtitle && <p className="text-xl text-secondary mb-3">{hero.subtitle}</p>}
          {(hero.desc || brand.desc) && (
            <p className="text-secondary whitespace-pre-line max-w-3xl mb-6">{hero.desc || brand.desc}</p>
          )}
          <a href={catalogUrl} className="inline-flex rounded-lg bg-primary text-on-primary px-5 py-3 font-semibold">
            Lihat semua produk {brand.name}
          </a>
        </section>
        {categories.length > 0 && (
          <section aria-labelledby="brand-categories" className="mb-12">
            <h2 id="brand-categories" className="text-2xl font-bold mb-5">Kategori produk</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <a key={category.slug} href={`${catalogUrl}?category=${encodeURIComponent(category.slug)}`}
                  className="ui-card ui-card--interactive bg-surface-container-lowest px-5 py-3 text-primary font-semibold">
                  {category.name}
                </a>
              ))}
            </div>
          </section>
        )}
        <section aria-labelledby="brand-products">
          <h2 id="brand-products" className="text-2xl font-bold mb-6">Produk terbaru {brand.name}</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <p className="text-muted-slate">Belum ada produk terbaru. Lihat katalog untuk produk yang tersedia.</p>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
