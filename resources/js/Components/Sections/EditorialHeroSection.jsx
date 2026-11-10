import React from 'react';
import { Link } from '@inertiajs/react';
import defaultArticles from '../../data/articles.json';

export default function EditorialHeroSection({
  badge = "LIPUTAN UTAMA",
  sidebar_title = "TREN & ANALISIS TEKNIS",
  articles = null,
}) {
  const safeArticles = Array.isArray(articles) && articles.length > 0 ? articles : defaultArticles;
  const featured = safeArticles[0] || defaultArticles[0];
  const sideHighlights = safeArticles.slice(1, 5);

  if (!featured) return null;

  return (
    <section className="mb-12 pt-8">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Featured Hero Story */}
          <article className="ui-card lg:col-span-8 bg-surface-alt p-6 sm:p-8 flex flex-col justify-between reticle-container relative overflow-hidden group">
            <div>
              <div className="flex items-center gap-2 mb-4 font-mono text-xs text-primary font-bold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{badge} · {featured.category}</span>
              </div>

              <Link href={`/artikel/${featured.slug || featured.id}`} className="block group/title">
                <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight tracking-tight mb-4 group-hover/title:text-primary transition-colors">
                  {featured.title}
                </h1>
              </Link>

              <p className="font-body-md text-secondary leading-relaxed mb-6 line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 border border-border-clean bg-surface-alt">
                <img
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/img/hero-ptz.png';
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border-clean flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {featured.author?.avatar && (
                  <div className="w-10 h-10 rounded-full bg-surface border border-border-clean overflow-hidden shrink-0">
                    <img
                      src={featured.author.avatar}
                      alt={featured.author.name}
                      className="w-full h-full object-cover object-[35%_40%]"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/harrys.png';
                      }}
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-on-surface leading-none">
                    {featured.author?.name || 'Harry Kusumo Negoro'}
                  </p>
                  <p className="text-xs text-muted-slate mt-1 font-mono">
                    {featured.publishedAt} · {featured.readTime || '4 min baca'}
                  </p>
                </div>
              </div>

              <Link
                href={`/artikel/${featured.slug || featured.id}`}
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
              {sidebar_title}
            </div>
            <div className="flex flex-col gap-4 flex-1 justify-between">
              {sideHighlights.map((art) => (
                <Link
                  key={art.id || art.slug}
                  href={`/artikel/${art.slug || art.id}`}
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
      </div>
    </section>
  );
}
