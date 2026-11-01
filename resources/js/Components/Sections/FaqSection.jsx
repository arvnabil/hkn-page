import React, { useState } from 'react';

export default function FaqSection({
  title = "Pertanyaan Umum Seputar Solusi AVer (FAQ)",
  subtitle = "INFORMASI TEKNIS & PENGADAAN ENTERPRISE",
  description = "Temukan jawaban cepat mengenai garansi, kompatibilitas software, integrasi audio ceiling, hingga mekanisme uji coba perangkat (PoC).",
  badge = "FREQUENTLY ASKED QUESTIONS",
  items = [
    {
      question: "Apakah kamera AVer kompatibel dengan Microsoft Teams Rooms dan Zoom Rooms?",
      answer: "Ya, seluruh lini produk kamera AVer (seperti CAM570, CAM550, dan VB342 Pro) telah bersertifikasi resmi oleh Microsoft Teams dan Zoom, serta mendukung fitur kontrol native dari layar sentuh konsol ruang rapat.",
    },
    {
      question: "Bagaimana cara mengajukan Proof of Concept (PoC) di kantor kami?",
      answer: "Anda dapat mengisi formulir Permintaan Penawaran atau menghubungi Harry via WhatsApp. Tim teknis kami akan mengantarkan unit demo ke kantor Anda di wilayah Jabodetabek, Surabaya, dan sekitarnya.",
    },
    {
      question: "Berapa lama masa garansi resmi kamera AVer di Indonesia?",
      answer: "Semua kamera enterprise AVer dilengkapi garansi standar 3 tahun, dengan tambahan 2 tahun gratis (total 5 tahun) cukup dengan mendaftarkan nomor seri produk di portal registrasi resmi AVer.",
    },
    {
      question: "Apakah AVer bisa diintegrasikan dengan mikrofon ceiling pihak ketiga (Shure / Sennheiser)?",
      answer: "Sangat bisa. Seri kamera seperti CAM570 dan CAM550 mendukung integrasi audio-tracking via preset triggering dari DSP Shure IntelliMix, Sennheiser TeamConnect, dan Yamaha RM-CG.",
    },
  ],
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-surface border-b border-border-clean relative">
      <div className="mx-auto max-w-4xl px-gutter-mobile md:px-gutter">
        <div className="text-center mb-12">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-primary font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-aver-red animate-pulse" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight tracking-tight mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm font-mono text-muted-slate uppercase tracking-wider mb-2">
              {subtitle}
            </p>
          )}
          <p className="font-body-md text-secondary leading-relaxed">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-border-clean bg-surface-alt overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg text-on-surface hover:text-primary transition-colors"
                >
                  <span>{item.question}</span>
                  <span
                    className={`material-symbols-outlined text-xl text-secondary shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 font-body-md text-secondary text-sm sm:text-base leading-relaxed border-t border-border-clean/50 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
