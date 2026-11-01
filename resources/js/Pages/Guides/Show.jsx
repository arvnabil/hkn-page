import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import defaultGuides from '../../data/guides.json';
import defaultAdvisor from '../../data/advisor.json';
import siteData from '../../data/site.json';

export default function GuidesShow({
  guide = defaultGuides[0],
  guides = defaultGuides,
  advisor = defaultAdvisor,
  site = siteData,
}) {
  const advisorShort = advisor.shortName || advisor.name.split(' ')[0] || 'Harry';

  // Related guides (same topic or just others)
  const related = guides
    .filter((g) => g.slug !== guide.slug)
    .slice(0, 3);

  return (
    <AppLayout title={guide.title} site={site}>
      <div className="mx-auto max-w-page px-gutter-mobile py-space-2xl md:px-gutter md:py-space-3xl">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Main Content */}
          <main className="lg:col-span-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 font-mono text-xs text-secondary mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link href="/panduan" className="hover:text-primary transition-colors">Panduan</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-semibold truncate">{guide.topic}</span>
            </nav>

            {/* Header */}
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-primary mb-4">
                <span className="material-symbols-outlined text-sm">{guide.icon || 'menu_book'}</span>
                <span>{guide.topic}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight mb-4">
                {guide.title}
              </h1>
              <p className="font-body-md text-base text-secondary leading-relaxed mb-6">
                {guide.excerpt}
              </p>
              <div className="flex items-center gap-4 font-mono text-xs text-muted-slate border-t border-border-clean pt-4">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  {guide.publishedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {guide.readTime}
                </span>
              </div>
            </header>

            {/* Thumbnail */}
            {guide.thumbnail && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-border-clean">
                <img
                  src={guide.thumbnail}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none text-on-surface font-body-md leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: guide.content || '<p></p>' }}
            />

            {/* CTA Bottom */}
            <div className="mt-12 ui-card p-6 bg-surface-alt flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-1">
                <h3 className="font-heading text-base font-bold text-on-surface mb-1">Butuh Bantuan Lebih Lanjut?</h3>
                <p className="font-body-md text-sm text-secondary">Konsultasikan kebutuhan ruang rapat Anda langsung dengan {advisorShort}.</p>
              </div>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-mono text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">chat</span>
                Konsultasi Gratis
              </a>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">

            {/* Consultation Card */}
            <div className="ui-card p-5 bg-surface-alt">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border-clean">
                  <img src={advisor.photo} alt={advisor.name} className="w-full h-full object-cover object-[35%_40%]" />
                </div>
                <div>
                  <div className="font-title-md text-sm font-bold text-on-surface">{advisor.name}</div>
                  <div className="font-mono text-[10px] text-primary">{advisor.role}</div>
                </div>
              </div>
              <p className="font-body-md text-xs text-secondary mb-4 leading-relaxed">
                {advisor.bio}
              </p>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-mono text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                Hubungi {advisorShort}
              </a>
            </div>

            {/* Related Guides */}
            {related.length > 0 && (
              <div className="ui-card p-5">
                <h3 className="font-mono text-xs text-muted-slate uppercase tracking-widest mb-4">PANDUAN TERKAIT</h3>
                <div className="space-y-4">
                  {related.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/panduan/${g.slug}`}
                      className="flex gap-3 group"
                    >
                      {g.thumbnail && (
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
                          <img src={g.thumbnail} alt={g.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[10px] text-primary mb-0.5">{g.topic}</div>
                        <div className="font-body-md text-xs font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {g.title}
                        </div>
                        <div className="font-mono text-[10px] text-muted-slate mt-1">{g.readTime}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product CTA */}
            <div className="ui-card p-5">
              <h3 className="font-mono text-xs text-muted-slate uppercase tracking-widest mb-3">LIHAT PRODUK</h3>
              <p className="font-body-md text-xs text-secondary mb-3 leading-relaxed">
                Temukan kamera konferensi AVer yang tepat untuk ruang rapat Anda.
              </p>
              <Link
                href="/produk"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border-clean bg-surface-alt text-on-surface font-mono text-xs font-bold hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">videocam</span>
                Lihat Semua Produk
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

