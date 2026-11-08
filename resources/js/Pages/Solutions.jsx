import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import RoomBlueprint from '../Components/RoomBlueprint';
import defaultSolutions from '../data/solutions.json';
import defaultProducts from '../data/products.json';
import siteData from '../data/site.json';

export default function Solutions({
  solutions = defaultSolutions,
  products = defaultProducts,
  site = siteData,
}) {
  const [selectedRoomId, setSelectedRoomId] = useState(solutions[0]?.id || 'huddle');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'hardware' | 'acoustic'
  const [viewMode, setViewMode] = useState('studio'); // 'studio' | 'matrix'

  const activeSolution = solutions.find((s) => s.id === selectedRoomId) || solutions[0];

  // Match recommended products from products.json
  const matchedProducts = products.filter((p) =>
    activeSolution.products?.includes(p.id)
  );

  const waUrl = `${site.whatsapp}?text=${encodeURIComponent(
    `Halo Harry, saya tertarik konsultasi denah ${activeSolution.title} (${activeSolution.dimension}, kapasitas ${activeSolution.capacity}). Mohon rekomendasi teknis dan jadwal PoC.`
  )}`;

  return (
    <AppLayout title="Solusi Ruang Rapat Hybrid — Studio Arsitektur AVer" site={site}>
      <div className="mx-auto max-w-page px-gutter-mobile py-space-xl md:px-gutter md:py-space-2xl">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-border-clean">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-alt border border-border-clean rounded-full font-mono text-xs text-primary mb-3">
              <span className="w-2 h-2 rounded-full bg-aver-red animate-pulse" />
              <span>AVer ROOM ARCHITECTURE & INTERACTIVE STUDIO</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-on-surface leading-tight tracking-tight">
              Solusi Ruang Rapat Hybrid Berbasis AVer
            </h1>
            <p className="font-body-md text-secondary mt-3 leading-relaxed">
              Eksplorasi simulasi denah interaktif, sudut pandang kamera (*FOV*), radius tangkapan audio, dan rekomendasi paket hardware yang disesuaikan secara ilmiah dengan ukuran dimensi ruang Anda.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-surface-alt border border-border-clean rounded-xl self-start lg:self-end">
            <button
              type="button"
              onClick={() => setViewMode('studio')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                viewMode === 'studio'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_in_ar</span>
              <span>Studio Interaktif</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              <span>Bandingkan Semua (4)</span>
            </button>
          </div>
        </div>

        {viewMode === 'studio' ? (
          <>
            {/* 1. INTERACTIVE ROOM SELECTOR CARDS */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-3 font-mono text-xs text-secondary">
                <span className="uppercase font-bold text-primary">1. PILIH TIPE RUANG RAPAT:</span>
                <span className="hidden sm:inline">Pilih salah satu denah untuk melihat simulasi penataan</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {solutions.map((sol) => {
                  const isSelected = sol.id === selectedRoomId;
                  return (
                    <button
                      key={sol.id}
                      type="button"
                      onClick={() => setSelectedRoomId(sol.id)}
                      className={`ui-card text-left p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? 'border-2 border-primary bg-surface-container-lowest shadow-md scale-[1.02]'
                          : 'bg-surface-alt hover:border-primary/50 hover:bg-surface-container-lowest'
                      }`}
                    >
                      {/* Active indicator dot */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          AKTIF
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`w-9 h-9 rounded-lg flex items-center justify-center material-symbols-outlined text-lg ${
                              isSelected ? 'bg-primary text-on-primary' : 'bg-surface border border-border-clean text-primary'
                            }`}
                          >
                            <span className="inline-flex w-full h-full items-center justify-center text-center leading-none">
                              {sol.icon || 'meeting_room'}
                            </span>
                          </span>
                        </div>
                        <h3 className="font-heading font-extrabold text-sm sm:text-base text-on-surface line-clamp-1 mb-1">
                          {sol.title}
                        </h3>
                        <div className="font-mono text-xs font-semibold text-primary">
                          {sol.capacity}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border-clean flex items-center justify-between font-mono text-[11px] text-secondary">
                        <span>{sol.dimension}</span>
                        <span className="font-bold text-on-surface">{sol.area}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. INTERACTIVE BLUEPRINT & ARCHITECTURAL SIMULATOR */}
            <section className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left (7 Cols): SVG Interactive Blueprint Visualizer */}
                <div className="lg:col-span-7">
                  <div className="flex items-center justify-between mb-3 font-mono text-xs">
                    <span className="uppercase font-bold text-primary">2. SIMULASI PENATAAN & SUDUT PANDANG OPTIK:</span>
                    <span className="text-secondary text-[11px]">FOV: {activeSolution.cameraFov}° | Audio: {activeSolution.micRange}</span>
                  </div>
                  <RoomBlueprint solution={activeSolution} />
                </div>

                {/* Right (5 Cols): Technical Breakdown & Actions */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Studio Navigation Sub-tabs */}
                  <div className="flex border-b border-border-clean text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className={`pb-2.5 px-3 font-bold border-b-2 transition-colors ${
                        activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-on-surface'
                      }`}
                    >
                      Analisis Ruang
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('hardware')}
                      className={`pb-2.5 px-3 font-bold border-b-2 transition-colors ${
                        activeTab === 'hardware' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-on-surface'
                      }`}
                    >
                      Hardware Rekomendasi ({matchedProducts.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('acoustic')}
                      className={`pb-2.5 px-3 font-bold border-b-2 transition-colors ${
                        activeTab === 'acoustic' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-on-surface'
                      }`}
                    >
                      Mitigasi Akustik
                    </button>
                  </div>

                  {/* Tab 1: Overview (Tantangan vs Solusi) */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="p-4 bg-surface-alt rounded-2xl border border-border-clean space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-status-warning uppercase">
                          <span className="material-symbols-outlined text-sm">warning</span>
                          <span>Tantangan Fisik & Akustik Ruang:</span>
                        </div>
                        <p className="font-body-sm text-xs sm:text-sm text-secondary leading-relaxed">
                          {activeSolution.challenge}
                        </p>
                      </div>

                      <div className="p-4 bg-primary-fixed/20 rounded-2xl border border-primary/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span>Solusi Rekayasa AVer:</span>
                        </div>
                        <p className="font-body-sm text-xs sm:text-sm text-on-surface leading-relaxed">
                          {activeSolution.solution}
                        </p>
                      </div>

                      {/* Key Specs Pills */}
                      <div className="pt-2">
                        <span className="font-mono text-[10px] text-muted-slate uppercase font-bold block mb-2">
                          FITUR UTAMA PENATAAN DENAH:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeSolution.keySpecs.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-3 py-1.5 rounded-lg bg-surface-alt border border-border-clean font-mono text-xs text-on-surface flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-primary text-xs">check</span>
                              <span>{spec}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Hardware Showcase with Real Product Cards */}
                  {activeTab === 'hardware' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="p-4 bg-surface-alt rounded-2xl border border-border-clean">
                        <div className="font-mono text-[10px] text-primary uppercase font-bold mb-1">
                          PAKET UTAMA YANG DIREKOMENDASIKAN
                        </div>
                        <h4 className="font-heading font-extrabold text-base text-on-surface mb-1">
                          {activeSolution.recommended}
                        </h4>
                        <p className="font-body-sm text-xs text-secondary mb-4">
                          Perangkat di bawah siap diuji coba langsung di ruangan Anda melalui fasilitas Proof of Concept (PoC) gratis.
                        </p>

                        <div className="space-y-3">
                          {matchedProducts.map((prod) => (
                            <div key={prod.id} className="p-3 bg-surface-container-lowest rounded-xl border border-border-clean flex items-center gap-3">
                              <div className="w-16 h-16 rounded-lg bg-surface-alt flex items-center justify-center overflow-hidden shrink-0">
                                <img src={prod.image} alt={prod.name} className="w-full h-full object-contain p-1" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-mono text-[10px] text-primary block">{prod.badge}</span>
                                <h5 className="font-heading font-bold text-sm text-on-surface truncate">{prod.name}</h5>
                                <span className="font-mono text-xs text-secondary block">{prod.zoom} · {prod.fov}</span>
                              </div>
                              <Link
                                href={`/produk/${prod.id}`}
                                className="px-3 py-1.5 rounded-lg bg-surface-alt border border-border-clean font-mono text-xs font-bold hover:border-primary hover:text-primary transition-colors shrink-0"
                              >
                                Detail
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Acoustic & Setup Advice */}
                  {activeTab === 'acoustic' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="p-4 bg-surface-alt rounded-2xl border border-border-clean space-y-3">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase">
                          <span className="material-symbols-outlined text-base">graphic_eq</span>
                          <span>Pedoman Akustik Ruang:</span>
                        </div>
                        <p className="font-body-sm text-xs sm:text-sm text-secondary leading-relaxed">
                          {activeSolution.acousticTips}
                        </p>
                        <div className="pt-2 border-t border-border-clean font-mono text-xs space-y-2 text-on-surface">
                          <div className="flex justify-between">
                            <span className="text-secondary">Posisi Kamera Ideal:</span>
                            <span className="font-bold text-primary">{activeSolution.cameraPlacement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-secondary">Jarak Meja ke Layar:</span>
                            <span className="font-bold text-primary">{activeSolution.tableDistance}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-secondary">Radius Mic Optimal:</span>
                            <span className="font-bold text-primary">{activeSolution.micRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action CTA Box */}
                  <div className="p-5 rounded-2xl bg-surface-alt border border-border-clean flex flex-col gap-3">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 px-5 rounded-xl bg-primary text-on-primary font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      <span>Konsultasikan Denah Ini via WhatsApp</span>
                    </a>
                    <Link
                      href="/penawaran"
                      className="w-full py-3 px-5 rounded-xl border border-border-clean bg-surface-container-lowest text-on-surface font-mono text-xs font-bold text-center hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">request_quote</span>
                      <span>Minta Form Penawaran Resmi & PoC</span>
                    </Link>
                  </div>

                </div>

              </div>
            </section>
          </>
        ) : (
          /* MATRIX / COMPARISON OF ALL 4 ROOMS */
          <section className="mb-16 space-y-8 animate-in fade-in">
            {solutions.map((sol, idx) => {
              const solWa = `${site.whatsapp}?text=${encodeURIComponent(`Halo Harry, saya tertarik konsultasi solusi ${sol.title} (${sol.dimension})`)}`;
              return (
                <div key={sol.id} id={sol.id} className="ui-card p-6 sm:p-8 bg-surface-container-lowest">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                          0{idx + 1}
                        </span>
                        <div>
                          <h2 className="font-heading text-xl font-bold text-on-surface">
                            {sol.title}
                          </h2>
                          <span className="font-mono text-xs text-primary font-semibold">
                            Dimensi: {sol.dimension} ({sol.area}) · Kapasitas: {sol.capacity}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-surface-alt rounded-xl border border-border-clean">
                          <span className="font-mono text-[10px] text-muted-slate uppercase block font-bold mb-1">
                            TANTANGAN RUANG
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
                        href={solWa}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                      >
                        <span>Konsultasikan Denah Ini</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* BOTTOM PoC GUARANTEE BANNER */}
        <section className="ui-card p-8 bg-surface-alt text-center border border-border-clean">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aver-red/10 text-aver-red font-mono text-xs font-bold border border-aver-red/20">
              <span className="material-symbols-outlined text-sm">verified</span>
              PROGRAM PROOF OF CONCEPT (PoC) GRATIS
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-on-surface">
              Uji Coba Kamera AVer Langsung di Ruang Rapat Anda
            </h2>
            <p className="font-body-md text-sm text-secondary leading-relaxed">
              Harry Kusumo dan tim teknis siap membawa unit demo AVer (CAM550, CAM570, VB342 Pro) untuk disimulasikan langsung di meja dan akustik ruangan kantor Anda sebelum pengadaan.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-mono text-sm font-bold shadow-md hover:opacity-95 transition-opacity"
              >
                <span className="material-symbols-outlined">calendar_month</span>
                Jadwalkan PoC di Kantor Anda
              </a>
              <Link
                href="/perbandingan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border-clean bg-surface-container-lowest text-on-surface font-mono text-sm font-bold hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined">compare</span>
                Bandingkan Spesifikasi Hardware
              </Link>
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
