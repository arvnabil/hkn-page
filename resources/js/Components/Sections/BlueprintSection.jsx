import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import RoomBlueprint from '../RoomBlueprint';
import defaultSolutions from '../../data/solutions.json';
import defaultProducts from '../../data/products.json';

export default function BlueprintSection({
  title = "Studio Denah Interaktif & Arsitektur Solusi Ruang",
  subtitle = "SIMULASI FOV KAMERA & AKUSTIK AUDIO RUANG RAPAT",
  description = "Eksplorasi penempatan kamera AVer, sudut pandang optimal (*Field of View*), dan jangkauan mikrofon *beamforming* untuk berbagai denah ruang rapat korporat dan institusi.",
  badge = "INTERACTIVE BLUEPRINT STUDIO",
  default_room = "huddle",
}) {
  const [selectedRoomId, setSelectedRoomId] = useState(default_room);
  const activeSolution = defaultSolutions.find((s) => s.id === selectedRoomId) || defaultSolutions[0];

  return (
    <section className="py-16 md:py-24 bg-surface-alt border-b border-border-clean relative">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-border-clean">
          <div className="max-w-3xl">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border-clean font-mono text-xs text-primary font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-aver-red animate-pulse" />
                <span>{badge}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight tracking-tight mb-3">
              {title}
            </h2>
            <p className="font-body-md text-secondary leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {defaultSolutions.map((sol) => (
              <button
                key={sol.id}
                onClick={() => setSelectedRoomId(sol.id)}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                  selectedRoomId === sol.id
                    ? 'bg-aver-red text-white shadow-md shadow-aver-red/20'
                    : 'bg-surface hover:bg-surface-container border border-border-clean text-secondary'
                }`}
              >
                {sol.title.split('—')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Blueprint Viewer Card */}
        <div className="rounded-2xl border border-border-clean bg-surface overflow-hidden shadow-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-clean">
            <div>
              <span className="font-mono text-xs text-aver-red font-bold uppercase tracking-wider">
                {activeSolution.dimension} · KAPASITAS {activeSolution.capacity}
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-on-surface mt-1">
                {activeSolution.title}
              </h3>
            </div>

            <Link
              href="/solusi"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-alt hover:bg-surface-container border border-border-clean text-xs font-bold font-mono text-primary transition-all self-start sm:self-auto"
            >
              <span>Buka Studio Lengkap</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>

          <RoomBlueprint room={activeSolution} />
        </div>
      </div>
    </section>
  );
}

