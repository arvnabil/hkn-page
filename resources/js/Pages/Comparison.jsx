import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import defaultProducts from '../data/products.json';
import defaultAdvisor from '../data/advisor.json';
import siteData from '../data/site.json';

// Spec rows definition with dynamic value resolvers
const SPEC_ROWS = [
  { label: 'Kategori Perangkat', key: 'categoryLabel', getValue: (p) => p.categoryLabel || '—' },
  { label: 'Rekomendasi Ruangan', key: 'roomSize', getValue: (p) => p.roomSize || '—' },
  { label: 'Resolusi Video', key: 'resolution', getValue: (p) => p.resolution || '—' },
  { label: 'Kapasitas Zoom', key: 'zoom', getValue: (p) => p.zoom || '—' },
  { label: 'Sudut Pandang (FOV)', key: 'fov', getValue: (p) => p.fov || '—' },
  { label: 'Sensor Optik', key: 'sensor', getValue: (p) => p.specs?.sensor || 'Sony 4K Sensor' },
  { label: 'Port & Konektivitas', key: 'ports', getValue: (p) => p.specs?.ports || 'USB 3.1, HDMI, IP' },
  { label: 'Garansi Resmi', key: 'warranty', getValue: (p) => p.warranty || '3+2 Tahun Garansi Resmi AVer' },
];

