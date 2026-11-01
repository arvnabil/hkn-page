import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import SectionRenderer from '../Components/SectionRenderer';

export default function DynamicPage({ page, sections = [], seo }) {
  if (!page) return null;

  return (
    <AppLayout title={page.title}>
      <Head>
        <title>{page.title} — AVer Solution Specialist</title>
        {page.meta_description && (
          <meta name="description" content={page.meta_description} />
        )}
      </Head>

      {/* Optional Breadcrumb Banner */}
      {page.show_breadcrumb && (
        <div className="bg-surface-alt border-b border-border-clean py-8 md:py-12 relative overflow-hidden">
          <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-slate mb-2">
              <a href="/" className="hover:text-primary transition-colors">Beranda</a>
              <span>/</span>
              <span className="text-on-surface font-semibold">{page.title}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface tracking-tight">
              {page.title}
            </h1>
          </div>
        </div>
      )}

      {/* Render Dynamic Sections */}
      <main>
        {sections && sections.length > 0 ? (
          sections.map((section, idx) => (
            <SectionRenderer
              key={section.id || idx}
              sectionKey={section.section_key}
              props={section.props || section.config || {}}
            />
          ))
        ) : (
          <div className="mx-auto max-w-page px-gutter py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-alt border border-border-clean mx-auto flex items-center justify-center text-secondary mb-4">
              <span className="material-symbols-outlined text-3xl">post_add</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-on-surface mb-2">
              Halaman Belum Memiliki Konten
            </h2>
            <p className="text-sm font-body-md text-secondary max-w-md mx-auto">
              Gunakan Visual Page Builder di admin panel untuk menambahkan blok Hero, Katalog Kamera, Blueprint Denah, atau Form Penawaran.
            </p>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
