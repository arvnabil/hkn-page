import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import defaultProducts from '../../data/products.json';
import { whatsappLink } from '../../lib/whatsapp';

const CERT_ICONS = {
  'Microsoft Teams': { icon: 'groups', color: 'text-blue-600', label: 'Teams' },
  'Zoom Rooms': { icon: 'videocam', color: 'text-blue-500', label: 'Zoom' },
  'Google Meet': { icon: 'meet_now', color: 'text-green-600', label: 'Meet' },
};

function specificationRows(specs, prefix = '') {
  return Object.entries(specs || {}).flatMap(([key, value]) => {
    const label = prefix ? `${prefix} · ${key}` : key;
    if (Array.isArray(value)) return [[label, value.join(', ')]];
    if (value && typeof value === 'object') return specificationRows(value, label);
    return value === null || value === '' ? [] : [[label, String(value)]];
  });
}

export default function ProductsShow({
  product = defaultProducts[0],
  products = defaultProducts,
}) {
  const gallery = [...new Set((product.images?.length ? product.images : [product.image]).filter(Boolean))];
  const [activeImage, setActiveImage] = useState(gallery[0] || product.image);

  useEffect(() => {
    const list = (product.images && product.images.length > 0) ? product.images : [product.image];
    setActiveImage(list[0] || product.image);
  }, [product.id, product.image, product.images]);

  // Related products (exclude current)
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  const summaryKeys = ['roomSize', 'zoom', 'resolution', 'fov', 'bestFor', 'warranty', 'badge', 'categoryLabel', 'certifications'];
  const specsEntries = specificationRows(product.technicalSpecs ?? Object.fromEntries(
    Object.entries(product.specs || {}).filter(([key]) => !summaryKeys.includes(key))
  ));
  const whatsappUrl = whatsappLink({ text: product.whatsapp_note || `Halo Harry, saya ingin konsultasi mengenai ${product.name}.`, position: 'product_detail', label: 'Konsultasi Gratis', campaign: 'product_consultation', entityType: 'product', entityId: product.databaseId, entitySlug: product.slug || product.id });

  return (
    <AppLayout title={`${product.name} — ${product.tagline}`}>
      <div className="mx-auto max-w-page px-gutter-mobile py-space-2xl md:px-gutter md:py-space-3xl">

        {/* Breadcrumb */}
        {product.show_breadcrumb !== false && <nav className="flex flex-wrap items-center gap-2 font-mono text-xs text-secondary mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/produk" className="hover:text-primary transition-colors">Produk</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-semibold">{product.name}</span>
        </nav>}

        {product.show_breadcrumb !== false && product.breadcrumb_image && (
          <img src={product.breadcrumb_image} alt="" className="w-full h-40 md:h-56 object-cover rounded-xl mb-8" />
        )}

        {/* Hero Section — 2 Column */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">

          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] rounded-xl border border-border-clean bg-surface-alt overflow-hidden flex items-center justify-center p-6 group">
              {/* Reticle Corners */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-primary" />

              {/* Badge label */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-lowest/90 backdrop-blur-sm border border-border-clean font-mono text-xs text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {product.badge}
                </span>
              </div>

              {/* FOV Badge */}
              {product.fov && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-mono text-xs border border-border-clean">
                    FOV {product.fov}
                  </span>
                </div>
              )}

              {activeImage ? <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-[1.02] transition-transform duration-300"
              /> : <span className="text-muted-slate">Gambar produk belum tersedia</span>}

            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-lg border-2 bg-surface-alt p-1 overflow-hidden transition-all focus:outline-none cursor-pointer ${
                    activeImage === img ? 'border-primary shadow-sm scale-105' : 'border-border-clean hover:border-primary/60 opacity-80 hover:opacity-100'
                  }`}
                  type="button"
                  aria-label={`Gambar ${i + 1} ${product.name}`}
                  aria-pressed={activeImage === img}
                >
                  <img src={img} alt={`${product.name} - tampilan ${i + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>}
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Category & Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-primary">
                <span className="material-symbols-outlined text-sm">videocam</span>
                {product.categoryLabel || product.category}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-mono text-xs border border-border-clean">
                {product.badge}
              </span>
            </div>

            {/* Name & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight mb-2">
                {product.name}
              </h1>
              <p className="font-body-md text-base text-secondary leading-relaxed">
                {product.tagline}
              </p>
              {product.sku && <p className="mt-3 text-xs font-mono text-muted-slate">SKU: {product.sku}</p>}
              {Number(product.price) > 0 && <p className="mt-4 text-xl font-bold text-primary">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(product.price))}</p>}
              {product.bestFor && <p className="mt-3 text-sm text-secondary">{product.bestFor}</p>}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-3">
              {product.zoom && (
                <div className="ui-card p-3 text-center">
                  <div className="font-mono text-[10px] text-muted-slate uppercase mb-1">ZOOM</div>
                  <div className="font-mono text-xs font-bold text-primary">{product.zoom}</div>
                </div>
              )}
              {product.fov && (
                <div className="ui-card p-3 text-center">
                  <div className="font-mono text-[10px] text-muted-slate uppercase mb-1">FOV</div>
                  <div className="font-mono text-xs font-bold text-primary">{product.fov}</div>
                </div>
              )}
              {product.resolution && (
                <div className="ui-card p-3 text-center">
                  <div className="font-mono text-[10px] text-muted-slate uppercase mb-1">RESOLUSI</div>
                  <div className="font-mono text-xs font-bold text-primary">{product.resolution}</div>
                </div>
              )}
            </div>

            {/* Room Size */}
            {product.roomSize && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-surface-alt border border-border-clean">
                <span className="material-symbols-outlined text-primary text-lg">meeting_room</span>
                <span className="font-body-md text-sm text-on-surface">{product.roomSize}</span>
              </div>
            )}

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="font-mono text-xs text-muted-slate uppercase tracking-widest mb-3">FITUR UTAMA</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">check_circle</span>
                      <span className="font-body-md text-sm text-on-surface leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div>
                <h2 className="font-mono text-xs text-muted-slate uppercase tracking-widest mb-3">SERTIFIKASI</h2>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => {
                    const info = CERT_ICONS[cert];
                    return (
                      <span key={cert} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-clean bg-surface-container-lowest font-mono text-xs ${info?.color || 'text-on-surface'}`}>
                        <span className="material-symbols-outlined text-sm">{info?.icon || 'verified'}</span>
                        {cert}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AVer Official Guarantee Badge */}
            {product.warranty && <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-alt border border-border-clean">
              <span className="material-symbols-outlined text-[#E52421] text-2xl">verified_user</span>
              <div className="text-xs">
                <span className="font-heading font-bold text-on-surface block">{product.warranty}</span>
              </div>
            </div>}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-mono text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                Konsultasi Gratis
              </a>
              <Link
                href="/perbandingan"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border-clean bg-surface-alt text-on-surface font-mono text-sm font-bold hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg">compare</span>
                Bandingkan Produk
              </Link>
            </div>
            {(product.datasheet_url || product.link_accommerce) && <div className="flex flex-wrap gap-4 text-sm font-semibold text-primary">
              {product.datasheet_url && <a href={product.datasheet_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Buka datasheet ↗</a>}
              {product.link_accommerce && <a href={product.link_accommerce} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Beli online ↗</a>}
            </div>}
          </div>
        </section>

        {[
          ['Deskripsi Produk', product.descriptionHtml],
          ['Detail Fitur', product.featuresHtml],
          ['Informasi Spesifikasi', product.specificationHtml],
        ].filter(([, html]) => html).map(([heading, html]) => (
          <section key={heading} className="mb-12">
            <h2 className="text-2xl font-bold mb-5">{heading}</h2>
            <div className="product-rich-content text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
          </section>
        ))}

        {/* Technical Specs Table */}
        {specsEntries.length > 0 && (
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold text-on-surface mb-6">Spesifikasi Teknis</h2>
            <div className="ui-card overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {specsEntries.map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}>
                      <td className="px-5 py-3 font-mono text-xs text-muted-slate uppercase w-1/3 border-r border-border-clean">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td className="px-5 py-3 font-body-md text-on-surface">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-on-surface mb-6">Produk Lainnya</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/produk/${p.id}`} className="ui-card p-4 flex gap-4 items-center hover:border-primary transition-colors group">
                  <div className="w-16 h-16 rounded-lg bg-surface-alt flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-primary mb-0.5">{p.badge}</div>
                    <div className="font-title-md text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{p.name}</div>
                    <div className="font-body-md text-xs text-secondary line-clamp-2">{p.tagline}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </AppLayout>
  );
}

