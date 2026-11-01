import React from 'react';
import AppLayout from '../Layouts/AppLayout';
import AdvisorHUDCard from '../Components/AdvisorHUDCard';
import defaultAdvisor from '../data/advisor.json';

export default function About({ advisor = defaultAdvisor }) {
  return (
    <AppLayout title={`Tentang ${advisor.name} — AVer Solutions Advisor`}>
      <div className="mx-auto max-w-page px-gutter-mobile py-space-xl md:px-gutter md:py-space-2xl">
        
        {/* HERO SECTION */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-alt border border-border-clean rounded-full font-mono text-xs text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>PROFIL ADVISOR · AVER SOLUTIONS ADVISOR</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-on-surface tracking-tight leading-tight">
                {advisor.name}
              </h1>

              <p className="text-lg font-title-md font-bold text-primary">
                {advisor.tagline}
              </p>

              <p className="font-body-md text-secondary leading-relaxed">
                {advisor.bio}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={advisor.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-whatsapp text-white font-title-md font-bold shadow-md hover:bg-whatsapp-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>Chat WhatsApp</span>
                </a>
                <a
                  href={advisor.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border-clean text-on-surface font-title-md font-bold hover:bg-surface-alt transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">link</span>
                  <span>Hubungi via LinkedIn</span>
                </a>
              </div>

              {/* Specs Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border-clean font-mono text-xs">
                <div>
                  <span className="text-muted-slate block uppercase text-[10px]">DEDIKASI SPESIALIS</span>
                  <span className="text-on-surface font-bold mt-0.5 block">{advisor.metrics.specialty}</span>
                </div>
                <div>
                  <span className="text-muted-slate block uppercase text-[10px]">FOKUS RUANG</span>
                  <span className="text-on-surface font-bold mt-0.5 block">{advisor.metrics.roomFocus}</span>
                </div>
                <div>
                  <span className="text-muted-slate block uppercase text-[10px]">PENDEKATAN</span>
                  <span className="text-on-surface font-bold mt-0.5 block">{advisor.metrics.approach}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <AdvisorHUDCard advisor={advisor} />
            </div>

          </div>
        </section>

        {/* SERVICES / KOMPETENSI SECTION */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              LAYANAN & KOMPETENSI
            </span>
            <h2 className="text-2xl sm:text-3xl font-headline-md font-extrabold text-on-surface">
              Bagaimana Advisor Membantu Proyek Anda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisor.services.map((srv, idx) => (
              <div key={idx} className="ui-card p-6 bg-surface-container-lowest flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center font-bold mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="font-title-md text-base font-bold text-on-surface mb-2">
                    {srv.title}
                  </h3>
                  <p className="font-body-sm text-xs text-secondary leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
