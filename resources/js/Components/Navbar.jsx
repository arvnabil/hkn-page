import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AVerLogo from './AVerLogo';
import ThemeToggle from './ThemeToggle';
import siteData from '../data/site.json';
import { BookOpen, DoorOpen, FileText, Home as HomeIcon, Menu, Newspaper, UserRound, Video, X } from 'lucide-react';

const navIcons = {
  home: HomeIcon,
  videocam: Video,
  article: Newspaper,
  meeting_room: DoorOpen,
  menu_book: BookOpen,
  person: UserRound,
};

const navIconsByPath = {
  '/': 'home',
  '/produk': 'videocam',
  '/artikel': 'article',
  '/solusi': 'meeting_room',
  '/panduan': 'menu_book',
  '/tentang': 'person',
};

export default function Navbar({ site = siteData }) {
  const page = usePage ? usePage() : { url: window.location.pathname, props: {} };
  const { url = '/' } = page;
  const databaseMenu = page.props?.menus?.primary;
  // Keep the Harry navigation's established labels, order and icons while
  // taking each destination from the matching database menu item.
  const navigation = site.navigation.map((item) => {
    const dbItem = Array.isArray(databaseMenu)
      ? databaseMenu.find((candidate) => candidate.url === item.href)
      : null;

    return {
      ...item,
      href: dbItem?.url || item.href,
      icon: item.icon || navIconsByPath[item.href] || 'article',
    };
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/' && url === '/') return true;
    if (href !== '/' && url.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border-clean">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter min-h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo with Official AVer Signature */}
        <Link href="/" className="flex shrink-0 items-center gap-3 group">
          <AVerLogo size="sm" withSubtitle={false} />
          <div className="h-6 w-px bg-border-clean" />
          <div className="min-w-0">
            <div className="whitespace-nowrap font-heading font-extrabold text-on-surface text-sm leading-none flex items-center gap-1.5">
              <span>{site.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-aver-red" title="AVer Certified Specialist" />
            </div>
            <div className="whitespace-nowrap font-mono text-[10px] text-primary font-medium mt-0.5 tracking-tight">
              {site.role}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex flex-1 justify-center items-center gap-1 font-body-sm text-body-sm font-medium">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-2.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  active
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'text-on-surface hover:bg-surface-alt'
                }`}
              >
                {(() => { const Icon = navIcons[item.icon] || FileText; return <Icon aria-hidden="true" size={18} strokeWidth={1.8} />; })()}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & CTA */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Theme Switcher Button */}
          <ThemeToggle />

          <Link
            href={site.cta.href}
            className="hidden sm:inline-flex whitespace-nowrap items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-title-md text-body-sm font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            <FileText aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>{site.cta.label}</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-border-clean bg-surface-alt text-on-surface"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-border-clean bg-surface px-gutter-mobile py-4 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base ${
                  active
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'text-on-surface hover:bg-surface-alt'
                }`}
              >
                {(() => { const Icon = navIcons[item.icon] || FileText; return <Icon aria-hidden="true" size={20} strokeWidth={1.8} />; })()}
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 mt-2 border-t border-border-clean">
            <Link
              href={site.cta.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-center"
            >
              <FileText aria-hidden="true" size={18} strokeWidth={1.8} />
              <span>{site.cta.label}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
