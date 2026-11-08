import React from 'react';
import { Crosshair } from 'lucide-react';
import advisorData from '../data/advisor.json';

export default function AdvisorHUDCard({ advisor = advisorData }) {
  return (
    <div className="ui-card relative w-full max-w-md bg-surface-alt p-4">
      {/* Reticle Frame Corners */}
      <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary pointer-events-none"></span>
      <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary pointer-events-none"></span>
      <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary pointer-events-none"></span>
      <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary pointer-events-none"></span>

      {/* Top HUD Status Bar */}
      <div className="flex items-center justify-between font-label-mono text-xs text-primary pb-2 border-b border-border-clean">
        <span className="flex items-center space-x-1.5 font-bold">
          <span className="text-[15px] animate-pulse">
            <Crosshair aria-hidden="true" size={16} strokeWidth={1.8} />
          </span>
          <span>[ADVISOR ID: {advisor.idCode}]</span>
        </span>
        <span className="bg-surface-container-lowest px-2 py-0.5 rounded border border-border-clean font-bold text-[10px] text-on-surface flex items-center gap-0.5">
          <span className="text-[#0B1F33] dark:text-white">AV</span><span className="text-[#E52421]">e</span><span className="text-[#0B1F33] dark:text-white">r</span>
          <span className="text-secondary ml-1 font-mono">OPTICS</span>
        </span>
      </div>

      {/* Portrait Image Container */}
      <div className="relative mt-3 rounded-lg overflow-hidden border border-border-clean aspect-[4/5] bg-surface-container-low flex items-center justify-center">
        <img
          className="w-full h-full object-cover object-top"
          alt={`${advisor.name} — ${advisor.role}`}
          src={advisor.photo}
        />

        {/* AI reticle bounding target indicator */}
        <div className="absolute inset-x-8 top-12 bottom-20 border border-dashed border-primary/40 rounded pointer-events-none flex flex-col justify-between p-2">
          <div className="flex justify-between items-center text-[10px] font-label-mono text-primary font-bold">
            <span>TARGET: ADVISOR</span>
            <span>FOV: RECOGNIZED</span>
          </div>
          <div className="self-end bg-surface-container-lowest/90 backdrop-blur px-2 py-0.5 rounded border border-border-clean text-[10px] font-label-mono text-primary">
            CAM_ACTIVE · AI FRAME
          </div>
        </div>

        {/* Lower Badge Overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/95 backdrop-blur-sm p-3 rounded-lg border border-border-clean shadow-sm">
          <div className="font-headline-sm text-title-md font-bold text-on-surface">
            {advisor.name}
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-label-telemetry text-label-telemetry text-primary font-semibold">
              {advisor.role}
            </span>
            <span className="font-label-mono text-[10px] text-muted-slate uppercase">
              ENTERPRISE AV
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="mt-3 pt-2.5 flex items-center justify-between font-label-telemetry text-label-telemetry text-muted-slate px-1">
        <span>PLATFORM: TEAMS / ZOOM / UVC</span>
        <span className="text-primary font-semibold">STATUS: {advisor.metrics?.status || 'SIAP KONSULTASI'}</span>
      </div>
    </div>
  );
}