const CERT_COLOR = {
  'Microsoft Teams': 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Zoom Rooms': 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
  'Google Meet': 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export default function Comparison({
  products = defaultProducts,
  advisor = defaultAdvisor,
  site = siteData,
}) {
  const advisorShort = advisor.shortName || advisor.name.split(' ')[0] || 'Harry';

  // Default to PTZ products (CAM550, CAM570, CAM520 Pro3) or first 3 products
  const defaultSelected = useMemo(() => {
    const ptz = products.filter((p) => p.category === 'ptz').map((p) => p.id);
    return ptz.length >= 2 ? ptz.slice(0, 3) : products.slice(0, 3).map((p) => p.id);
  }, [products]);

  const [selectedIds, setSelectedIds] = useState(defaultSelected);
  const [showDiffOnly, setShowDiffOnly] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3200);
  };

  // Resolve currently compared product objects in selection order
  const compareList = useMemo(() => {
    return selectedIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);
  }, [selectedIds, products]);

  // Unselected products available to add
  const availableToAdd = useMemo(() => {
    return products.filter((p) => !selectedIds.includes(p.id));
  }, [products, selectedIds]);

  // Toggle product in/out of comparison
  const toggleProduct = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) {
        showNotice('Minimal 2 produk untuk dibandingkan berdampingan.');
        return;
      }
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length >= 4) {
        showNotice('Maksimal 4 produk dalam satu tabel perbandingan.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Swap a specific column's product with another
  const swapProduct = (columnIndex, newId) => {
    if (!newId) return;
    const next = [...selectedIds];
    next[columnIndex] = newId;
    setSelectedIds(Array.from(new Set(next)));
  };

  // Remove single column
  const removeColumn = (id) => {
    if (selectedIds.length <= 2) {
      showNotice('Minimal 2 produk untuk dibandingkan berdampingan.');
      return;
    }
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };

  // Presets
  const applyPreset = (preset) => {
    if (preset === 'ptz') {
      const ptz = products.filter((p) => p.category === 'ptz').map((p) => p.id);
      setSelectedIds(ptz.slice(0, 3));
    } else if (preset === 'all') {
      setSelectedIds(products.slice(0, 4).map((p) => p.id));
    } else if (preset === 'dual_vs_tracking') {
      setSelectedIds(['cam550', 'cam570']);
    }
  };

  // Dynamic WhatsApp consultation link with currently compared product names
  const dynamicWaUrl = useMemo(() => {
    const names = compareList.map((p) => p.name).join(' vs ');
    const text = encodeURIComponent(
      `Halo ${advisorShort}, saya sedang membandingkan [${names}] di website. Bisa minta rekomendasi mana yang paling pas untuk ruang rapat kantor kami?`
    );
    const baseWa = site.whatsapp ? site.whatsapp.split('?')[0] : 'https://wa.me/6281200000000';
    return `${baseWa}?text=${text}`;
  }, [compareList, advisorShort, site.whatsapp]);

  // Spec rows filtering based on diff toggle
  const filteredRows = showDiffOnly
    ? SPEC_ROWS.filter((row) => {
        const values = compareList.map((p) => row.getValue(p));
        return new Set(values).size > 1; // only keep rows where values differ
      })
    : SPEC_ROWS;

  return (
    <AppLayout title="Perbandingan Kamera Konferensi AVer">
      <div className="mx-auto max-w-page px-gutter-mobile py-space-2xl md:px-gutter md:py-space-3xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-mono text-xs text-secondary mb-8 print:hidden" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/produk" className="hover:text-primary transition-colors">Produk</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-semibold">Perbandingan</span>
        </nav>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-aver-navy text-white text-xs font-mono shadow-xl border border-aver-blue/30 animate-fade-in">
            <span className="material-symbols-outlined text-aver-blue text-sm">info</span>
            <span>{notification}</span>
          </div>
        )}

        {/* Header Section */}
        <section className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-primary mb-3">
            <span className="material-symbols-outlined text-sm">compare</span>
            <span>TABEL PERBANDINGAN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-on-surface mb-3">
            Perbandingan Kamera Konferensi AVer
          </h1>
          <p className="font-body-md text-base text-secondary leading-relaxed max-w-3xl mb-6">
            Bandingkan spesifikasi kamera AVer secara berdampingan untuk menemukan solusi yang paling sesuai dengan kebutuhan ruang rapat Anda. Pilih produk secara bebas atau gunakan preset rekomendasi kami.
          </p>

          {/* Interactive Product Selector Box */}
          <div className="ui-card p-4 sm:p-5 mb-6 border-border-clean bg-surface-alt/70 print:hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <div>
                <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider block">
                  PILIH PRODUK UNTUK DIBANDINGKAN ({compareList.length} dari {products.length} Terpilih):
                </span>
                <span className="text-xs text-secondary font-body-md">
                  Klik kartu produk untuk menambah atau mengurangi dari tabel perbandingan (2 - 4 produk).
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="text-secondary text-[10px] uppercase font-semibold">Preset:</span>
                <button
                  type="button"
                  onClick={() => applyPreset('ptz')}
                  className="px-2.5 py-1 rounded-md border border-border-clean bg-surface hover:border-primary text-on-surface transition-colors"
                >
                  Kamera PTZ (3)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('all')}
                  className="px-2.5 py-1 rounded-md border border-border-clean bg-surface hover:border-primary text-on-surface transition-colors"
                >
                  Bandingkan Semua (4)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('dual_vs_tracking')}
                  className="px-2.5 py-1 rounded-md border border-border-clean bg-surface hover:border-primary text-on-surface transition-colors"
                >
                  CAM550 vs CAM570
                </button>
              </div>
            </div>

            {/* Product Toggle Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {products.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProduct(p.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30'
                        : 'border-border-clean bg-surface hover:border-primary/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center p-1 shrink-0 overflow-hidden border border-border-clean">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-heading text-xs font-bold text-on-surface truncate">
                          {p.name}
                        </span>
                        <span
                          className={`material-symbols-outlined text-sm shrink-0 ${
                            isSelected ? 'text-primary' : 'text-muted-slate'
                          }`}
                        >
                          {isSelected ? 'check_circle' : 'add_circle'}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-secondary truncate block">
                        {p.categoryLabel || p.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
            {/* Diff Toggle */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setShowDiffOnly((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showDiffOnly ? 'bg-primary' : 'bg-border-clean'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    showDiffOnly ? 'translate-x-5' : ''
                  }`}
                />
              </div>
              <span className="font-mono text-xs text-on-surface font-semibold">
                Tampilkan Hanya Perbedaan
              </span>
              {showDiffOnly && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {filteredRows.length} dari {SPEC_ROWS.length} Spesifikasi
                </span>
              )}
            </label>

            {/* Quick Actions (Print + Consult) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-clean bg-surface hover:bg-surface-alt font-mono text-xs text-on-surface transition-colors"
                title="Cetak atau Simpan sebagai PDF"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Cetak / PDF</span>
              </button>
              <a
                href={dynamicWaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-mono text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Konsultasikan Perbandingan</span>
              </a>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <div className="ui-card overflow-x-auto mb-12 shadow-sm">
          <table className="w-full min-w-[700px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-border-clean bg-surface-alt/50">
                <th className="px-5 py-4 text-left font-mono text-xs text-muted-slate uppercase w-1/5 align-bottom">
                  <div className="pb-2">Spesifikasi Teknis</div>
                  <div className="text-[10px] text-secondary font-normal font-sans">
                    {compareList.length} Produk Dibandingkan
                  </div>
                </th>
                {compareList.map((p, idx) => (
                  <th key={p.id} className="px-4 py-4 text-center align-top relative min-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      {/* Column Controls (Swap selector & Remove button) */}
                      <div className="flex items-center justify-between w-full mb-1 print:hidden">
                        <select
                          aria-label={`Ganti produk kolom ${idx + 1}`}
                          value={p.id}
                          onChange={(e) => swapProduct(idx, e.target.value)}
                          className="font-mono text-[10px] bg-surface border border-border-clean rounded px-1.5 py-0.5 text-secondary hover:text-primary focus:outline-none focus:border-primary max-w-[130px] truncate"
                        >
                          {products.map((item) => (
                            <option key={item.id} value={item.id} disabled={selectedIds.includes(item.id) && item.id !== p.id}>
                              {item.name} {selectedIds.includes(item.id) && item.id !== p.id ? '(Terpasang)' : ''}
                            </option>
                          ))}
                        </select>

                        {compareList.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeColumn(p.id)}
                            className="p-1 text-muted-slate hover:text-aver-red transition-colors"
                            title={`Hapus ${p.name} dari perbandingan`}
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        )}
                      </div>

                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 rounded-xl bg-surface-alt flex items-center justify-center overflow-hidden mx-auto border border-border-clean p-1.5 shadow-sm">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>

                      {/* Name & Badge */}
                      <div>
                        <Link
                          href={`/produk/${p.id}`}
                          className="font-heading text-sm font-bold text-on-surface hover:text-primary transition-colors block"
                        >
                          {p.name}
                        </Link>
                        <span className="font-mono text-[10px] text-primary font-semibold">
                          {p.badge}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}

                {/* Slot to add another product if < 4 */}
                {compareList.length < 4 && availableToAdd.length > 0 && (
                  <th className="px-4 py-4 text-center align-middle w-40 border-l border-dashed border-border-clean print:hidden">
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border-clean bg-surface-alt/30 text-center">
                      <span className="material-symbols-outlined text-secondary text-2xl mb-1">add_circle_outline</span>
                      <span className="font-mono text-[11px] text-secondary font-semibold mb-2">Tambah Kamera</span>
                      <select
                        aria-label="Tambah produk ke perbandingan"
                        onChange={(e) => {
                          if (e.target.value) toggleProduct(e.target.value);
                          e.target.value = '';
                        }}
                        defaultValue=""
                        className="font-mono text-[10px] bg-surface border border-border-clean rounded px-2 py-1 text-primary hover:border-primary focus:outline-none"
                      >
                        <option value="" disabled>Pilih Produk...</option>
                        {availableToAdd.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>

              {/* ADVISOR RECOMMENDATION ROW (HIGHLIGHT TIP) */}
              <tr className="border-b-2 border-primary/20 bg-primary/5">
                <td className="px-5 py-4 font-mono text-xs font-bold text-primary border-r border-border-clean align-middle">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">tips_and_updates</span>
                    <span>Rekomendasi Advisor ({advisorShort})</span>
                  </div>
                  <span className="text-[10px] text-secondary font-normal font-sans block mt-0.5">
                    Analisis penempatan terbaik
                  </span>
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="px-4 py-4 text-center align-top">
                    <div className="p-2.5 rounded-lg bg-surface border border-primary/20 text-left shadow-sm">
                      <div className="flex items-center gap-1 mb-1 font-mono text-[10px] font-bold text-primary uppercase">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        <span>Cocok Untuk:</span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface leading-snug">
                        {p.bestFor || p.tagline}
                      </p>
                    </div>
                  </td>
                ))}
                {compareList.length < 4 && availableToAdd.length > 0 && <td className="print:hidden"></td>}
              </tr>

              {/* DYNAMIC SPEC ROWS */}
              {filteredRows.map((row, i) => {
                const values = compareList.map((p) => row.getValue(p));
                const allSame = new Set(values).size === 1;
                return (
                  <tr
                    key={row.key}
                    className={`border-b border-border-clean transition-colors ${
                      allSame ? 'opacity-80' : ''
                    } ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-alt/40'}`}
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-slate border-r border-border-clean font-medium">
                      {row.label}
                    </td>
                    {values.map((val, j) => (
                      <td key={j} className="px-4 py-3 text-center font-body-md text-xs text-on-surface">
                        <span className={!allSame ? 'font-semibold text-primary' : ''}>
                          {val}
                        </span>
                      </td>
                    ))}
                    {compareList.length < 4 && availableToAdd.length > 0 && <td className="print:hidden"></td>}
                  </tr>
                );
              })}

              {/* CERTIFICATIONS ROW */}
              <tr className="border-b border-border-clean bg-surface">
                <td className="px-5 py-3 font-mono text-xs text-muted-slate border-r border-border-clean font-medium">
                  Sertifikasi Resmi
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center align-middle">
                    <div className="flex flex-wrap justify-center gap-1">
                      {(p.certifications || []).map((cert) => (
                        <span
                          key={cert}
                          className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                            CERT_COLOR[cert] || 'text-on-surface border-border-clean bg-surface-alt'
                          }`}
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
                {compareList.length < 4 && availableToAdd.length > 0 && <td className="print:hidden"></td>}
              </tr>

              {/* KEY FEATURES ROW */}
              <tr className="bg-surface-alt/40 border-b border-border-clean">
                <td className="px-5 py-4 font-mono text-xs text-muted-slate border-r border-border-clean align-top font-medium">
                  Fitur Unggulan
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="px-4 py-4 text-center align-top">
                    <ul className="text-left space-y-1.5 inline-block w-full">
                      {(p.features || []).map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-1.5 font-body-md text-[11px] text-on-surface">
                          <span className="material-symbols-outlined text-primary text-xs mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
                {compareList.length < 4 && availableToAdd.length > 0 && <td className="print:hidden"></td>}
              </tr>

              {/* ACTIONS / CTA ROW */}
              <tr className="bg-surface border-t-2 border-primary/20 print:hidden">
                <td className="px-5 py-4 font-mono text-xs text-muted-slate border-r border-border-clean align-middle font-medium">
                  Aksi & Konsultasi
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="px-4 py-4 text-center">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/produk/${p.id}`}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary text-on-primary font-mono text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        Detail Produk
                      </Link>
                      <a
                        href={`${site.whatsapp ? site.whatsapp.split('?')[0] : 'https://wa.me/6281200000000'}?text=${encodeURIComponent(
                          `Halo ${advisorShort}, saya tertarik dengan spesifikasi ${p.name}. Bisa jelaskan ketersediaan dan penawarannya?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border-clean bg-surface-alt text-on-surface font-mono text-xs font-bold hover:border-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm text-emerald-500">chat</span>
                        Tanya {p.name.replace('AVer ', '')}
                      </a>
                    </div>
                  </td>
                ))}
                {compareList.length < 4 && availableToAdd.length > 0 && <td className="print:hidden"></td>}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Bottom Consultation Callout Box */}
        <section className="ui-card p-6 sm:p-8 text-center bg-surface-alt border border-border-clean print:hidden">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">support_agent</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-on-surface mb-2">
            Masih Ragu Menentukan Kamera yang Tepat?
          </h2>
          <p className="font-body-md text-sm text-secondary mb-6 max-w-lg mx-auto">
            {advisorShort} siap membantu Anda mengukur dimensi ruangan, akustik, dan jarak pandang meja secara ilmiah melalui sesi konsultasi teknis gratis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={dynamicWaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-mono text-sm font-bold hover:opacity-90 transition-opacity shadow-md"
            >
              <span className="material-symbols-outlined">chat</span>
              Konsultasikan Perbandingan Ini dengan {advisorShort}
            </a>
            <Link
              href="/solusi"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border-clean bg-surface text-on-surface font-mono text-sm font-bold hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined">floor</span>
              Simulasi Denah Ruang di Halaman Solusi
            </Link>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
