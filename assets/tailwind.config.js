/* Satu config untuk semua halaman. Dipakai via CDN (window.tailwind) maupun build (module.exports). */
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;
const names = [
  "background","surface","surface-container-lowest","surface-container-low","surface-container",
  "surface-container-high","surface-container-highest","surface-alt","on-surface","on-surface-variant",
  "muted-slate","outline","outline-variant","border-clean","brand","primary","on-primary",
  "primary-container","on-primary-container","primary-fixed","on-primary-fixed","secondary",
  "secondary-container","on-secondary-container","accent","tertiary","on-tertiary","tertiary-container",
  "on-tertiary-container","error","on-error","error-container","on-error-container",
  "status-success","status-warning","status-danger","inverse-surface","inverse-on-surface",
];
const colors = Object.fromEntries(names.map((n) => [n, v(n)]));
// alias agar kelas lama (bg-dark-bg, text-dark-text, dll.) tidak rusak saat migrasi
Object.assign(colors, {
  "primary-dark": v("primary-container"),
  "dark-bg": v("background"), "dark-surface": v("surface-container-low"),
  "dark-border": v("border-clean"), "dark-text": v("on-surface"),
});

const heading = ['"Plus Jakarta Sans"', "system-ui", "sans-serif"];
const body = ["Inter", "system-ui", "sans-serif"];
const mono = ['"JetBrains Mono"', "ui-monospace", "monospace"];
const t = (size, lh, w, ls) => [size, { lineHeight: lh, fontWeight: w, ...(ls ? { letterSpacing: ls } : {}) }];

const config = {
  darkMode: "class",
  theme: {
    extend: {
      colors,
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", full: "9999px" },
      spacing: {
        "space-xs": "0.25rem", "space-sm": "0.5rem", "space-md": "0.75rem", "space-base": "1rem",
        "space-lg": "1.5rem", "space-xl": "2rem", "space-2xl": "3rem", "space-3xl": "5rem",
        gutter: "1.5rem", "gutter-mobile": "1rem", margin: "3rem", "margin-mobile": "1.5rem",
      },
      fontFamily: {
        display: heading, headline: heading, title: heading, body, caption: body, mono, label: mono,
        "body-sm": body, "body-md": body, "body-article": body,
        "headline-lg": heading, "headline-md": heading, "headline-sm": heading, "title-md": heading,
        "display-mobile": heading, "headline-lg-mobile": heading,
        "label-mono": mono, "label-telemetry": mono,
      },
      fontSize: {
        display: t("54px", "60px", "800", "-0.02em"),
        "display-mobile": t("38px", "44px", "800", "-0.02em"),
        "headline-lg": t("40px", "46px", "700", "-0.02em"),
        "headline-lg-mobile": t("30px", "36px", "700", "-0.015em"),
        "headline-md": t("30px", "36px", "700", "-0.015em"),
        "headline-sm": t("22px", "28px", "700", "-0.01em"),
        "title-md": t("18px", "24px", "600"),
        "body-article": t("18px", "31px", "400"),
        "body-md": t("16px", "26px", "400"),
        "body-sm": t("14px", "22px", "400"),
        caption: t("13px", "18px", "400"),
        "label-mono": t("12px", "16px", "600", "0.08em"),
        "label-telemetry": t("11px", "14px", "500", "0.06em"),
      },
      maxWidth: { page: "1280px" },
    },
  },
};

if (typeof tailwind !== "undefined") tailwind.config = config;
if (typeof module !== "undefined") module.exports = config;