import React from 'react';
import AdvisorHUDCard from '../AdvisorHUDCard';
import defaultAdvisor from '../../data/advisor.json';

export default function AdvisorSection({
  title = "AI Room Advisor & Recommendation HUD",
  subtitle = "SISTEM KONSULTASI INTERAKTIF PERANGKAT RUANG RAPAT",
  description = "Tentukan kapasitas peserta, platform UC yang digunakan, dan tipe pencahayaan untuk mendapatkan simulasi konfigurasi kamera dan audio AVer yang paling ideal secara instan.",
  badge = "SIMULATOR TEKNIS CERDAS",
  advisorData = defaultAdvisor,
}) {
  return (
    <section className="py-16 md:py-24 bg-surface border-b border-border-clean relative">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
        <div className="max-w-3xl mb-12">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-primary font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm font-mono text-muted-slate uppercase tracking-wider mb-2">
              {subtitle}
            </p>
          )}
          <p className="font-body-md text-secondary text-base leading-relaxed">
            {description}
          </p>
        </div>

        <AdvisorHUDCard advisor={advisorData} />
      </div>
    </section>
  );
}

