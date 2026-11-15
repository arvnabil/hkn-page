import React from 'react';
import { Head } from '@inertiajs/react';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import ProductCard from '../../Components/ProductCard';

export default function BrandProductList({ brand, products = {}, categories = [], filters = {} }) {
  const title = `Produk ${brand.name}`;
  const catalogUrl = `/${encodeURIComponent(brand.slug)}/products`;
  const items = products.data || [];
  const controlClass = 'block h-11 w-full min-w-0 rounded-lg border border-border-clean bg-surface-alt text-sm font-normal text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <AppLayout title={title}>
      <Head title={title} />
      <div className="mx-auto max-w-page px-gutter-mobile py-space-2xl md:px-gutter">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-slate mb-8">
          <a href="/" className="hover:text-primary">Beranda</a><span className="mx-2">/</span>
          <a href={`/${encodeURIComponent(brand.slug)}`} className="hover:text-primary">{brand.name}</a>
          <span className="mx-2">/</span>Produk
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
        <form action={catalogUrl} method="get" role="search" aria-label="Filter produk" autoComplete="off"
          className="ui-card bg-surface-container-lowest p-4 sm:p-6 grid items-end gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] mb-8">
          <div className="min-w-0">
            <label htmlFor="brand-product-search" className="block text-sm font-semibold mb-2">Cari produk</label>
            <div className="relative">
              <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-slate" />
              <input id="brand-product-search" type="search" name="search" autoComplete="off" spellCheck={false}
                defaultValue={filters.search || ''} placeholder="Cari nama atau deskripsi produk"
                className={`${controlClass} pl-11 pr-4 placeholder:text-muted-slate`} />
            </div>
          </div>
          <div className="min-w-0">
            <label htmlFor="brand-product-category" className="block text-sm font-semibold mb-2">Kategori</label>
            <div className="relative">
            <select id="brand-product-category" name="category" defaultValue={filters.category || ''}
              className={`${controlClass} appearance-none pl-3.5 pr-10`}>
              <option value="">Semua kategori</option>
              {categories.map(category => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
            <ChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-slate" />
            </div>
          </div>
          <div className="min-w-0">
            <label htmlFor="brand-product-sort" className="block text-sm font-semibold mb-2">Urutkan</label>
            <div className="relative">
            <select id="brand-product-sort" name="sort" defaultValue={filters.sort || 'newest'}
              className={`${controlClass} appearance-none pl-3.5 pr-10`}>
              <option value="newest">Terbaru</option>
              <option value="price_asc">Harga terendah</option>
              <option value="price_desc">Harga tertinggi</option>
            </select>
            <ChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-slate" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="h-11 flex-1 whitespace-nowrap rounded-lg bg-primary text-on-primary px-5 text-sm font-semibold transition-colors hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Terapkan</button>
            <a href={catalogUrl} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border-clean px-3 text-sm font-medium text-secondary transition-colors hover:bg-surface-alt hover:text-primary">
              <RotateCcw aria-hidden="true" size={16} />Reset
            </a>
          </div>
        </form>
        <p className="text-sm text-muted-slate mb-5">{products.total || 0} produk ditemukan</p>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : <p className="ui-card bg-surface-container-lowest p-8">Tidak ada produk yang cocok dengan pencarian ini.</p>}
        {products.last_page > 1 && (
          <nav aria-label="Halaman katalog" className="flex items-center justify-between mt-8">
            {products.prev_page_url ? <a href={products.prev_page_url} className="text-primary">← Sebelumnya</a> : <span />}
            <span className="text-sm text-muted-slate">Halaman {products.current_page} dari {products.last_page}</span>
            {products.next_page_url ? <a href={products.next_page_url} className="text-primary">Selanjutnya →</a> : <span />}
          </nav>
        )}
      </div>
    </AppLayout>
  );
}
