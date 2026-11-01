import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import defaultGuides from '../../data/guides.json';
import defaultAdvisor from '../../data/advisor.json';
import siteData from '../../data/site.json';

const ALL_TOPICS = 'Semua Topik';

export default function GuidesIndex({
  guides = defaultGuides,
  advisor = defaultAdvisor,
  site = siteData,
}) {
  const advisorShort = advisor.shortName || advisor.name.split(' ')[0] || 'Harry';
  const topics = [ALL_TOPICS, ...Array.from(new Set(guides.map((g) => g.topic)))];
  const [activeTopic, setActiveTopic] = useState(ALL_TOPICS);

  const filtered = activeTopic === ALL_TOPICS
    ? guides
    : guides.filter((g) => g.topic === activeTopic);

  return (
    <AppLayout title="Panduan Kamera Konferensi AVer">
      <div className="mx-auto max-w-page px-gutter-mobile py-space-2xl md:px-gutter md:py-space-3xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-mono text-xs text-secondary mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-semibold">Panduan</span>
        </nav>

        {/* Header */}
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-primary mb-3">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            <span>// KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-on-surface mb-3">
            Panduan & Topik Pembahasan
          </h1>
          <p className="font-body-md text-base text-secondary leading-relaxed max-w-2xl">
            Eksplorasi panduan mendalam tentang kamera konferensi, AI tracking, setup ruang rapat, dan rekomendasi produk AVer dari {advisor.name}.
          </p>
        </section>

        {/* Topic Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs font-medium border transition-colors ${
                activeTopic === topic
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-alt text-on-surface border-border-clean hover:border-primary hover:text-primary'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((guide) => (
            <Link
              key={guide.slug}
              href={`/panduan/${guide.slug}`}
              className="ui-card group flex flex-col overflow-hidden hover:border-primary transition-colors"
            >
              {/* Thumbnail */}
              {guide.thumbnail && (
                <div className="relative w-full aspect-video bg-surface-alt overflow-hidden">
                  <img
                    src={guide.thumbnail}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-sm border border-border-clean font-mono text-[10px] text-primary">
                      <span className="material-symbols-outlined text-xs">{guide.icon || 'menu_book'}</span>
                      {guide.topic}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1 gap-3">
                <h2 className="font-heading text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                  {guide.title}
                </h2>
                <p className="font-body-md text-sm text-secondary leading-relaxed flex-1 line-clamp-3">
                  {guide.excerpt}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-border-clean">
                  <span className="font-mono text-[10px] text-muted-slate">{guide.publishedAt}</span>
                  <span className="font-mono text-[10px] text-primary font-bold">{guide.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-secondary font-mono text-sm">
            Tidak ada panduan untuk topik ini.
          </div>
        )}

        {/* CTA */}
        <section className="ui-card p-8 text-center bg-surface-alt">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
            <h2 className="font-heading text-xl font-bold text-on-surface">Ada Pertanyaan Spesifik?</h2>
          </div>
          <p className="font-body-md text-sm text-secondary mb-6 max-w-md mx-auto">
            Konsultasikan kebutuhan ruang rapat Anda langsung dengan {advisorShort} — spesialis kamera konferensi AVer berpengalaman.
          </p>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-mono text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">chat</span>
            Tanya {advisorShort} via WhatsApp
          </a>
        </section>

      </div>
    </AppLayout>
  );
}

