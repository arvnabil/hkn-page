import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import defaultProducts from '../../data/products.json';

const SPEC_ROWS = [
  { label: 'Resolusi Video', key: 'resolution', getValue: (p) => p.resolution || '4K Ultra HD' },
  { label: 'Zoom Optik', key: 'zoom', getValue: (p) => p.zoom || '—' },
  { label: 'Sudut Pandang (FOV)', key: 'fov', getValue: (p) => p.fov || '—' },
  { label: 'Rekomendasi Ruang', key: 'roomSize', getValue: (p) => p.roomSize || 'Medium - Large' },
  { label: 'AI Tracking Mode', key: 'tracking', getValue: (p) => p.tags?.includes('Auto-Tracking') ? 'Voice & Preset Tracking' : 'Smart Gallery / Framing' },
  { label: 'Garansi Resmi', key: 'warranty', getValue: (p) => p.warranty || '3+2 Tahun Garansi Resmi' },
];

export default function ComparisonSection({
  title = "Matriks Perbandingan Kamera PTZ AVer",
  subtitle = "KOMPARASI SPESIFIKASI TEKNIS & FITUR ENTERPRISE",
  description = "Bandingkan resolusi optik, kemampuan zoom, sudut pandang fov, dan sertifikasi platform antar tipe kamera AVer untuk memilih perangkat yang paling tepat.",
  badge = "TECHNICAL SPECIFICATION MATRIX",
  product_1 = "cam570",
  product_2 = "cam550",
  product_3 = "cam520-pro3",
}) {
  const [selectedIds, setSelectedIds] = useState([product_1, product_2, product_3].filter(Boolean));

  const compareList = selectedIds
    .map((id) => defaultProducts.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <section className="py-16 md:py-24 bg-surface-alt border-b border-border-clean relative">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border-clean">
          <div className="max-w-2xl">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border-clean font-mono text-xs text-primary font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-aver-red animate-pulse" />
                <span>{badge}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight tracking-tight mb-3">
              {title}
            </h2>
            <p className="font-body-md text-secondary leading-relaxed">
              {description}
            </p>
          </div>

          <Link
            href="/komparasi"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-container border border-border-clean font-mono text-xs font-bold text-primary transition-all self-start md:self-auto"
          >
            <span>Buka Komparator Interaktif</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </Link>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-border-clean bg-surface overflow-x-auto shadow-xl">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-border-clean bg-surface-container-low">
                <th className="p-4 sm:p-6 w-1/4 text-xs font-mono font-bold text-muted-slate uppercase tracking-wider">
                  Fitur / Parameter
                </th>
                {compareList.map((p) => (
                  <th key={p.id} className="p-4 sm:p-6 text-center">
                    <div className="w-20 h-20 mx-auto rounded-xl bg-navy-card/80 p-2 mb-3 border border-border-clean flex items-center justify-center">
                      <img src={p.thumbnail} alt={p.name} className="max-h-full object-contain" />
                    </div>
                    <span className="text-sm font-heading font-extrabold text-on-surface block">
                      {p.name}
                    </span>
                    <span className="text-xs text-muted-slate font-mono block mt-0.5">
                      {p.categoryLabel}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-clean font-body-md text-sm">
              {SPEC_ROWS.map((row, idx) => (
                <tr key={row.key} className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-alt/40'}>
                  <td className="p-4 sm:p-5 font-mono text-xs font-bold text-secondary">
                    {row.label}
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 sm:p-5 text-center text-on-surface font-medium">
                      {row.getValue(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4 sm:p-5 font-mono text-xs font-bold text-secondary">Aksi Penawaran</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 sm:p-5 text-center">
                    <Link
                      href={`/penawaran?product=${p.id}`}
                      className="inline-block px-4 py-2 rounded-lg bg-aver-red hover:bg-aver-red/90 text-white font-bold text-xs transition-all shadow-sm"
                    >
                      Minta Penawaran
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
