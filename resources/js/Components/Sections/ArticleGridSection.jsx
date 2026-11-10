import React from 'react';
import { Link } from '@inertiajs/react';
import ArticleCard from '../ArticleCard';
import defaultArticles from '../../data/articles.json';

export default function ArticleGridSection({
  title = "Arsip Artikel & Studi Kasus",
  subtitle = "DOKUMENTASI & PANDUAN TERBARU",
  badge = "",
  limit = 6,
  cta_text = "Lihat Semua Artikel",
  cta_url = "/artikel",
  items = null,
}) {
  const sourceArticles = Array.isArray(items) && items.length > 0 ? items : defaultArticles;
  const displayedArticles = sourceArticles.slice(0, Number(limit) || 6);

  return (
    <section className="mb-16" id="arsip-publikasi">
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
              href={cta_url || '/artikel'}
              className="text-sm font-label-mono text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>{cta_text}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => (
            <ArticleCard key={article.id || article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
