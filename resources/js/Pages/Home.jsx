import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import ArticleCard from '../Components/ArticleCard';
import ProductCard from '../Components/ProductCard';
import AdvisorHUDCard from '../Components/AdvisorHUDCard';

import defaultArticles from '../data/articles.json';
import defaultProducts from '../data/products.json';
import defaultAdvisor from '../data/advisor.json';

export default function Home({
  articles = defaultArticles,
  products = defaultProducts,
  advisor = defaultAdvisor,
}) {
  const featured = articles[0];
  const sideHighlights = articles.slice(1, 5);
  const archiveList = articles.slice(0, 6);

  return (
    <AppLayout title="AVer Solutions Magazine">
      <div className="mx-auto max-w-page px-gutter-mobile py-space-xl md:px-gutter md:py-space-2xl">
        
        {/* HERO EDITORIAL SECTION */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Main Featured Hero Story */}
            <article className="ui-card lg:col-span-8 bg-surface-alt p-6 sm:p-8 flex flex-col justify-between reticle-container relative overflow-hidden group">
              <div>
                <div className="flex items-center gap-2 mb-4 font-mono text-xs text-primary font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span>LIPUTAN UTAMA · {featured.category}</span>
                </div>

                <Link href={`/artikel/${featured.id}`} className="block group/title">
                  <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight tracking-tight mb-4 group-hover/title:text-primary transition-colors">
                    {featured.title}
                  </h1>
                </Link>

                <p className="font-body-md text-secondary leading-relaxed mb-6 line-clamp-3">
                  {featured.excerpt}
                </p>

                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 border border-border-clean">
                  <img
                    src={featured.thumbnail}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border-clean flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface border border-border-clean overflow-hidden shrink-0">
                    <img
                      src={featured.author.avatar}
                      alt={featured.author.name}
                      className="w-full h-full object-cover object-[35%_40%]"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface leading-none">
                      {featured.author.name}
                    </p>
                    <p className="text-xs text-muted-slate mt-1 font-mono">
                      {featured.publishedAt} · {featured.readTime}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/artikel/${featured.id}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark"
                >
                  <span>Baca Selengkapnya</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </article>

            {/* Right Column Highlights */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="font-label-mono text-label-telemetry text-primary font-bold uppercase tracking-wider pb-2 border-b border-border-clean">
                TREN & ANALISIS TEKNIS
              </div>
              <div className="flex flex-col gap-4 flex-1 justify-between">
                {sideHighlights.map((art) => (
                  <Link
                    key={art.id}
                    href={`/artikel/${art.id}`}
                    className="ui-card ui-card--interactive p-4 bg-surface-container-lowest block group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-slate mb-1">
                      <span className="text-primary font-semibold">{art.category}</span>
                      <span>{art.publishedAt}</span>
                    </div>
                    <h3 className="font-title-md text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                      {art.title}
                    </h3>
                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ADVISOR INTRODUCTION SECTION */}
        <section className="mb-16 py-12 border-y border-border-clean bg-surface-container-low/40 rounded-3xl p-6 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <AdvisorHUDCard advisor={advisor} />
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-alt border border-border-clean rounded-full font-label-mono text-xs text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>PROFIL ADVISOR · KONSULTASI PROFESIONAL</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-headline-lg font-extrabold text-on-surface tracking-tight leading-tight">
                {advisor.tagline}
              </h2>

              <p className="text-secondary font-body-md leading-relaxed">
                {advisor.bio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-clean">
                <div>
                  <span className="text-[10px] font-mono text-muted-slate block uppercase">SPESIALISASI</span>
                  <span className="font-title-md text-sm font-bold text-on-surface">{advisor.metrics.specialty}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-slate block uppercase">FOKUS RUANG</span>
                  <span className="font-title-md text-sm font-bold text-on-surface">{advisor.metrics.roomFocus}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-slate block uppercase">PENDEKATAN</span>
                  <span className="font-title-md text-sm font-bold text-on-surface">{advisor.metrics.approach}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={advisor.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-whatsapp text-white font-title-md font-bold shadow-md hover:bg-whatsapp-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>Konsultasi WhatsApp</span>
                </a>
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border-clean text-on-surface font-title-md font-bold hover:bg-surface-alt transition-colors"
                >
                  <span>Lihat Profil Lengkap</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST PUBLICATION ARCHIVE */}
        <section className="mb-16" id="arsip-publikasi">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-border-clean">
            <div>
              <span className="font-label-mono text-label-telemetry text-primary font-bold uppercase tracking-wider block">
                DOKUMENTASI & PANDUAN TERBARU
              </span>
              <h2 className="text-2xl font-headline-md font-bold text-on-surface">
                Arsip Artikel & Studi Kasus
              </h2>
            </div>
            <Link
              href="/artikel"
              className="text-sm font-label-mono text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua ({articles.length})</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archiveList.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </section>

        {/* FEATURED HARDWARE CATALOG */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-border-clean">
            <div>
              <span className="font-label-mono text-label-telemetry text-primary font-bold uppercase tracking-wider block">
                KATALOG HARDWARE ENTERPRISE
              </span>
              <h2 className="text-2xl font-headline-md font-bold text-on-surface">
                Solusi Kamera & Video Bar AVer
              </h2>
            </div>
            <Link
              href="/produk"
              className="text-sm font-label-mono text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Produk</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
