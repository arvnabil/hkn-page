import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import defaultProducts from '../data/products.json';
import defaultAdvisor from '../data/advisor.json';
import siteData from '../data/site.json';

// Spec rows to compare — label: key path in product
const SPEC_ROWS = [
  { label: 'Zoom Total', key: 'zoom' },
  { label: 'Field of View', key: 'fov' },
  { label: 'Resolusi', key: 'resolution' },
  { label: 'Ukuran Ruangan', key: 'roomSize' },
  { label: 'Kategori', key: 'categoryLabel' },
];

const CERT_COLOR = {
  'Microsoft Teams': 'text-blue-600',
  'Zoom Rooms': 'text-blue-500',
  'Google Meet': 'text-green-600',
};

export default function Comparison({
  products = defaultProducts,
  advisor = defaultAdvisor,
  site = siteData,
}) {
  const advisorShort = advisor.shortName || advisor.name.split(' ')[0] || 'Harry';
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  // For display, limit to 3 products max (CAM550, CAM570, CAM520 Pro3 — exclude soundbar by default)
  const ptzProducts = products.filter((p) => p.category === 'ptz');
  const compareList = ptzProducts.length >= 2 ? ptzProducts : products.slice(0, 3);

  const filteredRows = showDiffOnly
    ? SPEC_ROWS.filter((row) => {
        const values = compareList.map((p) => p[row.key] || '—');
        return new Set(values).size > 1; // show only if values differ
      })
    : SPEC_ROWS;

  return (
    <AppLayout title="Perbandingan Kamera Konferensi AVer">
      <div className="mx-auto max-w-page px-gutter-mobile py-space-2xl md:px-gutter md:py-space-3xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-mono text-xs text-secondary mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/produk" className="hover:text-primary transition-colors">Produk</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-semibold">Perbandingan</span>
        </nav>

        {/* Header */}
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-primary mb-3">
            <span className="material-symbols-outlined text-sm">compare</span>
            <span>TABEL PERBANDINGAN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-on-surface mb-3">
            Perbandingan Kamera Konferensi AVer
          </h1>
          <p className="font-body-md text-base text-secondary leading-relaxed max-w-2xl mb-6">
            Bandingkan spesifikasi kamera AVer secara berdampingan untuk menemukan solusi yang paling sesuai dengan kebutuhan ruang rapat Anda.
          </p>

          {/* Toggle diff */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setShowDiffOnly((v) => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors ${showDiffOnly ? 'bg-primary' : 'bg-border-clean'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showDiffOnly ? 'translate-x-5' : ''}`} />
            </div>
            <span className="font-mono text-xs text-on-surface">Tampilkan Hanya Perbedaan</span>
          </label>
        </section>

        {/* Comparison Table */}
        <div className="ui-card overflow-x-auto mb-12">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border-clean">
                <th className="px-5 py-4 text-left font-mono text-xs text-muted-slate uppercase w-1/4">Spesifikasi</th>
                {compareList.map((p) => (
                  <th key={p.id} className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-lg bg-surface-alt flex items-center justify-center overflow-hidden mx-auto">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div>
                        <Link href={`/produk/${p.id}`} className="font-heading text-sm font-bold text-on-surface hover:text-primary transition-colors block">
                          {p.name}
                        </Link>
                        <span className="font-mono text-[10px] text-primary">{p.badge}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => {
                const values = compareList.map((p) => p[row.key] || '—');
                const allSame = new Set(values).size === 1;
                return (
                  <tr
                    key={row.key}
                    className={`border-b border-border-clean ${allSame ? 'opacity-70' : ''} ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}`}
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-slate border-r border-border-clean">{row.label}</td>
                    {values.map((val, j) => (
                      <td key={j} className="px-4 py-3 text-center font-body-md text-xs text-on-surface">
                        {val}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Certifications Row */}
              <tr className="border-b border-border-clean bg-surface">
                <td className="px-5 py-3 font-mono text-xs text-muted-slate border-r border-border-clean">Sertifikasi</td>
                {compareList.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {(p.certifications || []).map((cert) => (
                        <span key={cert} className={`font-mono text-[10px] px-2 py-0.5 rounded border border-border-clean ${CERT_COLOR[cert] || 'text-on-surface'}`}>
                          {cert}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Features Count Row */}
              <tr className="bg-surface-alt">
                <td className="px-5 py-3 font-mono text-xs text-muted-slate border-r border-border-clean">Fitur Utama</td>
                {compareList.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center">
                    <ul className="text-left space-y-1 inline-block">
                      {(p.features || []).map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-1.5 font-body-md text-[11px] text-on-surface">
                          <span className="material-symbols-outlined text-primary text-xs mt-0.5 shrink-0">check</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* CTA Row */}
              <tr className="bg-surface border-t-2 border-primary/20">
                <td className="px-5 py-4 font-mono text-xs text-muted-slate border-r border-border-clean">Aksi</td>
                {compareList.map((p) => (
                  <td key={p.id} className="px-4 py-4 text-center">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/produk/${p.id}`}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary text-on-primary font-mono text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        Detail
                      </Link>
                      <a
                        href={site.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border-clean bg-surface-alt text-on-surface font-mono text-xs font-bold hover:border-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        Tanya {advisorShort}
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <section className="ui-card p-8 text-center bg-surface-alt">
          <h2 className="font-heading text-xl font-bold text-on-surface mb-2">Butuh Rekomendasi Personal?</h2>
          <p className="font-body-md text-sm text-secondary mb-6 max-w-md mx-auto">
            {advisorShort} siap membantu Anda memilih kamera yang paling sesuai dengan layout ruang, jumlah peserta, dan platform konferensi Anda.
          </p>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-mono text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">chat</span>
            Konsultasi Gratis dengan {advisorShort}
          </a>
        </section>

      </div>
    </AppLayout>
  );
}

