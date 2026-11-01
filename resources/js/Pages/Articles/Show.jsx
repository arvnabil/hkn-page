import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import defaultArticles from '../../data/articles.json';
import defaultAdvisor from '../../data/advisor.json';
import siteData from '../../data/site.json';

export default function ArticleShow({
  article = defaultArticles[0],
  advisor = defaultAdvisor,
  site = siteData,
}) {
  const authorName = article.author?.name || advisor.name;
  const authorRole = article.author?.role || advisor.role;
  const authorAvatar = article.author?.avatar || advisor.photo;
  const authorBio = article.author?.bio || advisor.bio;
  const advisorShort = advisor.shortName || advisor.name.split(' ')[0] || 'Harry';

  return (
    <AppLayout title={article.title} site={site}>
      <article className="mx-auto max-w-4xl px-gutter-mobile py-space-xl md:px-gutter md:py-space-2xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-secondary mb-4">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          <span>•</span>
          <Link href="/artikel" className="hover:text-primary">Artikel</Link>
          <span>•</span>
          <span className="text-primary truncate">{article.category}</span>
        </div>

        {/* Title & Metadata */}
        <header className="mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-alt border border-border-clean rounded-full font-mono text-xs text-primary">
            <span>{article.category}</span>
            {article.telemetry && <span>· {article.telemetry}</span>}
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-on-surface leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="pt-4 border-t border-border-clean flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-border-clean overflow-hidden shrink-0">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-full h-full object-cover object-[35%_40%]"
                />
              </div>
              <div>
                <div className="font-title-md text-base font-bold text-on-surface">
                  {authorName}
                </div>
                <div className="font-mono text-xs text-primary font-medium">
                  {authorRole}
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-secondary">
              <div>{article.publishedAt}</div>
              <div className="text-primary font-bold">{article.readTime}</div>
            </div>
          </div>
        </header>

        {/* Main Banner Image */}
        {article.thumbnail && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-border-clean shadow-sm">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose prose-lg max-w-none text-on-surface font-body-md leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: article.content || '<p></p>' }}
        />

        {/* Author Footer Bio */}
        <footer className="mt-16 pt-8 border-t border-border-clean">
          <div className="ui-card p-6 sm:p-8 bg-surface-container-lowest flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-full border-2 border-primary overflow-hidden shrink-0">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-full h-full object-cover object-[35%_40%]"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-title-md text-lg font-bold text-on-surface">
                  {authorName}
                </h3>
                <span className="font-mono text-xs bg-surface-alt text-primary px-2.5 py-0.5 rounded border border-border-clean">
                  {authorRole}
                </span>
              </div>
              <p className="font-body-md text-sm text-secondary leading-relaxed">
                {authorBio}
              </p>
              <div className="pt-2">
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>Konsultasi Denah Bersama {advisorShort}</span>
                </a>
              </div>
            </div>
          </div>
        </footer>

      </article>
    </AppLayout>
  );
}
