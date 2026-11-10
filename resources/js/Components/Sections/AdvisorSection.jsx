import React from 'react';
import { Link } from '@inertiajs/react';
import AdvisorHUDCard from '../AdvisorHUDCard';
import defaultAdvisor from '../../data/advisor.json';

export default function AdvisorSection({
  badge = "PROFIL ADVISOR · KONSULTASI PROFESIONAL",
  tagline = "Membantu Anda memilih solusi kolaborasi terbaik",
  bio = "Berdedikasi mendampingi organisasi, institusi pendidikan, dan konsultan arsitektur ruang dalam merancang ekosistem video konferensi modern. Fokus utama pada pemilihan konfigurasi kamera optik presisi dan teknologi AI tracking AVer yang selaras dengan dimensi fisik dan kebutuhan interaksi pengguna.",
  specialty = "AVer Optics & PTZ Systems",
  room_focus = "Huddle Space hingga Auditorium",
  approach = "Konsultatif Edukatif & Audit Fisik",
  whatsapp_text = "Konsultasi WhatsApp",
  whatsapp_url = "https://wa.me/6281200000000?text=Halo%20Harry,%20saya%20ingin%20konsultasi%20solusi%20AVer",
  profile_text = "Lihat Profil Lengkap",
  profile_url = "/tentang",
  advisorData = defaultAdvisor,
}) {
  const currentAdvisor = {
    ...defaultAdvisor,
    ...(advisorData || {}),
    tagline: tagline || defaultAdvisor.tagline,
    bio: bio || defaultAdvisor.bio,
    whatsapp: whatsapp_url || defaultAdvisor.whatsapp,
    metrics: {
      ...defaultAdvisor.metrics,
      specialty: specialty || defaultAdvisor.metrics.specialty,
      roomFocus: room_focus || defaultAdvisor.metrics.roomFocus,
      approach: approach || defaultAdvisor.metrics.approach,
    },
  };

  return (
    <section className="mb-16 py-12 border-y border-border-clean bg-surface-container-low/40 rounded-3xl p-6 sm:p-12">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <AdvisorHUDCard advisor={currentAdvisor} />
          </div>

          <div className="lg:col-span-7 space-y-6">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-alt border border-border-clean rounded-full font-label-mono text-xs text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{badge}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl font-headline-lg font-extrabold text-on-surface tracking-tight leading-tight">
              {tagline || currentAdvisor.tagline}
            </h2>

            <p className="text-secondary font-body-md leading-relaxed">
              {bio || currentAdvisor.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-clean">
              <div>
                <span className="text-[10px] font-mono text-muted-slate block uppercase">SPESIALISASI</span>
                <span className="font-title-md text-sm font-bold text-on-surface">
                  {specialty || currentAdvisor.metrics.specialty}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-slate block uppercase">FOKUS RUANG</span>
                <span className="font-title-md text-sm font-bold text-on-surface">
                  {room_focus || currentAdvisor.metrics.roomFocus}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-slate block uppercase">PENDEKATAN</span>
                <span className="font-title-md text-sm font-bold text-on-surface">
                  {approach || currentAdvisor.metrics.approach}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {whatsapp_text && (
                <a
                  href={currentAdvisor.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-whatsapp text-white font-title-md font-bold shadow-md hover:bg-whatsapp-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>{whatsapp_text}</span>
                </a>
              )}
              {profile_text && (
                <Link
                  href={profile_url || '/tentang'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border-clean text-on-surface font-title-md font-bold hover:bg-surface-alt transition-colors"
                >
                  <span>{profile_text}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
