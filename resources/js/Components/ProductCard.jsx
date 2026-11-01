import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
  return (
    <div className="ui-card ui-card--interactive group bg-surface-container-lowest p-5 flex flex-col justify-between">
      <div>
        <div className="relative w-full aspect-[4/3] bg-surface-alt rounded-lg overflow-hidden mb-4 p-3 flex items-center justify-center border border-border-clean">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-label-mono bg-surface-container-lowest/90 text-primary font-bold border border-border-clean">
            {product.badge}
          </span>
        </div>

        <div className="font-label-mono text-label-telemetry text-muted-slate uppercase mb-1">
          {product.categoryLabel}
        </div>
        <h3 className="font-headline-sm text-title-md font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="font-body-sm text-body-sm text-secondary line-clamp-2 mb-4">
          {product.tagline}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4 p-2.5 bg-surface-alt rounded-lg border border-border-clean">
          <div>
            <span className="text-muted-slate block text-[10px]">ZOOM</span>
            <span className="text-on-surface font-semibold">{product.zoom}</span>
          </div>
          <div>
            <span className="text-muted-slate block text-[10px]">RESOLUSI</span>
            <span className="text-on-surface font-semibold">{product.resolution}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border-clean flex items-center justify-between">
        <span className="font-body-sm text-xs text-secondary truncate max-w-[160px]">
          {product.roomSize}
        </span>
        <Link
          href={`/produk/${product.id}`}
          className="inline-flex items-center gap-1 font-body-sm text-xs font-bold text-primary group-hover:underline"
        >
          <span>Detail</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
