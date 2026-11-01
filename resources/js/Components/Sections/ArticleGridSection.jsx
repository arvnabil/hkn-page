import React from 'react';
import { Link } from '@inertiajs/react';
import ArticleCard from '../ArticleCard';
import defaultArticles from '../../data/articles.json';

export default function ArticleGridSection({
  title = "Wawasan Teknis & Panduan Ruang Hybrid",
  subtitle = "PUBLIKASI & BEDAH TEKNOLOGI PRO AV",
  description = "Eksplorasi artikel terkini mengenai arsitektur ruang rapat modern, tips akustik, panduan pemilihan lensa PTZ, dan studi kasus implementasi nyata di Indonesia.",
  badge = "EDITORIAL & TECH BRIEFS",
  limit = 3,
  cta_text = "Lihat Semua Artikel",
  cta_url = "/artikel",
}) {
  const displayedArticles = defaultArticles.slice(0, Number(limit) || 3);

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

          {cta_text && (
            <Link
              href={cta_url || '/artikel'}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark self-start md:self-auto"
            >
              <span>{cta_text}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

