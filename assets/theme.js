/* Light / Dark / Sistem — tersimpan di localStorage, tanpa flash saat load.
   API: AverTheme.get() | set('light'|'dark'|'system') | toggle() ; event 'aver:theme' */
(function () {
  var KEY = "aver-theme",
    root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  function read() {
    try {
      return localStorage.getItem(KEY) || "system";
    } catch (e) {
      return "system";
    }
  }
  function resolve(m) {
    return m === "system" ? (mq.matches ? "dark" : "light") : m;
  }
  function apply(m) {
    var r = resolve(m);
    root.classList.toggle("dark", r === "dark");
    root.dataset.theme = m;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta)
      meta.setAttribute("content", r === "dark" ? "#07131F" : "#F8F9FF");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(r === "dark"));
      b.setAttribute(
        "aria-label",
        r === "dark" ? "Beralih ke mode terang" : "Beralih ke mode gelap",
      );
      var i = b.querySelector(".material-symbols-outlined");
      if (i) i.textContent = r === "dark" ? "light_mode" : "dark_mode";
    });
    window.dispatchEvent(
      new CustomEvent("aver:theme", { detail: { mode: m, resolved: r } }),
    );
  }
  var api = (window.AverTheme = {
    get: read,
    set: function (m) {
      try {
        localStorage.setItem(KEY, m);
      } catch (e) {}
      apply(m);
    },
    toggle: function () {
      api.set(root.classList.contains("dark") ? "light" : "dark");
    },
  });
  apply(read()); // jalan sinkron di <head> → tidak ada flash
  mq.addEventListener("change", function () {
    if (read() === "system") apply("system");
  });
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) apply(read());
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-theme-toggle]")) api.toggle();
  });
  document.addEventListener("DOMContentLoaded", function () {
    apply(read());
  });
})();
