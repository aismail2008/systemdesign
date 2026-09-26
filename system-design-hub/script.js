(function () {
  "use strict";

  var STORAGE_KEY = "sd-hub-progress-v1";
  var THEME_KEY = "sd-hub-theme";

  /* ---------- theme ---------- */
  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      var current = theme === "dark" ? "dark" : theme === "light" ? "light" : "auto";
      btn.textContent = current === "dark" ? "🌙" : current === "light" ? "☀️" : "🌓";
    }
  }

  function loadTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      if (theme) localStorage.setItem(THEME_KEY, theme);
      else localStorage.removeItem(THEME_KEY);
    } catch (e) {}
  }

  function initTheme() {
    var saved = loadTheme();
    applyTheme(saved);
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "dark" ? "light" : current === "light" ? null : "dark";
      applyTheme(next);
      saveTheme(next);
    });
  }

  /* ---------- checklist persistence ---------- */
  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveProgress(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function updateGroupCounts() {
    var groups = document.querySelectorAll(".checklist-group");
    groups.forEach(function (group) {
      var boxes = group.querySelectorAll('input[type="checkbox"]');
      var checked = group.querySelectorAll('input[type="checkbox"]:checked');
      var countEl = group.querySelector(".count");
      if (countEl) countEl.textContent = checked.length + " / " + boxes.length;
    });
  }

  function updateOverallProgress() {
    var boxes = document.querySelectorAll('input[type="checkbox"][data-persist-id]');
    var checked = document.querySelectorAll('input[type="checkbox"][data-persist-id]:checked');
    var pct = boxes.length ? Math.round((checked.length / boxes.length) * 100) : 0;
    var fill = document.getElementById("progress-fill");
    var label = document.getElementById("progress-count");
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = checked.length + " / " + boxes.length + " (" + pct + "%)";
  }

  function initChecklists() {
    var state = loadProgress();
    var boxes = document.querySelectorAll('input[type="checkbox"][data-persist-id]');
    boxes.forEach(function (box) {
      var id = box.getAttribute("data-persist-id");
      if (state[id]) box.checked = true;
      box.addEventListener("change", function () {
        var s = loadProgress();
        if (box.checked) s[id] = true;
        else delete s[id];
        saveProgress(s);
        updateGroupCounts();
        updateOverallProgress();
      });
    });
    updateGroupCounts();
    updateOverallProgress();
  }

  /* ---------- scroll spy ---------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll("nav.toc a"));
    var sections = links
      .map(function (link) {
        var id = link.getAttribute("href").replace("#", "");
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = document.querySelector('nav.toc a[href="#' + entry.target.id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) {
              l.classList.remove("active");
            });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* ---------- search filter ---------- */
  function initSearch() {
    var input = document.getElementById("nav-search");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var links = document.querySelectorAll("nav.toc a");
      links.forEach(function (link) {
        var text = link.textContent.toLowerCase();
        var match = q === "" || text.indexOf(q) !== -1;
        link.classList.toggle("hidden", !match);
      });
      var groupTitles = document.querySelectorAll("nav.toc .group-title");
      groupTitles.forEach(function (title) {
        var next = title.nextElementSibling;
        var anyVisible = false;
        while (next && !next.classList.contains("group-title")) {
          if (!next.classList.contains("hidden")) anyVisible = true;
          next = next.nextElementSibling;
        }
        title.classList.toggle("hidden", !anyVisible);
      });
    });
  }

  /* ---------- mobile menu ---------- */
  function initMobileMenu() {
    var toggle = document.getElementById("menu-toggle");
    var sidebar = document.getElementById("sidebar");
    if (!toggle || !sidebar) return;
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
    });
    document.querySelectorAll("nav.toc a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 880) sidebar.classList.add("collapsed");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initChecklists();
    initScrollSpy();
    initSearch();
    initMobileMenu();
  });
})();
