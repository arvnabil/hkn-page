import React from 'react';
import AppLayout from '../Layouts/AppLayout';
import defaultSolutions from '../data/solutions.json';
import siteData from '../data/site.json';

export default function Solutions({ solutions = defaultSolutions, site = siteData }) {
  return (
    <AppLayout title="Solusi Ruang Rapat Hybrid dengan AVer">
      <div className="mx-auto max-w-page px-gutter-mobile py-space-xl md:px-gutter md:py-space-2xl">
        
        <div className="mb-12 max-w-3xl">
          <span className="font-mono text-xs font-bold text-primary uppercase block mb-1">
            ARSITEKTUR & TOPOLOGI RUANG
          </span>
          <h1 className="text-3xl sm:text-4xl font-headline-lg font-extrabold text-on-surface">
            Solusi Ruang Rapat Hybrid Berbasis AVer
          </h1>
          <p className="font-body-md text-secondary mt-2 leading-relaxed">
            Panduan konfigurasi hardware terintegrasi yang disesuaikan secara ilmiah dengan ukuran dimensi ruang, jarak pandang meja rapat, dan mitigasi akustik interior.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="space-y-8 mb-16">
          {solutions.map((sol, idx) => {
            const waUrl = `${site.whatsapp}?text=${encodeURIComponent(`Halo Harry, saya tertarik konsultasi solusi ${sol.title} (${sol.dimension})`)}`;
            return (
              <div key={sol.id} id={sol.id} className="ui-card p-6 sm:p-8 bg-surface-container-lowest">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                        0{idx + 1}
                      </span>
                      <div>
                        <h2 className="font-title-md text-xl font-bold text-on-surface">
                          {sol.title}
                        </h2>
                        <span className="font-mono text-xs text-primary font-semibold">
                          Dimensi Rekomendasi: {sol.dimension}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-surface-alt rounded-xl border border-border-clean">
                        <span className="font-mono text-[10px] text-muted-slate uppercase block font-bold mb-1">
                          TANTANGAN UTAMA
                        </span>
                        <p className="font-body-sm text-xs text-secondary leading-relaxed">
                          {sol.challenge}
                        </p>
                      </div>
                      <div className="p-4 bg-surface-alt rounded-xl border border-border-clean">
                        <span className="font-mono text-[10px] text-primary uppercase block font-bold mb-1">
                          SOLUSI AVER
                        </span>
                        <p className="font-body-sm text-xs text-secondary leading-relaxed">
                          {sol.solution}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="font-mono text-[10px] text-muted-slate uppercase block font-bold mb-2">
                        SPESIFIKASI KUNCI:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {sol.keySpecs.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-3 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-on-surface"
                          >
                            ✓ {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 p-5 bg-surface-alt rounded-2xl border border-primary/20 space-y-3">
                    <span className="font-mono text-[10px] text-primary font-bold uppercase block">
                      PAKET HARDWARE REKOMENDASI
                    </span>
                    <div className="font-title-md text-base font-bold text-on-surface">
                      {sol.recommended}
                    </div>
                    <p className="font-body-sm text-xs text-secondary leading-relaxed">
                      Siap diuji coba langsung di kantor Anda melalui program Proof of Concept (PoC) gratis.
                    </p>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-title-md text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                    >
                      <span>Konsultasikan Denah Ini</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
}
