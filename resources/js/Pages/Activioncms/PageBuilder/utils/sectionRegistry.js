import HeroSection from "@/Components/Sections/HeroSection";
import AdvisorSection from "@/Components/Sections/AdvisorSection";
import BlueprintSection from "@/Components/Sections/BlueprintSection";
import ProductGridSection from "@/Components/Sections/ProductGridSection";
import ComparisonSection from "@/Components/Sections/ComparisonSection";
import ArticleGridSection from "@/Components/Sections/ArticleGridSection";
import WhyChooseUsSection from "@/Components/Sections/WhyChooseUsSection";
import FaqSection from "@/Components/Sections/FaqSection";
import InquirySection from "@/Components/Sections/InquirySection";
import RichTextSection from "@/Components/Sections/RichTextSection";

export const sectionRegistry = {
  // 1. Enterprise Hero Banner
  hero: {
    id: "hero",
    label: "Enterprise Hero Banner",
    icon: "fa-regular fa-presentation",
    component: HeroSection,
    schema: [
      { name: "badge", type: "text", label: "Badge Text" },
      { name: "title", type: "text", label: "Hero Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
      { name: "image", type: "image", label: "Hero Image URL" },
      { name: "primary_btn_text", type: "text", label: "Primary Button Text" },
      { name: "primary_btn_url", type: "text", label: "Primary Button URL" },
      { name: "secondary_btn_text", type: "text", label: "Secondary Button Text" },
      { name: "secondary_btn_url", type: "text", label: "Secondary Button URL" },
      {
        name: "stats",
        type: "repeater",
        label: "Key Specs / Statistics",
        schema: [
          { name: "value", type: "text", label: "Metric Value" },
          { name: "label", type: "text", label: "Metric Label" },
        ],
      },
    ],
    defaultConfig: {
      badge: "AVer INDONESIA ENTERPRISE PARTNER",
      title: "Solusi Video Conference & Kamera PTZ Enterprise AVer",
      subtitle: "TEKNOLOGI HYBRID WORKPLACE RESMI",
      description: "Optimalisasi ruang rapat, auditorium, dan ruang kelas Anda dengan teknologi kamera tracking berbasis AI, audio array bersertifikasi Microsoft Teams & Zoom, serta garansi resmi 5 tahun.",
      primary_btn_text: "Minta Penawaran B2B",
      primary_btn_url: "/penawaran",
      secondary_btn_text: "Eksplorasi Denah Solusi",
      secondary_btn_url: "/solusi",
      image: "/assets/img/hero-ptz.png",
      stats: [
        { value: "4K / 60fps", label: "Resolusi Optik Ultra HD" },
        { value: "30X", label: "Optical Zoom Lossless" },
        { value: "AI Tracking", label: "Voice & Preset Tracking Otomatis" },
        { value: "5 Tahun", label: "Garansi Resmi Enterprise" },
      ],
    },
  },

  // 2. Interactive AI Room Advisor HUD
  advisor: {
    id: "advisor",
    label: "AI Room Advisor HUD",
    icon: "fa-regular fa-microchip-ai",
    component: AdvisorSection,
    schema: [
      { name: "badge", type: "text", label: "Badge Label" },
      { name: "title", type: "text", label: "Section Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
    ],
    defaultConfig: {
      badge: "SIMULATOR TEKNIS CERDAS",
      title: "AI Room Advisor & Recommendation HUD",
      subtitle: "SISTEM KONSULTASI INTERAKTIF PERANGKAT RUANG RAPAT",
      description: "Tentukan kapasitas peserta, platform UC yang digunakan, dan tipe pencahayaan untuk mendapatkan simulasi konfigurasi kamera dan audio AVer yang paling ideal secara instan.",
    },
  },

  // 3. Interactive Room Solution Blueprint Studio
  blueprint: {
    id: "blueprint",
    label: "Interactive Room Blueprint",
    icon: "fa-regular fa-compass-drafting",
    component: BlueprintSection,
    schema: [
      { name: "badge", type: "text", label: "Badge Label" },
      { name: "title", type: "text", label: "Section Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
      {
        name: "default_room",
        type: "select",
        label: "Default Active Room",
        options: [
          { label: "Huddle Room (2-6 Orang)", value: "huddle" },
          { label: "Medium Conference (6-12 Orang)", value: "medium" },
          { label: "Executive Boardroom (12-20 Orang)", value: "boardroom" },
          { label: "Auditorium & Townhall", value: "auditorium" },
          { label: "Smart Classroom", value: "classroom" },
        ],
      },
    ],
    defaultConfig: {
      badge: "INTERACTIVE BLUEPRINT STUDIO",
      title: "Studio Denah Interaktif & Arsitektur Solusi Ruang",
      subtitle: "SIMULASI FOV KAMERA & AKUSTIK AUDIO RUANG RAPAT",
      description: "Eksplorasi penempatan kamera AVer, sudut pandang optimal (Field of View), dan jangkauan mikrofon beamforming untuk berbagai denah ruang rapat korporat dan institusi.",
      default_room: "huddle",
    },
  },

  // 4. Product Catalog Grid
  products: {
    id: "products",
    label: "AVer Camera & Audio Catalog",
    icon: "fa-regular fa-camera-cctv",
    component: ProductGridSection,
    schema: [
      { name: "badge", type: "text", label: "Badge Label" },
      { name: "title", type: "text", label: "Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
      { name: "limit", type: "text", label: "Max Items to Show" },
      {
        name: "category",
        type: "select",
        label: "Category Filter",
        options: [
          { label: "Semua Kategori", value: "all" },
          { label: "Enterprise PTZ", value: "ptz" },
          { label: "AI Auto Tracking", value: "tracking" },
          { label: "All-in-One Bar", value: "soundbar" },
          { label: "Education PTZ", value: "classroom" },
        ],
      },
      { name: "cta_text", type: "text", label: "CTA Button Text" },
      { name: "cta_url", type: "text", label: "CTA Button URL" },
    ],
    defaultConfig: {
      badge: "KATALOG PERANGKAT RESMI",
      title: "Katalog Kamera PTZ & Sistem Audio AVer",
      subtitle: "HARDWARE BERMUTU TINGGI UNTUK ENTERPRISE & EDUCATION",
      description: "Temukan perangkat konferensi video AVer dengan zoom optik presisi tinggi, teknologi auto-framing cerdas, dan integrasi mulus dengan ekosistem Zoom, Teams, dan Google Meet.",
      limit: "6",
      category: "all",
      cta_text: "Lihat Semua Kamera AVer",
      cta_url: "/produk",
    },
  },

  // 5. Technical Comparison Matrix
  comparison: {
    id: "comparison",
    label: "Camera Comparison Matrix",
    icon: "fa-regular fa-table-columns",
    component: ComparisonSection,
    schema: [
      { name: "badge", type: "text", label: "Badge Label" },
      { name: "title", type: "text", label: "Section Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
      {
        name: "product_1",
        type: "select",
        label: "Product Column 1",
        options: [
          { label: "AVer CAM570 (Dual Optical Voice Tracking)", value: "cam570" },
          { label: "AVer CAM550 (Dual Lens Smart Gallery)", value: "cam550" },
          { label: "AVer CAM520 Pro3 (Smart Composition)", value: "cam520-pro3" },
          { label: "AVer VB342 Pro (All-in-One Soundbar)", value: "vb342-pro" },
        ],
      },
      {
        name: "product_2",
        type: "select",
        label: "Product Column 2",
        options: [
          { label: "AVer CAM570 (Dual Optical Voice Tracking)", value: "cam570" },
          { label: "AVer CAM550 (Dual Lens Smart Gallery)", value: "cam550" },
          { label: "AVer CAM520 Pro3 (Smart Composition)", value: "cam520-pro3" },
          { label: "AVer VB342 Pro (All-in-One Soundbar)", value: "vb342-pro" },
        ],
      },
      {
        name: "product_3",
        type: "select",
        label: "Product Column 3",
        options: [
          { label: "AVer CAM570 (Dual Optical Voice Tracking)", value: "cam570" },
          { label: "AVer CAM550 (Dual Lens Smart Gallery)", value: "cam550" },
          { label: "AVer CAM520 Pro3 (Smart Composition)", value: "cam520-pro3" },
          { label: "AVer VB342 Pro (All-in-One Soundbar)", value: "vb342-pro" },
        ],
      },
    ],
    defaultConfig: {
      badge: "TECHNICAL SPECIFICATION MATRIX",
      title: "Matriks Perbandingan Kamera PTZ AVer",
      subtitle: "KOMPARASI SPESIFIKASI TEKNIS & FITUR ENTERPRISE",
      description: "Bandingkan resolusi optik, kemampuan zoom, sudut pandang fov, dan sertifikasi platform antar tipe kamera AVer untuk memilih perangkat yang paling tepat.",
      product_1: "cam570",
      product_2: "cam550",
      product_3: "cam520-pro3",
    },
  },

  // 6. Why Choose Us / Features
  why_choose_us: {
    id: "why_choose_us",
    label: "Why Choose Us / Features",
    icon: "fa-regular fa-shield-check",
    component: WhyChooseUsSection,
    schema: [
      { name: "badge", type: "text", label: "Badge Label" },
      { name: "title", type: "text", label: "Section Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
      {
        name: "features",
        type: "repeater",
        label: "Feature Blocks",
        schema: [
          { name: "title", type: "text", label: "Feature Title" },
          { name: "description", type: "textarea", label: "Feature Description" },
          { name: "icon", type: "text", label: "Icon Name (Material Symbol)" },
        ],
      },
      { name: "button_text", type: "text", label: "CTA Button Text" },
      { name: "button_url", type: "text", label: "CTA Button URL" },
    ],
    defaultConfig: {
      badge: "ENTERPRISE ASSURANCE",
      title: "Mengapa Memilih Ekosistem Konferensi AVer?",
      subtitle: "KEUNGGULAN ENTERPRISE KELAS DUNIA",
      description: "Dirancang untuk memberikan pengalaman komunikasi video tanpa hambatan dengan kecerdasan buatan terdepan dan reliabilitas hardware bersertifikasi global.",
      features: [
        {
          title: "Teknologi AI Voice & Gesture Tracking",
          description: "Kamera mendeteksi pembicara aktif secara otomatis dan dapat dikendalikan cukup dengan lambaian tangan tanpa remote.",
          icon: "psychology",
        },
        {
          title: "Sertifikasi Resmi Teams, Zoom & Meet",
          description: "Kesesuaian protokol 100% tanpa delay, plug-and-play langsung tersambung dengan PC/Mac dan Microsoft Teams Rooms.",
          icon: "verified",
        },
        {
          title: "Garansi Resmi Terpanjang: Hingga 5 Tahun",
          description: "Garansi standar 3 tahun dengan opsi ekstensi 2 tahun cuma-cuma melalui registrasi online untuk ketenangan jangka panjang.",
          icon: "shield",
        },
        {
          title: "Dukungan Teknis & PoC Demo Lokal",
          description: "Tim ahli kami siap memberikan demonstrasi perangkat langsung di ruang rapat Anda sebelum proses pengadaan.",
          icon: "support_agent",
        },
      ],
      show_button: true,
      button_text: "Jadwalkan Demo / PoC",
      button_url: "/penawaran",
    },
  },

  // 7. Articles & News Grid
  articles: {
    id: "articles",
    label: "Articles & Editorial Briefs",
    icon: "fa-regular fa-newspaper",
    component: ArticleGridSection,
    schema: [
      { name: "badge", type: "text", label: "Badge Label" },
      { name: "title", type: "text", label: "Section Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
      { name: "limit", type: "text", label: "Max Articles to Show" },
      { name: "cta_text", type: "text", label: "CTA Button Text" },
      { name: "cta_url", type: "text", label: "CTA Button URL" },
    ],
    defaultConfig: {
      badge: "EDITORIAL & TECH BRIEFS",
      title: "Wawasan Teknis & Panduan Ruang Hybrid",
      subtitle: "PUBLIKASI & BEDAH TEKNOLOGI PRO AV",
      description: "Eksplorasi artikel terkini mengenai arsitektur ruang rapat modern, tips akustik, panduan pemilihan lensa PTZ, dan studi kasus implementasi nyata di Indonesia.",
      limit: "3",
      cta_text: "Lihat Semua Artikel",
      cta_url: "/artikel",
    },
  },

  // 8. FAQ Accordion
  faq: {
    id: "faq",
    label: "FAQ Accordion",
    icon: "fa-regular fa-circle-question",
    component: FaqSection,
    schema: [
      { name: "badge", type: "text", label: "Badge Label" },
      { name: "title", type: "text", label: "Section Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
      {
        name: "items",
        type: "repeater",
        label: "FAQ Items",
        schema: [
          { name: "question", type: "text", label: "Question" },
          { name: "answer", type: "textarea", label: "Answer" },
        ],
      },
    ],
    defaultConfig: {
      badge: "FREQUENTLY ASKED QUESTIONS",
      title: "Pertanyaan Umum Seputar Solusi AVer (FAQ)",
      subtitle: "INFORMASI TEKNIS & PENGADAAN ENTERPRISE",
      description: "Temukan jawaban cepat mengenai garansi, kompatibilitas software, integrasi audio ceiling, hingga mekanisme uji coba perangkat (PoC).",
      items: [
        {
          question: "Apakah kamera AVer kompatibel dengan Microsoft Teams Rooms dan Zoom Rooms?",
          answer: "Ya, seluruh lini produk kamera AVer (seperti CAM570, CAM550, dan VB342 Pro) telah bersertifikasi resmi oleh Microsoft Teams dan Zoom, serta mendukung fitur kontrol native dari layar sentuh konsol ruang rapat.",
        },
        {
          question: "Bagaimana cara mengajukan Proof of Concept (PoC) di kantor kami?",
          answer: "Anda dapat mengisi formulir Permintaan Penawaran atau menghubungi Harry via WhatsApp. Tim teknis kami akan mengantarkan unit demo ke kantor Anda di wilayah Jabodetabek, Surabaya, dan sekitarnya.",
        },
        {
          question: "Berapa lama masa garansi resmi kamera AVer di Indonesia?",
          answer: "Semua kamera enterprise AVer dilengkapi garansi standar 3 tahun, dengan tambahan 2 tahun gratis (total 5 tahun) cukup dengan mendaftarkan nomor seri produk di portal registrasi resmi AVer.",
        },
      ],
    },
  },

  // 9. Lead Capture / Inquiry Form
  inquiry: {
    id: "inquiry",
    label: "B2B Quotation Form",
    icon: "fa-regular fa-envelope-open-dollar",
    component: InquirySection,
    schema: [
      { name: "badge", type: "text", label: "Badge Label" },
      { name: "title", type: "text", label: "Section Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
    ],
    defaultConfig: {
      badge: "B2B LEADS & INQUIRY",
      title: "Minta Penawaran Resmi & Jadwalkan PoC",
      subtitle: "KONSULTASI GRATIS DENGAN EXPERT AVer INDONESIA",
      description: "Isi formulir kebutuhan ruang rapat atau proyek Anda di bawah ini. Tim kami akan mengirimkan proposal harga resmi dan menghubungi Anda dalam 1x24 jam kerja.",
    },
  },

  // 10. Rich Text / Company Overview
  rich_text: {
    id: "rich_text",
    label: "Rich Text / Company Info",
    icon: "fa-regular fa-file-lines",
    component: RichTextSection,
    schema: [
      { name: "badge", type: "text", label: "Badge Label" },
      { name: "title", type: "text", label: "Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "content", type: "textarea", label: "HTML / Rich Content" },
    ],
    defaultConfig: {
      badge: "COMPANY OVERVIEW",
      title: "Tentang AVer Information Inc.",
      subtitle: "GLOBAL LEADER IN INTELLIGENT AUDIO-VISUAL TECHNOLOGY",
      content: "<p>Didirikan pada tahun 2008, AVer Information Inc. adalah penyedia solusi teknologi video conference dan kamera AI terkemuka di dunia. Dengan fokus mendalam pada riset optik dan kecerdasan buatan, AVer dipercaya oleh ribuan korporasi Fortune 500, universitas terkemuka, dan lembaga pemerintahan di seluruh dunia.</p><p>Melalui kemitraan strategis dengan Microsoft, Zoom, dan Google, AVer terus menghadirkan inovasi mutakhir seperti voice tracking multi-kamera, framing otomatis cerdas, serta manajemen cloud tersentralisasi.</p>",
    },
  },

  // Legacy Aliases for Seamless Backward Compatibility
  slider: {
    id: "slider",
    label: "Hero Slider (Legacy)",
    icon: "fa-regular fa-presentation",
    component: HeroSection,
    schema: [
      { name: "title", type: "text", label: "Hero Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
      { name: "image", type: "image", label: "Hero Image URL" },
    ],
    defaultConfig: {
      title: "Solusi Video Conference & Kamera PTZ Enterprise AVer",
      subtitle: "TEKNOLOGI HYBRID WORKPLACE RESMI",
      description: "Optimalisasi ruang rapat, auditorium, dan ruang kelas Anda dengan teknologi kamera tracking berbasis AI.",
      image: "/assets/img/hero-ptz.png",
    },
  },

  about: {
    id: "about",
    label: "About Section (Legacy)",
    icon: "fa-regular fa-address-card",
    component: RichTextSection,
    schema: [
      { name: "title", type: "text", label: "Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "content", type: "textarea", label: "Content" },
    ],
    defaultConfig: {
      title: "Tentang Harry & AVer Solutions",
      subtitle: "KONSULTAN SPESIALIS AUDIO VISUAL ENTERPRISE",
      content: "<p>Harry hadir sebagai technical advisor dan partner pengadaan resmi perangkat video conference AVer di Indonesia.</p>",
    },
  },

  services: {
    id: "services",
    label: "Services / Solutions (Legacy)",
    icon: "fa-regular fa-grid-2",
    component: ProductGridSection,
    schema: [
      { name: "title", type: "text", label: "Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "limit", type: "text", label: "Limit" },
    ],
    defaultConfig: {
      title: "Layanan & Solusi Perangkat AVer",
      subtitle: "KATALOG PERANGKAT HYBRID",
      limit: "6",
    },
  },

  news: {
    id: "news",
    label: "News / Articles (Legacy)",
    icon: "fa-regular fa-newspaper",
    component: ArticleGridSection,
    schema: [
      { name: "title", type: "text", label: "Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "limit", type: "text", label: "Limit" },
    ],
    defaultConfig: {
      title: "Berita & Artikel Terkini",
      subtitle: "KABAR PRO AV TERBARU",
      limit: "3",
    },
  },

  contact: {
    id: "contact",
    label: "Contact / Inquiry (Legacy)",
    icon: "fa-regular fa-envelope",
    component: InquirySection,
    schema: [
      { name: "title", type: "text", label: "Title" },
      { name: "subtitle", type: "text", label: "Subtitle" },
      { name: "description", type: "textarea", label: "Description" },
    ],
    defaultConfig: {
      title: "Hubungi Harry — Konsultasi AVer",
      subtitle: "LAYANAN RESPONSIF 1X24 JAM",
      description: "Sampaikan kebutuhan ruang rapat Anda untuk rekomendasi spesifikasi teknis dan penawaran resmi.",
    },
  },
};
