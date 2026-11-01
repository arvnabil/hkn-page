import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import siteData from '../data/site.json';

const DEFAULT_ROOM_TYPES = [
  { value: 'huddle', label: 'Huddle (2-6 Orang)' },
  { value: 'medium', label: 'Ruang Sedang (6-12 Orang)' },
  { value: 'boardroom', label: 'Boardroom (12-25 Orang)' },
  { value: 'classroom', label: 'Classroom / Auditorium' },
];

const DEFAULT_PLATFORMS = [
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'zoom', label: 'Zoom Rooms' },
  { value: 'google', label: 'Google Meet' },
  { value: 'byod', label: 'BYOD / Multi-platform' },
];

export default function Inquiry({ site = siteData }) {
  const roomTypes = site?.inquiry?.roomTypes || DEFAULT_ROOM_TYPES;
  const platforms = site?.inquiry?.platforms || DEFAULT_PLATFORMS;

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    roomType: roomTypes[1]?.value || 'medium',
    dimensions: '',
    participants: '6-12',
    platform: platforms[0]?.value || 'teams',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Map roomType and participants to match backend schema
    let roomType = formData.roomType;
    if (roomType === 'classroom') roomType = 'auditorium';

    const payload = {
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      room_type: roomType,
      participant_count: parseInt(formData.participants) || null,
      current_platform: formData.platform === 'google' ? 'meet' : (formData.platform === 'byod' ? 'other' : formData.platform),
      budget_range: formData.dimensions || null,
      notes: formData.notes || null,
    };

    if (typeof window !== 'undefined' && window.__INERTIA__) {
      router.post('/penawaran', payload, {
        onSuccess: () => {
          setSubmitted(true);
          setLoading(false);
        },
        onError: (errs) => {
          setErrorMessage(Object.values(errs)[0] || 'Terjadi kesalahan pada input.');
          setLoading(false);
        },
      });
    } else {
      // Fallback for standalone preview / fetch
      fetch('/penawaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(payload),
      })
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch(() => {
        setSubmitted(true);
        setLoading(false);
      });
    }
  };

  return (
    <AppLayout title="Minta Penawaran Solusi AVer">
      <div className="mx-auto max-w-page px-gutter-mobile py-space-xl md:px-gutter md:py-space-2xl">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-10">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              FORM KONSULTASI & ESTIMASI BIAYA
            </span>
            <h1 className="text-3xl sm:text-4xl font-headline-lg font-extrabold text-on-surface">
              Minta Penawaran Solusi Ruang Rapat
            </h1>
            <p className="font-body-md text-secondary mt-2">
              Dapatkan rekomendasi perangkat AVer yang disesuaikan dengan denah fisik, sistem akustik, dan anggaran proyek organisasi Anda.
            </p>
          </div>

          <div className="ui-card p-6 sm:p-10 bg-surface-container-lowest">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-status-success/20 text-status-success mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface">Permintaan Penawaran Terkirim</h3>
                <p className="text-secondary max-w-md mx-auto text-sm leading-relaxed">
                  Terima kasih, {formData.name}. {site?.name || 'Harry Kusumo'} akan menganalisis spesifikasi ruangan Anda dan menghubungi kontak bisnis Anda dalam waktu 1x24 jam kerja.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-surface-alt border border-border-clean font-bold text-sm text-primary hover:bg-surface-container"
                  >
                    Kirim Form Baru
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-muted-slate uppercase mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Budi Pratama"
                      className="w-full px-4 py-2.5 bg-surface-alt border border-border-clean rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-slate uppercase mb-1">
                      Perusahaan / Institusi *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. PT Sinergi Nusantara"
                      className="w-full px-4 py-2.5 bg-surface-alt border border-border-clean rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-muted-slate uppercase mb-1">
                      Email Bisnis *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="budi@perusahaan.co.id"
                      className="w-full px-4 py-2.5 bg-surface-alt border border-border-clean rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-slate uppercase mb-1">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0812XXXXXXXX"
                      className="w-full px-4 py-2.5 bg-surface-alt border border-border-clean rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-muted-slate uppercase mb-1">
                      Tipe Ruangan
                    </label>
                    <select
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-alt border border-border-clean rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      {roomTypes.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-slate uppercase mb-1">
                      Dimensi (P × L × T)
                    </label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="e.g. 6m x 4m x 3m"
                      className="w-full px-4 py-2.5 bg-surface-alt border border-border-clean rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-slate uppercase mb-1">
                      Ekosistem Utama
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-alt border border-border-clean rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      {platforms.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-slate uppercase mb-1">
                    Catatan Khusus / Deskripsi Kebutuhan
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tuliskan tantangan pencahayaan, akustik kaca, atau integrasi display yang diharapkan..."
                    className="w-full px-4 py-2.5 bg-surface-alt border border-border-clean rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                  ></textarea>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-aver-red/10 border border-aver-red/30 text-aver-red text-xs font-mono">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-clean">
                  <span className="text-xs font-mono text-muted-slate">
                    * Data Anda dijamin kerahasiaannya untuk keperluan kalkulasi teknis.
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-on-primary font-title-md font-bold text-sm shadow-md hover:opacity-95 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Mengirim Data...' : 'Kirim Permintaan Penawaran'}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
