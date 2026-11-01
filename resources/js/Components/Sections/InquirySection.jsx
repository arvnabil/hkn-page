import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function InquirySection({
  title = "Minta Penawaran Resmi & Jadwalkan PoC",
  subtitle = "KONSULTASI GRATIS DENGAN EXPERT AVer INDONESIA",
  description = "Isi formulir kebutuhan ruang rapat atau proyek Anda di bawah ini. Tim kami akan mengirimkan proposal harga resmi dan menghubungi Anda dalam 1x24 jam kerja.",
  badge = "B2B LEADS & INQUIRY",
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    room_type: 'Boardroom (12-20 Orang)',
    budget_range: '50-100jt',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    router.post('/penawaran', formData, {
      preserveScroll: true,
      onSuccess: () => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Permintaan Berhasil Dikirim',
          text: 'Terima kasih! Proposal resmi dan jadwal PoC akan segera kami kirimkan ke email Anda.',
          confirmButtonColor: '#E52421',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          room_type: 'Boardroom (12-20 Orang)',
          budget_range: '50-100jt',
          notes: '',
        });
      },
      onError: (err) => {
        setLoading(false);
        setErrors(err);
      },
    });
  };

  return (
    <section className="py-16 md:py-24 bg-surface-alt border-b border-border-clean relative">
      <div className="mx-auto max-w-3xl px-gutter-mobile md:px-gutter">
        <div className="text-center mb-10">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border-clean font-mono text-xs text-aver-red font-bold mb-3">
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

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-surface border border-border-clean shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono font-bold text-secondary uppercase mb-1.5">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-alt border border-border-clean text-sm text-on-surface focus:outline-none focus:border-aver-red focus:ring-1 focus:ring-aver-red"
                placeholder="cth. Hendra Gunawan"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-secondary uppercase mb-1.5">
                Email Kantor / Bisnis *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-alt border border-border-clean text-sm text-on-surface focus:outline-none focus:border-aver-red focus:ring-1 focus:ring-aver-red"
                placeholder="hendra@perusahaan.co.id"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-secondary uppercase mb-1.5">
                Nomor WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-alt border border-border-clean text-sm text-on-surface focus:outline-none focus:border-aver-red focus:ring-1 focus:ring-aver-red"
                placeholder="081234567890"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-secondary uppercase mb-1.5">
                Nama Perusahaan / Institusi *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-alt border border-border-clean text-sm text-on-surface focus:outline-none focus:border-aver-red focus:ring-1 focus:ring-aver-red"
                placeholder="PT Solusi Digital Pratama"
              />
              {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono font-bold text-secondary uppercase mb-1.5">
                Tipe Ruangan
              </label>
              <select
                value={formData.room_type}
                onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-alt border border-border-clean text-sm text-on-surface focus:outline-none focus:border-aver-red"
              >
                <option value="Huddle Room (2-6 Orang)">Huddle Room (2-6 Orang)</option>
                <option value="Medium Conference (6-12 Orang)">Medium Conference (6-12 Orang)</option>
                <option value="Boardroom (12-20 Orang)">Boardroom (12-20 Orang)</option>
                <option value="Auditorium & Townhall (50+ Orang)">Auditorium & Townhall (50+ Orang)</option>
                <option value="Ruang Kelas / Smart Classroom">Ruang Kelas / Smart Classroom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-secondary uppercase mb-1.5">
                Estimasi Anggaran
              </label>
              <select
                value={formData.budget_range}
                onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-alt border border-border-clean text-sm text-on-surface focus:outline-none focus:border-aver-red"
              >
                <option value="< 25jt">&lt; Rp 25 Juta</option>
                <option value="25-50jt">Rp 25 - 50 Juta</option>
                <option value="50-100jt">Rp 50 - 100 Juta</option>
                <option value="> 100jt">&gt; Rp 100 Juta</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-mono font-bold text-secondary uppercase mb-1.5">
              Catatan Kebutuhan Tambahan
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-alt border border-border-clean text-sm text-on-surface focus:outline-none focus:border-aver-red"
              placeholder="Sebutkan platform konferensi (Teams/Zoom), dimensi ruangan, atau rencana jadwal demonstrasi/PoC..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-aver-red hover:bg-aver-red/90 text-white font-bold text-base transition-all shadow-lg shadow-aver-red/25 hover:shadow-xl hover:shadow-aver-red/35 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Mengirim Permintaan...</span>
            ) : (
              <>
                <span>Kirim Permintaan Penawaran Resmi</span>
                <span className="material-symbols-outlined text-sm font-bold">send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
