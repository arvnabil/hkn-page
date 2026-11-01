import React from 'react';

export default function RichTextSection({
  title = "Tentang AVer Information Inc.",
  subtitle = "GLOBAL LEADER IN INTELLIGENT AUDIO-VISUAL TECHNOLOGY",
  content = "<p>Didirikan pada tahun 2008, AVer Information Inc. adalah penyedia solusi teknologi video conference dan kamera AI terkemuka di dunia. Dengan fokus mendalam pada riset optik dan kecerdasan buatan, AVer dipercaya oleh ribuan korporasi Fortune 500, universitas terkemuka, dan lembaga pemerintahan di seluruh dunia.</p><p>Melalui kemitraan strategis dengan Microsoft, Zoom, dan Google, AVer terus menghadirkan inovasi mutakhir seperti voice tracking multi-kamera, framing otomatis cerdas, serta manajemen cloud tersentralisasi.</p>",
  badge = "COMPANY OVERVIEW",
}) {
  return (
    <section className="py-16 md:py-24 bg-surface border-b border-border-clean relative">
      <div className="mx-auto max-w-4xl px-gutter-mobile md:px-gutter">
        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-alt border border-border-clean font-mono text-xs text-primary font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-aver-red animate-pulse" />
            <span>{badge}</span>
          </div>
        )}
        {title && (
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-on-surface leading-tight tracking-tight mb-4">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm font-mono text-muted-slate uppercase tracking-wider mb-6">
            {subtitle}
          </p>
        )}
        <div
          className="prose dark:prose-invert max-w-none font-body-md text-secondary leading-relaxed text-base sm:text-lg space-y-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
