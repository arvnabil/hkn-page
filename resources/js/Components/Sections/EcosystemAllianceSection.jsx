import React from 'react';
import { UsersRound, Video, MonitorCheck, ShieldCheck } from 'lucide-react';

export default function EcosystemAllianceSection({
  brand_title = "AVer",
  alliance_label = "ECOSYSTEM ALLIANCE",
  item_1 = "Microsoft Teams Certified",
  item_2 = "Zoom Rooms Certified",
  item_3 = "Google Meet Compatible",
  item_4 = "3+2 Years Warranty",
}) {
  return (
    <section className="mb-14">
      <div className="mx-auto max-w-page px-gutter-mobile md:px-gutter">
        <div className="py-4 px-6 rounded-2xl bg-surface-alt border border-border-clean flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-sm text-[#0B1F33]">
              AV<span className="text-[#E52421]">e</span>r
            </span>
            <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider">
              {alliance_label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-xs text-secondary">
            {item_1 && (
              <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <UsersRound aria-hidden="true" size={16} className="text-blue-600" />
                {item_1}
              </span>
            )}
            {item_2 && (
              <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Video aria-hidden="true" size={16} className="text-blue-500" />
                {item_2}
              </span>
            )}
            {item_3 && (
              <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <MonitorCheck aria-hidden="true" size={16} className="text-green-600" />
                {item_3}
              </span>
            )}
            {item_4 && (
              <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <ShieldCheck aria-hidden="true" size={16} className="text-amber-600" />
                {item_4}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
