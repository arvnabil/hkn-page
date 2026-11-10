import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

export default function Error({ status = 404 }) {
  const errorDetails = {
    403: {
      title: 'Akses Dibatasi',
      description: 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.',
      badge: '403 · FORBIDDEN',
    },
    404: {
      title: 'Halaman Tidak Ditemukan',
      description: 'Halaman yang Anda cari tidak tersedia, telah dipindahkan, atau alamat URL yang dimasukkan salah.',
      badge: '404 · NOT FOUND',
    },
    500: {
      title: 'Terjadi Kesalahan Server',
      description: 'Terjadi gangguan internal pada server kami. Tim teknis sedang menangani masalah ini.',
      badge: '500 · SERVER ERROR',
    },
    503: {
      title: 'Layanan Sedang Maintenance',
      description: 'Sistem kami sedang dalam pemeliharaan berkala untuk peningkatan performa. Silakan coba kembali beberapa saat lagi.',
      badge: '503 · MAINTENANCE',
    },
  };

  const current = errorDetails[status] || errorDetails[404];

  return (
    <AppLayout title={`${status} — ${current.title}`}>
      <Head>
        <title>{`${status} — ${current.title}`}</title>
      </Head>

      <div className="mx-auto max-w-page px-gutter-mobile py-space-2xl md:px-gutter md:py-space-3xl flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aver-red/10 border border-aver-red/20 text-aver-red font-mono text-xs font-bold mb-6">
          <span className="w-2 h-2 rounded-full bg-aver-red animate-pulse" />
          <span>{current.badge}</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-heading font-extrabold text-on-surface tracking-tight mb-4">
          {status}
        </h1>

        <h2 className="text-xl sm:text-2xl font-heading font-bold text-on-surface mb-4">
          {current.title}
        </h2>

        <p className="font-body-md text-secondary max-w-md mx-auto mb-8 leading-relaxed text-sm sm:text-base">
          {current.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-3 rounded-xl bg-aver-red hover:bg-aver-red/90 text-white font-bold text-sm transition-all shadow-md shadow-aver-red/20 inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/solusi"
            className="px-5 py-3 rounded-xl bg-surface-alt hover:bg-surface-container border border-border-clean text-on-surface font-bold text-sm transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">explore</span>
            <span>Eksplorasi Solusi AVer</span>
          </Link>

          <Link
            href="/penawaran"
            className="px-5 py-3 rounded-xl bg-surface-alt hover:bg-surface-container border border-border-clean text-secondary hover:text-on-surface font-bold text-sm transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">contact_support</span>
            <span>Bantuan & Penawaran</span>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
