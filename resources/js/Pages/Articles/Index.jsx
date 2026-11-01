import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import ArticleCard from '../../Components/ArticleCard';
import defaultArticles from '../../data/articles.json';
import defaultAdvisor from '../../data/advisor.json';
import siteData from '../../data/site.json';

const DEFAULT_CATEGORIES = [
  { code: 'all', label: 'Semua Kategori' },
  { code: 'ptz', label: 'PTZ Pro AV' },
  { code: 'audio', label: 'Audio & Bar' },
  { code: 'smart', label: 'Smart Room' },
  { code: 'panduan', label: 'Panduan Teknis' },
];

export default function ArticlesIndex({
  articles = defaultArticles,
  categories = DEFAULT_CATEGORIES,
  advisor = defaultAdvisor,
  site = siteData,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat =
        selectedCategory === 'all' ||
        art.categoryCode === selectedCategory ||
        art.category.toLowerCase().includes(selectedCategory);

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

  const trendingArticles = articles.slice(0, 5);

  return (
    <AppLayout title="Artikel & Panduan Teknis">
      <div className="mx-auto max-w-page px-gutter-mobile py-space-xl md:px-gutter md:py-space-2xl">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-secondary mb-2">
            <Link href="/" className="hover:text-primary">Beranda</Link>
            <span>•</span>
            <span className="text-primary font-medium">Artikel & Panduan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline-lg font-extrabold text-on-surface">
            Arsip Dokumentasi & Analisis Kolaborasi
          </h1>
          <p className="font-body-md text-secondary mt-2 max-w-3xl">
            Kumpulan panduan penataan ruang, pengujian komparatif kamera PTZ, integrasi audio bar, dan pembaruan ekosistem video meeting enterprise.
          </p>
        </div>

        {/* Filter Strip & Search */}
        <div className="ui-card bg-surface-container-lowest p-4 sm:p-5 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul artikel, topik, atau kata kunci..."
                className="w-full pl-10 pr-4 py-2 bg-surface-alt border border-border-clean rounded-lg font-body-sm text-sm text-on-surface placeholder:text-muted-slate focus:outline-none focus:border-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-slate hover:text-on-surface"
                >
                  CLEAR
                </button>
              )}
            </div>

            <div className="font-mono text-xs text-secondary">
              Ditemukan: <span className="font-bold text-primary">{filteredArticles.length}</span> artikel
            </div>
          </div>

          {/* Horizontal Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-border-clean">
            <span className="font-mono text-xs text-secondary mr-2 shrink-0">KATEGORI:</span>
            {categories.map((cat) => {
              const active = selectedCategory === cat.code;
              return (
                <button
                  key={cat.code}
                  type="button"
                  onClick={() => setSelectedCategory(cat.code)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full font-body-sm text-xs transition-colors ${
                    active
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-alt border border-border-clean text-on-surface hover:border-primary'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Articles Grid */}
          <div className="lg:col-span-8">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            ) : (
              <div className="ui-card bg-surface-container-lowest p-12 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-secondary mb-3">search_off</span>
                <h3 className="font-title-md text-lg font-bold text-on-surface mb-2">
                  Tidak Ada Artikel Ditemukan
                </h3>
                <p className="font-body-sm text-secondary max-w-sm mb-6 leading-relaxed">
                  Tidak ditemukan artikel yang sesuai dengan filter atau kata kunci "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg"
                >
                  Reset Filter & Pencarian
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Trending Articles */}
            <div className="ui-card bg-surface-container-lowest p-5">
              <div className="font-label-mono text-xs font-bold text-primary uppercase pb-3 mb-4 border-b border-border-clean flex items-center justify-between">
                <span>ARTIKEL TERPOPULER</span>
                <span className="material-symbols-outlined text-sm">trending_up</span>
              </div>
              <div className="space-y-4">
                {trendingArticles.map((item, idx) => (
                  <div key={item.id} className="flex gap-3 items-start group">
                    <span className="font-display text-lg font-extrabold text-border-clean group-hover:text-primary transition-colors leading-none w-6 shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <Link
                        href={`/artikel/${item.id}`}
                        className="font-title-md text-xs font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <span className="font-mono text-[10px] text-muted-slate mt-1">
                        {item.publishedAt} · {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advisor Consultation Card */}
            <div className="ui-card bg-surface-alt p-5 border border-primary/20">
              <span className="font-mono text-[10px] text-primary uppercase font-bold block mb-1">
                KONSULTASI ADVISOR LANGSUNG
              </span>
              <h4 className="font-title-md text-base font-bold text-on-surface mb-2">
                Butuh Rekomendasi Kamera untuk Denah Anda?
              </h4>
              <p className="font-body-sm text-xs text-secondary mb-4 leading-relaxed">
                Diskusikan dimensi fisik ruangan, kapasitas peserta, dan integrasi platform bersama {advisor.name}.
              </p>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-whatsapp text-white font-title-md text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-whatsapp-dark transition-colors"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Chat via WhatsApp</span>
              </a>
            </div>

          </aside>

        </div>

      </div>
    </AppLayout>
  );
}
