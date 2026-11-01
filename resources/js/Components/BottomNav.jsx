import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import siteData from '../data/site.json';

export default function BottomNav({ site = siteData }) {
  const { url = '/' } = usePage ? usePage() : { url: window.location.pathname };

  const isActive = (href) => {
    if (href === '/' && url === '/') return true;
    if (href !== '/' && url.startsWith(href)) return true;
    return false;
  };

  const mobileNavItems = (site.navigation || []).slice(0, 5);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border-clean px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {mobileNavItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
              active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-[10px] font-label-mono mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
