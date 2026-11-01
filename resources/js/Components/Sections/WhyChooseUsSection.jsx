import React from 'react';
import { Link } from '@inertiajs/react';

export default function WhyChooseUsSection({
  title = "Mengapa Memilih Ekosistem Konferensi AVer?",
  subtitle = "KEUNGGULAN ENTERPRISE KELAS DUNIA",
  description = "Dirancang untuk memberikan pengalaman komunikasi video tanpa hambatan dengan kecerdasan buatan terdepan dan reliabilitas hardware bersertifikasi global.",
  badge = "ENTERPRISE ASSURANCE",
  features = [
    {
      title: "Teknologi AI Voice & Gesture Tracking",
      description: "Kamera mendeteksi pembicara aktif secara otomatis dan dapat dikendalikan cukup dengan lambaian tangan tanpa remote.",
      icon: "psychology",
    },
    {
      title: "Sertifikasi Resmi Teams, Zoom & Meet",
      description: "Kesesuaian protokol 100% tanpa delay, plug-and-play langsung tersambung dengan PC/Mac dan Microsoft Teams Rooms.",
      icon: "verified",
    },
    {
      title: "Garansi Resmi Terpanjang: Hingga 5 Tahun",
      description: "Garansi standar 3 tahun dengan opsi ekstensi 2 tahun cuma-cuma melalui registrasi online untuk ketenangan jangka panjang.",
      icon: "shield",
    },
    {
      title: "Dukungan Teknis & PoC Demo Lokal",
      description: "Tim ahli kami siap memberikan demonstrasi perangkat langsung di ruang rapat Anda sebelum proses pengadaan.",
      icon: "support_agent",
    },
  ],
  show_button = true,
  button_text = "Jadwalkan Demo / PoC",
  button_url = "/penawaran",
}) {
  return (
    <section className="py-16 md:py-24 bg-surface-alt border-b border-border-clean relative">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aver-red/10 border border-aver-red/20 font-mono text-xs text-aver-red font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-aver-red animate-pulse" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm font-mono text-muted-slate uppercase tracking-wider mb-3">
              {subtitle}
            </p>
          )}
          <p className="font-body-md text-secondary leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-surface border border-border-clean shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-alt border border-border-clean text-aver-red flex items-center justify-center mb-5 group-hover:bg-aver-red group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">{f.icon || 'star'}</span>
              </div>
              <h3 className="font-heading font-bold text-on-surface text-lg mb-2 leading-snug">
                {f.title}
              </h3>
              <p className="font-body-md text-secondary text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {show_button && (
          <div className="text-center">
            <Link
              href={button_url || '/penawaran'}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-aver-red hover:bg-aver-red/90 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
            >
              <span>{button_text}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
