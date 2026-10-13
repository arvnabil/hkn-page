/* Header + Footer + Bottom-nav mobile — satu sumber data untuk SEMUA halaman.
   Pakai: <aver-header></aver-header> … <aver-footer></aver-footer>
   Override menu aktif: <aver-header active="panduan"></aver-header> */
(function () {
  var SITE = {
    name: "Harry Kusumo",
    sub: "AVer Solutions Advisor",
    initials: "HK",
    email: "info@averadvisor.id",
    social: [
      { label: "LinkedIn", href: "https://linkedin.com", icon: "link" },
      { label: "YouTube", href: "https://youtube.com", icon: "play_circle" },
    ],
  };
  var NAV = [
    {
      label: "Produk",
      href: "product.html",
      icon: "videocam",
      match: ["product", "product-detail", "perbandingan"],
    },
    {
      label: "Artikel",
      href: "article.html",
      icon: "article",
      match: ["article"],
    },
    {
      label: "Solusi",
      href: "solusi.html",
      icon: "meeting_room",
      match: ["solusi"],
    },
    {
      label: "Panduan",
      href: "panduan.html",
      icon: "menu_book",
      match: ["panduan", "panduan-detail"],
    },
    { label: "Tentang", href: "about.html", icon: "person", match: ["about"] },
  ];
  var CTA = {
    label: "Minta Penawaran",
    href: "penawaran.html",
    icon: "request_quote",
  };
  var FOOT = [
    {
      title: "Produk AVer",
      links: [
        ["CAM550 Dual-Lens", "product-detail.html"],
        ["CAM570 Audio Tracking", "product-detail.html"],
        ["CAM520 Pro3 PTZ", "product-detail.html"],
        ["VB342 Pro Soundbar", "product-detail.html"],
        ["Bandingkan Produk", "perbandingan.html"],
      ],
    },
    {
      title: "Solusi Ruang",
      links: [
        ["Huddle Room (2–6 orang)", "solusi.html"],
        ["Ruang Rapat Sedang", "solusi.html"],
        ["Boardroom Eksekutif", "solusi.html"],
        ["Auditorium & Training", "solusi.html"],
      ],
    },
    {
      title: "Artikel & Panduan",
      links: [
        ["Semua Artikel", "article.html"],
        ["Panduan Memilih Kamera", "panduan.html"],
        ["Microsoft Teams Rooms", "panduan-detail.html"],
        ["Konfigurasi PTZApp 2", "panduan-detail.html"],
      ],
    },
    {
      title: "Informasi",
      links: [
        ["Tentang Advisor", "about.html"],
        ["Minta Penawaran", "penawaran.html"],
        ["Kebijakan Privasi", "#"],
        ["Standar Editorial", "#"],
      ],
    },
  ];

  var page =
    (location.pathname.split("/").pop() || "index.html").replace(
      /\.html?$/,
      "",
    ) || "index";
  function isActive(item, forced) {
    if (forced)
      return (
        item.label.toLowerCase() === forced.toLowerCase() ||
        item.match.indexOf(forced) > -1
      );
    return item.match.indexOf(page) > -1;
  }
  function icon(n, extra) {
    return (
      '<span class="material-symbols-outlined ' +
      (extra || "") +
      '" aria-hidden="true">' +
      n +
      "</span>"
    );
  }

  /* ───────── HEADER ───────── */
  class AverHeader extends HTMLElement {
    connectedCallback() {
      var forced = this.getAttribute("active");
      var links = NAV.map(function (n) {
        var on = isActive(n, forced);
        return (
          '<a href="' +
          n.href +
          '"' +
          (on ? ' aria-current="page"' : "") +
          ' class="relative px-1 py-2 text-body-sm font-semibold transition-colors hover:text-primary ' +
          (on ? "text-primary" : "text-on-surface-variant") +
          '">' +
          n.label +
          (on
            ? '<span class="absolute inset-x-0 -bottom-[17px] h-0.5 bg-brand"></span>'
            : "") +
          "</a>"
        );
      }).join("");

      this.innerHTML =
        '<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary">Lewati ke konten</a>' +
        '<header class="sticky top-0 z-40 border-b border-border-clean bg-surface/85 backdrop-blur-md">' +
        '<div class="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-gutter-mobile md:px-gutter">' +
        '<a href="index.html" class="flex items-center gap-3 min-w-0" aria-label="Beranda">' +
        '<span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-container font-mono text-body-sm font-bold text-on-primary-container">' +
        SITE.initials +
        "</span>" +
        '<span class="min-w-0 leading-tight"><span class="block truncate font-display text-title-md font-bold text-on-surface">' +
        SITE.name +
        "</span>" +
        '<span class="block truncate font-mono text-label-telemetry text-muted-slate">' +
        SITE.sub +
        "</span></span></a>" +
        '<nav class="hidden items-center gap-7 md:flex" aria-label="Utama">' +
        links +
        "</nav>" +
        '<div class="flex items-center gap-2">' +
        '<button type="button" data-search class="grid h-11 w-11 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container" aria-label="Cari">' +
        icon("search") +
        "</button>" +
        '<button type="button" data-theme-toggle class="grid h-11 w-11 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container" aria-pressed="false" aria-label="Ganti tema">' +
        icon("dark_mode") +
        "</button>" +
        '<a href="' +
        CTA.href +
        '" class="hidden h-11 items-center gap-2 rounded-lg bg-primary px-5 text-body-sm font-semibold text-on-primary transition-opacity hover:opacity-90 md:inline-flex">' +
        CTA.label +
        "</a>" +
        "</div>" +
        "</div>" +
        "</header>";
    }
  }

  /* ───────── DRAWER (menu mobile) ───────── */
  function buildDrawer() {
    if (document.getElementById("aver-drawer")) return;
    var d = document.createElement("div");
    d.id = "aver-drawer";
    d.hidden = true;
    d.className = "fixed inset-0 z-50 md:hidden";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-modal", "true");
    d.setAttribute("aria-label", "Menu");
    d.innerHTML =
      '<div data-close class="absolute inset-0 bg-black/50"></div>' +
      '<div data-panel class="absolute inset-y-0 right-0 flex w-[88%] max-w-sm translate-x-full flex-col bg-surface shadow-2xl transition-transform duration-200">' +
      '<div class="flex h-16 items-center justify-between border-b border-border-clean px-gutter-mobile">' +
      '<span class="font-display text-title-md font-bold">Menu</span>' +
      '<button type="button" data-close class="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-container" aria-label="Tutup menu">' +
      icon("close") +
      "</button></div>" +
      '<nav class="flex-1 overflow-y-auto p-gutter-mobile" aria-label="Menu mobile">' +
      NAV.map(function (n) {
        var on = isActive(n);
        return (
          '<a href="' +
          n.href +
          '" class="flex min-h-12 items-center gap-3 rounded-lg px-3 text-body-md font-semibold ' +
          (on
            ? "bg-primary-fixed text-on-primary-fixed"
            : "text-on-surface hover:bg-surface-container") +
          '"' +
          (on ? ' aria-current="page"' : "") +
          ">" +
          icon(n.icon) +
          n.label +
          "</a>"
        );
      }).join("") +
      '<a href="' +
      CTA.href +
      '" class="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary text-body-md font-semibold text-on-primary">' +
      icon(CTA.icon) +
      CTA.label +
      "</a>" +
      "</nav>" +
      '<div class="border-t border-border-clean p-gutter-mobile pb-safe">' +
      '<p class="mb-2 font-mono text-label-telemetry text-muted-slate">TAMPILAN</p>' +
      '<div class="grid grid-cols-3 gap-1 rounded-lg bg-surface-container p-1" role="group" aria-label="Pilih tema">' +
      [
        ["light", "Terang", "light_mode"],
        ["dark", "Gelap", "dark_mode"],
        ["system", "Sistem", "contrast"],
      ]
        .map(function (o) {
          return (
            '<button type="button" data-theme-set="' +
            o[0] +
            '" class="flex h-11 items-center justify-center gap-1.5 rounded-md text-body-sm font-semibold text-on-surface-variant">' +
            icon(o[2], "text-[18px]") +
            o[1] +
            "</button>"
          );
        })
        .join("") +
      "</div></div></div>";
    document.body.appendChild(d);

    var panel = d.querySelector("[data-panel]"),
      opener = null;
    function paintThemeButtons() {
      var m = window.AverTheme ? AverTheme.get() : "system";
      d.querySelectorAll("[data-theme-set]").forEach(function (b) {
        var on = b.dataset.themeSet === m;
        b.className = b.className.replace(
          / ?(bg-surface-container-lowest|text-primary|shadow-sm)/g,
          "",
        );
        if (on)
          b.className += " bg-surface-container-lowest text-primary shadow-sm";
        b.setAttribute("aria-pressed", String(on));
      });
    }
    function open(from) {
      opener = from || document.activeElement;
      d.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(function () {
        panel.classList.remove("translate-x-full");
      });
      paintThemeButtons();
      d.querySelector("[data-close][aria-label]").focus();
    }
    function close() {
      panel.classList.add("translate-x-full");
      document.body.style.overflow = "";
      setTimeout(function () {
        d.hidden = true;
      }, 200);
      if (opener) opener.focus();
    }
    d.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) close();
      var t = e.target.closest("[data-theme-set]");
      if (t) {
        AverTheme.set(t.dataset.themeSet);
        paintThemeButtons();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !d.hidden) close();
    });
    window.addEventListener("resize", function () {
      if (innerWidth >= 768 && !d.hidden) close();
    });
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-open-menu]");
      if (b) open(b);
    });
  }

  /* ───────── FOOTER + BOTTOM NAV ───────── */
  class AverFooter extends HTMLElement {
    connectedCallback() {
      var forced = this.getAttribute("active");
      var cols = FOOT.map(function (c) {
        return (
          '<details class="group border-b border-border-clean md:border-0" data-col>' +
          '<summary class="flex min-h-12 cursor-pointer list-none items-center justify-between font-mono text-label-mono text-on-surface md:pointer-events-none md:min-h-0 md:pb-4">' +
          c.title +
          '<span class="md:hidden transition-transform group-open:rotate-180">' +
          icon("expand_more") +
          "</span></summary>" +
          '<ul class="space-y-1 pb-4 md:space-y-2.5 md:pb-0">' +
          c.links
            .map(function (l) {
              return (
                '<li><a href="' +
                l[1] +
                '" class="inline-flex min-h-9 items-center text-body-sm text-on-surface-variant transition-colors hover:text-primary">' +
                l[0] +
                "</a></li>"
              );
            })
            .join("") +
          "</ul></details>"
        );
      }).join("");

      var bottom =
        NAV.slice(0, 4)
          .map(function (n) {
            var on = isActive(n, forced);
            return (
              '<a href="' +
              n.href +
              '"' +
              (on ? ' aria-current="page"' : "") +
              ' class="flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ' +
              (on ? "text-primary" : "text-on-surface-variant") +
              '">' +
              '<span class="grid h-7 w-14 place-items-center rounded-full ' +
              (on ? "bg-primary-fixed text-on-primary-fixed" : "") +
              '">' +
              icon(n.icon, on ? "fill" : "") +
              "</span>" +
              n.label +
              "</a>"
            );
          })
          .join("") +
        '<button type="button" data-open-menu class="flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-on-surface-variant" aria-haspopup="dialog">' +
        '<span class="grid h-7 w-14 place-items-center rounded-full">' +
        icon("menu") +
        "</span>Menu</button>";

      this.innerHTML =
        '<footer class="mt-24 border-t border-border-clean bg-surface-container-low">' +
        '<div class="mx-auto max-w-page px-gutter-mobile py-12 md:px-gutter md:py-16">' +
        '<div class="grid gap-10 md:grid-cols-[1.3fr_repeat(4,1fr)] md:gap-8">' +
        "<div>" +
        '<a href="index.html" class="flex items-center gap-3"><span class="grid h-10 w-10 place-items-center rounded-lg bg-primary-container font-mono text-body-sm font-bold text-on-primary-container">' +
        SITE.initials +
        "</span>" +
        '<span class="font-display text-title-md font-bold">' +
        SITE.name +
        "</span></a>" +
        '<p class="mt-4 max-w-xs text-body-sm text-on-surface-variant">Membantu Anda memilih solusi kolaborasi terbaik melalui analisis optik, AI camera tracking, dan kesiapan tata letak ruang.</p>' +
        '<div class="mt-5 flex flex-wrap gap-2">' +
        SITE.social
          .map(function (s) {
            return (
              '<a href="' +
              s.href +
              '" target="_blank" rel="noopener noreferrer" class="inline-flex h-11 items-center gap-1.5 rounded-full border border-outline-variant px-4 text-body-sm font-semibold text-on-surface-variant hover:border-brand hover:text-primary">' +
              icon(s.icon, "text-[18px]") +
              s.label +
              "</a>"
            );
          })
          .join("") +
        "</div>" +
        '<a href="mailto:' +
        SITE.email +
        '" class="mt-4 inline-block font-mono text-label-telemetry text-muted-slate hover:text-primary">' +
        SITE.email +
        "</a>" +
        "</div>" +
        cols +
        "</div>" +
        '<div class="mt-12 border-t border-border-clean pt-6 text-caption text-muted-slate">' +
        "<p>Publikasi ini adalah dokumentasi teknis independen. Seluruh merek dagang, nama produk, dan logo AVer adalah hak milik AVer Information Inc.</p>" +
        '<p class="mt-2 font-mono text-label-telemetry">© <span data-year></span> Harry Kusumo Negoro. Hak cipta dilindungi.</p>' +
        "</div>" +
        "</div>" +
        "</footer>" +
        '<nav class="pb-safe fixed inset-x-0 bottom-0 z-40 flex border-t border-border-clean bg-surface/95 backdrop-blur-md md:hidden" aria-label="Navigasi bawah">' +
        bottom +
        "</nav>";

      this.querySelector("[data-year]").textContent = new Date().getFullYear();
      var mq = matchMedia("(min-width: 768px)"),
        colEls = this.querySelectorAll("[data-col]");
      function sync() {
        colEls.forEach(function (c) {
          c.open = mq.matches;
        });
      }
      sync();
      mq.addEventListener("change", sync);
      buildDrawer();
    }
  }

  customElements.define("aver-header", AverHeader);
  customElements.define("aver-footer", AverFooter);
})();
