import React from 'react';
import { Link } from '@inertiajs/react';

export default function ArticleCard({ article }) {
  return (
    <article className="ui-card ui-card--interactive group bg-surface-container-lowest p-4 flex flex-col justify-between">
      <div>
        <div className="relative w-full aspect-[16/10] bg-surface-alt rounded-lg overflow-hidden mb-3.5 border border-border-clean">
          {/* Reticle Brackets */}
          <div className="absolute inset-2 pointer-events-none z-10 reticle-bracket">
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary"></span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-primary"></span>
          </div>
          <img
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            alt={article.title}
            loading="lazy"
            decoding="async"
            src={article.thumbnail}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/assets/img/hero-ptz.png';
            }}
          />
          {article.telemetry && (
            <span className="absolute top-2 right-2 bg-surface-container-lowest/90 px-2 py-0.5 rounded text-[10px] font-label-telemetry text-primary font-semibold">
              {article.telemetry}
            </span>
          )}
        </div>

        <span className="inline-block font-label-mono text-label-mono text-primary mb-1.5 uppercase">
          {article.category}
        </span>

        <Link
          href={`/artikel/${article.slug || article.id}`}
          className="block group-hover:text-primary transition-colors"
        >
          <h3 className="font-title-md text-body-md font-bold text-on-surface line-clamp-2 mb-2 leading-snug">
            {article.title}
          </h3>
        </Link>

        <p className="font-body-sm text-body-sm text-secondary line-clamp-2 mb-4 leading-relaxed">
          {article.excerpt}
        </p>
      </div>

      <div className="pt-3 border-t border-border-clean flex items-center justify-between font-label-telemetry text-label-telemetry text-secondary">
        <div className="flex items-center gap-2">
          {article.author?.avatar && (
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-border-clean">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-full h-full object-cover object-[35%_40%]"
              />
            </div>
          )}
          <span>{article.author?.name || 'Harry Kusumo'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>{article.publishedAt}</span>
          <span>·</span>
          <span className="text-primary font-medium">{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}
