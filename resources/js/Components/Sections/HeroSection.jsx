import React from 'react';
import { Link } from '@inertiajs/react';

export default function HeroSection({
  title = "Solusi Video Conference & Kamera PTZ Enterprise AVer",
  subtitle = "TEKNOLOGI HYBRID WORKPLACE RESMI",
  description = "Optimalisasi ruang rapat, auditorium, dan ruang kelas Anda dengan teknologi kamera tracking berbasis AI, audio array bersertifikasi Microsoft Teams & Zoom, serta garansi resmi 5 tahun.",
  badge = "AVer INDONESIA ENTERPRISE PARTNER",
  primary_btn_text = "Minta Penawaran B2B",
  primary_btn_url = "/penawaran",
  secondary_btn_text = "Eksplorasi Denah Solusi",
  secondary_btn_url = "/solusi",
  image = "/assets/img/hero-ptz.png",
  stats = [
    { value: "4K / 60fps", label: "Resolusi Optik Ultra HD" },
    { value: "30X", label: "Optical Zoom Lossless" },
    { value: "AI Tracking", label: "Voice & Preset Tracking Otomatis" },
    { value: "5 Tahun", label: "Garansi Resmi Enterprise" },
  ],
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-alt via-surface to-surface py-16 md:py-24 border-b border-border-clean">
      <div className="absolute inset-0 bg-[radial-gradient(#E52421_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aver-red/10 border border-aver-red/20 font-mono text-xs text-aver-red font-bold mb-6">
                <span className="w-2 h-2 rounded-full bg-aver-red animate-pulse" />
                <span>{badge}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-on-surface leading-[1.1] tracking-tight mb-6">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm sm:text-base font-mono text-primary font-bold uppercase tracking-wider mb-4">
                {subtitle}
              </p>
            )}

            <p className="font-body-md text-secondary text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              {primary_btn_text && (
                <Link
                  href={primary_btn_url || '/penawaran'}
                  className="px-6 py-3.5 rounded-xl bg-aver-red hover:bg-aver-red/90 text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-aver-red/25 hover:shadow-xl hover:shadow-aver-red/35 hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span>{primary_btn_text}</span>
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </Link>
              )}

              {secondary_btn_text && (
                <Link
                  href={secondary_btn_url || '/solusi'}
                  className="px-6 py-3.5 rounded-xl bg-surface-alt hover:bg-surface-container border border-border-clean text-on-surface font-bold text-sm sm:text-base transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span>{secondary_btn_text}</span>
                  <span className="material-symbols-outlined text-sm text-secondary">explore</span>
                </Link>
              )}
            </div>

            {/* Stats row */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-8 border-t border-border-clean/60">
                {stats.map((st, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-heading font-extrabold text-on-surface text-aver-red">
                      {st.value}
                    </span>
                    <span className="text-xs text-muted-slate font-mono mt-1 leading-snug">
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-gradient-to-tr from-surface-alt to-surface-container-high p-4 sm:p-6 border border-border-clean shadow-2xl overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-aver-red/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-aver-blue/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-navy-card/90 flex items-center justify-center border border-border-clean">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  style={{ display: image ? 'none' : 'flex' }}
                  className="flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-aver-red/20 text-aver-red flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl">videocam</span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg">AVer Pro AV Solutions</h3>
                  <p className="text-xs text-gray-400 mt-1 font-mono">Premium 4K PTZ Camera Suite</p>
                </div>
              </div>

              {/* Status pill overlay */}
              <div className="mt-4 p-3 bg-surface/90 backdrop-blur rounded-xl border border-border-clean flex items-center justify-between text-xs font-mono">
                <span className="text-muted-slate flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live PoC Demo Available
                </span>
                <span className="text-primary font-bold">Jakarta & Surabaya</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

