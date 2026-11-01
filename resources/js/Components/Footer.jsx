import React from 'react';
import { Link } from '@inertiajs/react';
import siteData from '../data/site.json';

export default function Footer({ site = siteData }) {
  return (
    <footer className="bg-surface-alt border-t border-border-clean mt-space-3xl pb-20 md:pb-12 text-on-surface">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-base shadow-sm">
                {site.initials}
              </div>
              <div>
                <div className="font-heading font-extrabold text-lg text-on-surface leading-none">
                  {site.title || site.name}
                </div>
                <div className="font-mono text-xs text-primary font-medium mt-1">
                  {site.role}
                </div>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-secondary leading-relaxed max-w-sm">
              Situs independen kurasi panduan teknis, pengujian optik, dan konsultasi konfigurasi ekosistem video conference AVer untuk kebutuhan korporasi dan institusi pendidikan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-surface border border-border-clean flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
                aria-label="LinkedIn"
              >
                <span className="material-symbols-outlined text-[18px]">link</span>
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-surface border border-border-clean flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
                aria-label="WhatsApp"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {site.footer.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <div className="font-label-mono text-label-telemetry font-bold text-primary uppercase">
                {col.title}
              </div>
              <ul className="space-y-2 font-body-sm text-body-sm text-secondary">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 border-t border-border-clean flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-slate">
          <div>
            © {new Date().getFullYear()} {site.title || site.name}. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-4">
            <span>AVer adalah merek dagang terdaftar dari AVer Information Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
