import React from 'react';
import { Link } from '@inertiajs/react';
import AVerLogo from './AVerLogo';
import siteData from '../data/site.json';
import { Headset, Link2, MessageCircle, ShieldCheck, UsersRound, Video } from 'lucide-react';

export default function Footer({ site = siteData }) {
  return (
    <footer className="bg-surface-alt border-t border-border-clean mt-space-3xl pb-20 md:pb-12 text-on-surface">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter py-12">
        
        {/* Top Trust & Certification Banner (AVer Ecosystem) */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-border-clean mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck aria-hidden="true" size={24} className="text-primary mb-1" />
            <span className="font-heading font-bold text-xs text-on-surface">Garansi 3+2 Tahun</span>
            <span className="font-mono text-[10px] text-muted-slate">Standar Industri AVer</span>
          </div>
          <div className="flex flex-col items-center">
            <UsersRound aria-hidden="true" size={24} className="text-primary mb-1" />
            <span className="font-heading font-bold text-xs text-on-surface">Microsoft Teams</span>
            <span className="font-mono text-[10px] text-muted-slate">Certified Rooms System</span>
          </div>
          <div className="flex flex-col items-center">
            <Video aria-hidden="true" size={24} className="text-primary mb-1" />
            <span className="font-heading font-bold text-xs text-on-surface">Zoom Rooms</span>
            <span className="font-mono text-[10px] text-muted-slate">Certified Hardware</span>
          </div>
          <div className="flex flex-col items-center">
            <Headset aria-hidden="true" size={24} className="text-primary mb-1" />
            <span className="font-heading font-bold text-xs text-on-surface">Dedicated PoC</span>
            <span className="font-mono text-[10px] text-muted-slate">Uji Coba Denah Gratis</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Info with Official AVer Logotype */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <AVerLogo size="md" subtitle={site.role} />
            </div>
            <p className="font-body-sm text-body-sm text-secondary leading-relaxed max-w-sm">
              Pusat kurasi solusi video konferensi, pengujian komparatif optik, dan penataan ruang rapat berbasis ekosistem AVer Information Inc. untuk korporasi dan institusi pendidikan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-surface border border-border-clean flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Link2 aria-hidden="true" size={18} />
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-surface border border-border-clean flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle aria-hidden="true" size={18} />
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
