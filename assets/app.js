/* =========================================================================
   app.js — page-level rendering engine (vanilla, no build).

   Every page has its OWN distinct layout, each inspired by a different
   reference from the lazy-data2web resource lists:
     home       → landing bands + funnel chart   (Lapa Ninja / Land-book)
     pipeline   → horizontal flow diagram         (TimelineJS / process-flow)
     principles → editorial + severity ladder      (SiteInspire / data-viz)
     attacks    → category-grouped accordion       (HyperUI / Preline)
     hunting    → console / terminal transcript     (CodeStitch / terminal UI)
     schema     → two-pane API reference            (shadcn/ui blocks)
     practice   → lifted tabs playground            (DaisyUI)
   ========================================================================= */
(function () {
  "use strict";

  var practiceTab = "glossary";   // survives a language-triggered repaint

  function boot() {
    if (!window.LDW || !window.LDW.ready) {
      document.addEventListener("ldw:shell-ready", boot, { once: true });
      return;
    }
    var L = window.LDW;
    var t = L.t, esc = L.escapeHtml;
    var lang = function () { return L.state.lang; };
    var pageEl = document.getElementById("page");
    var teardowns = [];

    function head(p) {
      var sub = t(p.subtitle)
        ? '<p class="page-head__sub">' + esc(t(p.subtitle)) + "</p>" : "";
      return '<header class="page-head"><div class="page-head__eyebrow"><span class="material-symbols-rounded" aria-hidden="true">' +
        esc(p.icon || "shield") + '</span><span>' + esc(t(p.title)) + "</span></div>" +
        "<h1>" + esc(t(p.title)) + "</h1>" + sub + "</header>";
    }
    function pad2(n) { return ("0" + n).slice(-2); }
    function commas(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
    function reveal(selector) {
      if (!("IntersectionObserver" in window)) {
        [].forEach.call(pageEl.querySelectorAll(selector), function (el) { el.classList.add("is-in"); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.1 });
      [].forEach.call(pageEl.querySelectorAll(selector), function (el) { io.observe(el); });
      teardowns.push(function () { io.disconnect(); });
    }
    function countUp(el) {
      var raw = el.dataset.count || "";
      if (!/^\d+$/.test(raw)) { el.textContent = raw; return; }
      var target = parseInt(raw, 10), dur = 900, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var pr = Math.min(1, (ts - start) / dur), eased = 1 - Math.pow(1 - pr, 3);
        el.textContent = String(Math.round(target * eased));
        if (pr < 1) requestAnimationFrame(step); else el.textContent = String(target);
      }
      requestAnimationFrame(step);
    }
    function wireCounters() {
      var els = [].slice.call(pageEl.querySelectorAll("[data-count]"));
      if (!els.length) return;
      if (!("IntersectionObserver" in window)) { els.forEach(countUp); return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); } });
      }, { threshold: 0.5 });
      els.forEach(function (el) { io.observe(el); });
      teardowns.push(function () { io.disconnect(); });
    }

    var RENDERERS = {

      /* ============ HOME — landing bands + funnel chart ============ */
      home: function (p) {
        var stats = (p.stats || []).map(function (s) {
          return '<div class="statbar__item" data-item>' +
            '<b class="statbar__value" data-count="' + esc(String(s.value)) + '">' + esc(String(s.value)) + "</b>" +
            '<span class="statbar__label">' + esc(t(s.label)) + "</span></div>";
        }).join("");

        var pitch = (p.pitch || []).map(function (c, i) {
          return '<div class="fband reveal' + (i % 2 ? " fband--alt" : "") + '" data-item><div class="fband__inner">' +
            '<span class="material-symbols-rounded fband__icon" aria-hidden="true">' + esc(c.icon) + "</span>" +
            '<div class="fband__text"><h3 class="fband__title">' + esc(t(c.title)) + "</h3>" +
            '<p class="fband__body">' + esc(t(c.body)) + "</p></div></div></div>";
        }).join("");
        var whatLabel = lang() === "en" ? "What it does" : "它在做什麼";

        var lin = p.lineage || {};
        var metrics = (lin.metrics || []).map(function (m) {
          return '<div class="metricbar__item"><b class="metricbar__value">' + esc(String(m.value)) + "</b>" +
            '<span class="metricbar__label">' + esc(t(m.label)) + "</span></div>";
        }).join("");
        var fn = lin.funnel || {};
        var fmax = Math.max.apply(null, (fn.steps || []).map(function (s) { return s.value; }).concat([1]));
        var funnel = (fn.steps && fn.steps.length) ? '<div class="funnel" data-item>' +
          '<div class="funnel__h">' + esc(t(fn.heading)) + "</div>" +
          fn.steps.map(function (s) {
            var pct = Math.max(8, Math.round(s.value / fmax * 100));
            return '<div class="funnel__row"><span class="funnel__label">' + esc(t(s.label)) + "</span>" +
              '<div class="funnel__track"><div class="funnel__bar" style="width:' + pct + '%">' +
              '<span class="funnel__val">' + commas(s.value) + "</span></div></div></div>";
          }).join("") + "</div>" : "";
        var lineage = '<section class="band reveal" data-item aria-labelledby="lineageH">' +
          '<h2 class="band__title" id="lineageH">' + esc(t(lin.heading)) + "</h2>" +
          '<p class="band__body">' + esc(t(lin.body)) + "</p>" + funnel +
          '<div class="metricbar">' + metrics + "</div>" +
          '<blockquote class="quote">' + esc(t(lin.quote)) + "</blockquote></section>";

        var src = p.sources || {};
        var links = (src.links || []).map(function (a) {
          return '<a class="srclink" href="' + esc(a.url) + '" target="_blank" rel="noopener">' +
            '<span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>' +
            '<span>' + esc(t(a.label)) + "</span></a>";
        }).join("");
        var sources = '<section class="band band--muted reveal" data-item aria-labelledby="srcH">' +
          '<h2 class="band__title" id="srcH">' + esc(t(src.heading)) + "</h2>" +
          '<p class="band__body">' + esc(t(src.note)) + "</p>" +
          '<div class="srclinks">' + links + "</div></section>";

        var idx = L.pages.filter(function (q) { return q.slug !== "home"; }).map(function (q, i) {
          return '<a class="idxrow reveal" data-item href="' + esc(L.pageHref(q)) + '" aria-label="' + esc(t(q.title)) + '">' +
            '<span class="idxrow__n">' + pad2(i + 1) + "</span>" +
            '<span class="material-symbols-rounded idxrow__icon" aria-hidden="true">' + esc(q.icon || "label") + "</span>" +
            '<span class="idxrow__text"><b>' + esc(t(q.title)) + "</b>" +
            '<span>' + esc(t(q.subtitle)) + "</span></span>" +
            '<span class="material-symbols-rounded idxrow__go" aria-hidden="true">arrow_forward</span></a>';
        }).join("");
        var exploreLabel = lang() === "en" ? "Explore the skill" : "逐章拆解";

        return '<section class="hero" data-item>' +
            '<div class="terminal" aria-hidden="true"><span class="terminal__dot"></span><span class="terminal__dot"></span><span class="terminal__dot"></span>' +
              '<code class="terminal__cmd">' + esc(p.command || "") + '<span class="terminal__caret"></span></code></div>' +
            '<h1 class="hero__title">' + esc(t(p.subtitle)) + "</h1>" +
            '<p class="hero__lede">' + esc(t(p.lede)) + "</p>" +
          "</section>" +
          '<div class="statbar">' + stats + "</div>" +
          '<h2 class="section-label"><span class="section-label__hash">//</span> ' + esc(whatLabel) + "</h2>" +
          '<div class="fbands">' + pitch + "</div>" +
          lineage +
          '<h2 class="section-label"><span class="section-label__hash">//</span> ' + esc(exploreLabel) + "</h2>" +
          '<nav class="idxlist" aria-label="' + esc(exploreLabel) + '">' + idx + "</nav>" +
          sources;
      },

      /* ============ PIPELINE — horizontal flow diagram + stage blocks ============ */
      pipeline: function (p) {
        var intro = t(p.intro) ? '<p class="lead reveal" data-item>' + esc(t(p.intro)) + "</p>" : "";
        var phases = p.phases || [];
        var flow = '<div class="flow" role="list" aria-label="pipeline">' + phases.map(function (ph, i) {
          var arrow = i < phases.length - 1 ? '<span class="flow__arrow material-symbols-rounded" aria-hidden="true">chevron_right</span>' : "";
          return '<a class="flow__node" role="listitem" href="#stage-' + esc(ph.key) + '">' +
            '<span class="flow__num">' + esc(ph.n) + "</span>" +
            '<span class="flow__label">' + esc(t(ph.name)) + "</span></a>" + arrow;
        }).join("") + "</div>";

        var stages = phases.map(function (ph) {
          var details = (ph.detail || []).map(function (d) { return "<li>" + esc(t(d)) + "</li>"; }).join("");
          return '<section class="stage reveal" id="stage-' + esc(ph.key) + '" data-item>' +
            '<div class="stage__head"><span class="stage__num">' + esc(ph.n) + "</span>" +
              '<h3 class="stage__name">' + esc(t(ph.name)) + "</h3>" +
              '<span class="badge badge--agents"><span class="material-symbols-rounded" aria-hidden="true">smart_toy</span>' + esc(t(ph.agents)) + "</span></div>" +
            '<p class="stage__summary">' + esc(t(ph.summary)) + "</p>" +
            (ph.output ? '<div class="step__out"><span class="material-symbols-rounded" aria-hidden="true">output</span><code>' + esc(ph.output) + "</code></div>" : "") +
            '<ul class="stage__detail">' + details + "</ul></section>";
        }).join("");

        var cov = p.coverage || {};
        var coverage = '<section class="callout reveal" data-item>' +
          '<span class="material-symbols-rounded callout__icon" aria-hidden="true">replay</span>' +
          '<div><h3 class="callout__title">' + esc(t(cov.heading)) + "</h3>" +
          '<p class="callout__body">' + esc(t(cov.body)) + "</p></div></section>";
        return head(p) + intro + flow + '<div class="stages">' + stages + "</div>" + coverage;
      },

      /* ============ PRINCIPLES — editorial + severity ladder + anti-patterns ============ */
      principles: function (p) {
        var pr = (p.principles || []).map(function (c, i) {
          return '<article class="pred reveal" data-item>' +
            '<span class="pred__num" aria-hidden="true">' + pad2(i + 1) + "</span>" +
            '<div class="pred__main">' +
              '<span class="material-symbols-rounded pred__icon" aria-hidden="true">' + esc(c.icon) + "</span>" +
              '<h3 class="pred__title">' + esc(t(c.title)) + "</h3>" +
              '<p class="pred__body">' + esc(t(c.body)) + "</p></div></article>";
        }).join("");

        var sev = p.severity || {};
        var widths = { critical: 100, high: 78, medium: 54, low: 32 };
        var levels = (sev.levels || []).map(function (lv) {
          var w = widths[lv.level] || 50;
          return '<div class="sevl sevl--' + esc(lv.level) + '" data-item>' +
            '<div class="sevl__bar" style="width:' + w + '%"><span class="sevl__tag">' + esc(t(lv.label)) + "</span></div>" +
            '<p class="sevl__body">' + esc(t(lv.body)) + "</p></div>";
        }).join("");
        var severity = '<section class="block reveal" aria-labelledby="sevH">' +
          '<h2 class="block__title" id="sevH"><span class="section-label__hash">//</span> ' + esc(t(sev.heading)) + "</h2>" +
          '<p class="block__note">' + esc(t(sev.note)) + "</p>" +
          '<div class="sevladder">' + levels + "</div></section>";

        var ap = p.antipatterns || {};
        var aps = (ap.items || []).map(function (it) {
          return '<li class="anti2 reveal" data-item>' +
            '<span class="anti2__x material-symbols-rounded" aria-hidden="true">block</span>' +
            '<div class="anti2__text"><h3 class="anti2__title">' + esc(t(it.title)) + "</h3>" +
            '<p class="anti2__body">' + esc(t(it.body)) + "</p></div></li>";
        }).join("");
        var anti = '<section class="block reveal" aria-labelledby="apH">' +
          '<h2 class="block__title" id="apH"><span class="section-label__hash">//</span> ' + esc(t(ap.heading)) + "</h2>" +
          '<p class="block__note">' + esc(t(ap.note)) + "</p>" +
          '<ol class="anti2list">' + aps + "</ol></section>";

        return head(p) + '<div class="predlist">' + pr + "</div>" + severity + anti;
      },

      /* ============ ATTACKS — category-grouped accordion ============ */
      attacks: function (p) {
        var cats = (p.categories || []).map(function (c) {
          return '<button class="chip" type="button" data-cat="' + esc(c.key) + '">' + esc(c[lang()] || c.en) + "</button>";
        }).join("");
        var allLabel = lang() === "en" ? "All" : "全部";
        return head(p) +
          '<div class="toolbar">' +
            '<div class="search-wrap"><span class="material-symbols-rounded search-ic" aria-hidden="true">search</span>' +
            '<input id="search" class="search" type="search" autocomplete="off" placeholder="' +
              (lang() === "en" ? "Search attack classes…" : "搜尋攻擊類別…") + '" aria-label="' +
              (lang() === "en" ? "Search" : "搜尋") + '" /></div>' +
            '<div class="chips"><button class="chip chip--active" type="button" data-cat="">' + esc(allLabel) + "</button>" + cats + "</div>" +
          "</div>" +
          '<p class="result-count" id="resultCount" aria-live="polite"></p>' +
          '<div id="accWrap"></div>';
      },

      /* ============ HUNTING — console transcript ============ */
      hunting: function (p) {
        var intro = t(p.intro) ? '<p class="lead reveal" data-item>' + esc(t(p.intro)) + "</p>" : "";
        var lines = (p.angles || []).map(function (a) {
          return '<div class="cline reveal" data-item>' +
            '<span class="cline__prompt" aria-hidden="true">▸</span>' +
            '<span class="cline__n">' + esc(a.n) + "</span>" +
            '<div class="cline__text"><b class="cline__title">' + esc(t(a.title)) + "</b>" +
            '<p class="cline__body">' + esc(t(a.body)) + "</p></div></div>";
        }).join("");
        var con = '<div class="console" data-item>' +
          '<div class="console__bar" aria-hidden="true"><span class="terminal__dot"></span><span class="terminal__dot"></span><span class="terminal__dot"></span>' +
          '<span class="console__name">hunt --angles</span></div>' +
          '<div class="console__body">' + lines + "</div></div>";

        var rl = p.rules || {};
        var rules = (rl.items || []).map(function (it) {
          return '<li class="ccheck" data-item><span class="ccheck__box" aria-hidden="true">[<span class="ccheck__tick">✓</span>]</span>' +
            "<span>" + esc(t(it)) + "</span></li>";
        }).join("");
        var rulesBlock = '<section class="block reveal" aria-labelledby="rulesH">' +
          '<h2 class="block__title" id="rulesH"><span class="section-label__hash">//</span> ' + esc(t(rl.heading)) + "</h2>" +
          '<ul class="cchecks">' + rules + "</ul></section>";
        return head(p) + intro + con + rulesBlock;
      },

      /* ============ SCHEMA — two-pane API reference ============ */
      schema: function (p) {
        var intro = t(p.intro) ? '<p class="lead reveal" data-item>' + esc(t(p.intro)) + "</p>" : "";
        var conf = p.confirmed || {}, fields = conf.fields || [];
        var index = fields.map(function (f) {
          return '<a class="apiref__link" href="#f-' + esc(f.name) + '"><code>' + esc(f.name) + "</code></a>";
        }).join("");
        var docs = fields.map(function (f) {
          return '<div class="fielddoc reveal" id="f-' + esc(f.name) + '" data-item>' +
            '<div class="fielddoc__head"><code class="fielddoc__name">' + esc(f.name) + "</code>" +
            '<code class="fielddoc__type">' + esc(f.type) + "</code></div>" +
            '<p class="fielddoc__desc">' + esc(t(f.desc)) + "</p></div>";
        }).join("");
        var idxLabel = lang() === "en" ? "Fields" : "欄位";
        var apiref = '<section class="block" aria-labelledby="cfH">' +
          '<h2 class="block__title" id="cfH"><span class="section-label__hash">//</span> ' + esc(t(conf.heading)) + "</h2>" +
          '<div class="apiref"><nav class="apiref__index" aria-label="' + esc(idxLabel) + '"><span class="apiref__idxh">' + esc(idxLabel) + "</span>" + index + "</nav>" +
          '<div class="apiref__main">' + docs + "</div></div></section>";

        var rej = p.rejected || {};
        var rdocs = (rej.fields || []).map(function (f) {
          return '<div class="fielddoc reveal" data-item><div class="fielddoc__head"><code class="fielddoc__name">' + esc(f.name) + "</code>" +
            '<code class="fielddoc__type">' + esc(f.type) + "</code></div>" +
            '<p class="fielddoc__desc">' + esc(t(f.desc)) + "</p></div>";
        }).join("");
        var rejected = '<section class="block reveal" aria-labelledby="rjH">' +
          '<h2 class="block__title" id="rjH"><span class="section-label__hash">//</span> ' + esc(t(rej.heading)) + "</h2>" +
          '<div class="fieldcol">' + rdocs + "</div></section>";

        var ex = p.example || {};
        var example = '<section class="block reveal" aria-labelledby="exH">' +
          '<h2 class="block__title" id="exH"><span class="section-label__hash">//</span> ' + esc(t(ex.heading)) + "</h2>" +
          '<div class="codewin" data-item><div class="codewin__bar" aria-hidden="true"><span class="terminal__dot"></span><span class="terminal__dot"></span><span class="terminal__dot"></span><span class="codewin__name">findings.json</span></div>' +
          '<pre class="codewin__body"><code>' + esc(ex.code || "") + "</code></pre></div></section>";

        var v = p.validator || {};
        var validator = '<section class="callout reveal" data-item>' +
          '<span class="material-symbols-rounded callout__icon" aria-hidden="true">verified</span>' +
          '<div><h3 class="callout__title">' + esc(t(v.heading)) + "</h3>" +
          '<p class="callout__body">' + esc(t(v.body)) + "</p>" +
          (v.command ? '<div class="cmdline"><span class="cmdline__prompt">$</span><code>' + esc(v.command) + "</code></div>" : "") +
          "</div></section>";

        return head(p) + intro + apiref + rejected + example + validator;
      },

      /* ============ PRACTICE — lifted tabs ============ */
      practice: function (p) {
        var tabs = p.tabs || {};
        var icons = { glossary: "menu_book", flashcards: "style", quiz: "quiz" };
        function seg(key) {
          return '<button class="ltab' + (practiceTab === key ? " ltab--active" : "") +
            '" type="button" role="tab" aria-selected="' + (practiceTab === key) + '" data-tab="' + key + '">' +
            '<span class="material-symbols-rounded" aria-hidden="true">' + icons[key] + "</span>" + esc(t(tabs[key])) + "</button>";
        }
        return head(p) +
          '<div class="ltabs" role="tablist">' + seg("glossary") + seg("flashcards") + seg("quiz") + "</div>" +
          '<div id="practicePanel" class="ltabpanel" data-item></div>';
      }
    };

    /* ===================== WIRING ===================== */
    var WIRE = {
      home: function () { wireCounters(); reveal(".reveal"); },
      pipeline: function () { reveal(".reveal"); },
      principles: function () { reveal(".reveal"); },
      hunting: function () { reveal(".reveal"); },
      schema: function () { reveal(".reveal"); },

      attacks: function (p) {
        var wrap = document.getElementById("accWrap");
        var search = document.getElementById("search");
        var count = document.getElementById("resultCount");
        var chips = [].slice.call(pageEl.querySelectorAll(".chip"));
        var st = { q: "", cat: "" };
        var checksLabel = lang() === "en" ? "What to chase" : "重點追查";

        function matchesQ(item) {
          if (!st.q) return true;
          var hay = (t(item.title) + " " + t(item.summary) + " " + t(item.overview) + " " + (item.tags || []).join(" ")).toLowerCase();
          return hay.indexOf(st.q) !== -1;
        }
        function findItem(slug) {
          return (p.items || []).filter(function (it) { return it.slug === slug; })[0] || null;
        }
        function itemHTML(item) {
          var tags = (item.tags || []).slice(0, 5).map(function (g) { return '<span class="tag">' + esc(g) + "</span>"; }).join("");
          var checks = (item.checks || []).map(function (c) { return "<li>" + esc(t(c)) + "</li>"; }).join("");
          return '<details class="acc-item" data-item data-slug="' + esc(item.slug) + '">' +
            '<summary class="acc-sum">' +
              '<span class="material-symbols-rounded acc-sum__icon" aria-hidden="true">' + esc(item.icon || "swords") + "</span>" +
              '<span class="acc-sum__text"><b class="acc-sum__title">' + esc(t(item.title)) + "</b>" +
              '<span class="acc-sum__desc">' + esc(t(item.summary)) + "</span></span>" +
              '<span class="material-symbols-rounded acc-chevron" aria-hidden="true">expand_more</span>' +
            "</summary>" +
            '<div class="acc-body">' +
              (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
              "<p>" + esc(t(item.overview)) + "</p>" +
              (checks ? '<h4 class="acc-sub">' + esc(checksLabel) + "</h4><ul class=\"acc-list\">" + checks + "</ul>" : "") +
            "</div></details>";
        }
        function build() {
          var groups = (p.categories || []).filter(function (c) { return !st.cat || c.key === st.cat; });
          var total = 0;
          var html = groups.map(function (cat) {
            var items = (p.items || []).filter(function (it) { return it.category === cat.key && matchesQ(it); });
            total += items.length;
            if (!items.length) return "";
            return '<section class="acc-group reveal" data-item>' +
              '<h3 class="acc-group__h"><span class="acc-group__name">' + esc(cat[lang()] || cat.en) + "</span>" +
              '<span class="acc-group__count">' + items.length + "</span></h3>" +
              '<div class="acc-rows">' + items.map(itemHTML).join("") + "</div></section>";
          }).join("");
          wrap.innerHTML = html || '<p class="empty">' + (lang() === "en" ? "No matches." : "沒有符合的項目。") + "</p>";
          if (count) count.textContent = total + (lang() === "en" ? " class(es)" : " 個類別");
          wireToggles();
          reveal(".acc-group");
        }
        function wireToggles() {
          [].forEach.call(wrap.querySelectorAll(".acc-item"), function (d) {
            d.addEventListener("toggle", function () {
              if (d.open) {
                var slug = d.getAttribute("data-slug");
                if (location.hash.slice(1) !== slug) history.replaceState(null, "", "#" + slug);
              }
            });
          });
        }
        function openFromHash() {
          var slug = location.hash.slice(1);
          if (!slug || !findItem(slug)) return;
          var d = wrap.querySelector('.acc-item[data-slug="' + slug + '"]');
          if (d) { d.open = true; d.scrollIntoView({ block: "center" }); }
        }
        if (search) search.addEventListener("input", function () { st.q = this.value.trim().toLowerCase(); build(); });
        chips.forEach(function (chip) {
          chip.addEventListener("click", function () {
            chips.forEach(function (c) { c.classList.remove("chip--active"); });
            chip.classList.add("chip--active");
            st.cat = chip.dataset.cat || "";
            build();
          });
        });
        var onHash = function () { openFromHash(); };
        window.addEventListener("hashchange", onHash);
        teardowns.push(function () { window.removeEventListener("hashchange", onHash); });
        build();
        openFromHash();
      },

      practice: function (p) {
        var panel = document.getElementById("practicePanel");
        var btns = [].slice.call(pageEl.querySelectorAll(".ltab"));

        function renderGlossary() {
          panel.innerHTML =
            '<div class="toolbar"><div class="search-wrap"><span class="material-symbols-rounded search-ic" aria-hidden="true">search</span>' +
            '<input id="gloSearch" class="search" type="search" autocomplete="off" placeholder="' +
              (lang() === "en" ? "Search terms…" : "搜尋術語…") + '" aria-label="' + (lang() === "en" ? "Search" : "搜尋") + '" /></div></div>' +
            '<div class="glo-list" id="gloList">' +
            (p.glossary || []).map(function (g) {
              var hay = (t(g.term) + " " + t(g.def)).toLowerCase();
              return '<details class="glo" data-item data-hay="' + esc(hay) + '">' +
                '<summary class="glo__term"><span>' + esc(t(g.term)) + "</span>" +
                '<span class="material-symbols-rounded glo__chev" aria-hidden="true">expand_more</span></summary>' +
                '<p class="glo__def">' + esc(t(g.def)) + "</p></details>";
            }).join("") + "</div>";
          var s = document.getElementById("gloSearch");
          var items = [].slice.call(panel.querySelectorAll(".glo"));
          if (s) s.addEventListener("input", function () {
            var q = this.value.trim().toLowerCase();
            items.forEach(function (it) { it.style.display = (!q || (it.dataset.hay || "").indexOf(q) !== -1) ? "" : "none"; });
          });
        }
        function renderFlashcards() {
          var hint = lang() === "en" ? "Tap a card to flip it." : "點卡片翻面。";
          panel.innerHTML = '<p class="block__note">' + esc(hint) + "</p>" +
            '<div class="fc-grid">' +
            (p.flashcards || []).map(function (c, i) {
              return '<button class="fc" type="button" data-item aria-pressed="false" data-i="' + i + '">' +
                '<span class="fc__inner">' +
                  '<span class="fc__face fc__front"><span class="fc__tag">' + (lang() === "en" ? "TERM" : "詞") + "</span>" + esc(t(c.front)) + "</span>" +
                  '<span class="fc__face fc__back"><span class="fc__tag">' + (lang() === "en" ? "MEANING" : "義") + "</span>" + esc(t(c.back)) + "</span>" +
                "</span></button>";
            }).join("") + "</div>";
          [].forEach.call(panel.querySelectorAll(".fc"), function (card) {
            card.addEventListener("click", function () {
              var on = card.classList.toggle("fc--flipped");
              card.setAttribute("aria-pressed", on ? "true" : "false");
            });
          });
        }
        function renderQuiz() {
          var quiz = p.quiz || [];
          var score = { right: 0, done: 0, total: quiz.length };
          panel.innerHTML =
            '<div class="quiz-head"><span class="quiz-score" id="quizScore"></span></div>' +
            '<div class="quiz-list">' +
            quiz.map(function (item, qi) {
              var opts = (item.options || []).map(function (o, oi) {
                return '<button class="qopt" type="button" data-q="' + qi + '" data-o="' + oi + '">' + esc(t(o)) + "</button>";
              }).join("");
              return '<div class="quiz-q" data-item data-q="' + qi + '">' +
                '<p class="quiz-q__text"><span class="quiz-q__n">Q' + (qi + 1) + "</span>" + esc(t(item.q)) + "</p>" +
                '<div class="qopts">' + opts + "</div>" +
                '<p class="quiz-explain" id="qx' + qi + '" hidden></p></div>';
            }).join("") + "</div>";
          var scoreEl = document.getElementById("quizScore");
          function paintScore() {
            scoreEl.textContent = (lang() === "en"
              ? ("Score " + score.right + " / " + score.total + "  ·  answered " + score.done)
              : ("得分 " + score.right + " / " + score.total + "  ·  已答 " + score.done));
          }
          paintScore();
          [].forEach.call(panel.querySelectorAll(".quiz-q"), function (qbox) {
            var qi = parseInt(qbox.dataset.q, 10);
            var item = quiz[qi];
            var answered = false;
            var opts = [].slice.call(qbox.querySelectorAll(".qopt"));
            var explain = document.getElementById("qx" + qi);
            opts.forEach(function (btn) {
              btn.addEventListener("click", function () {
                if (answered) return;
                answered = true;
                var oi = parseInt(btn.dataset.o, 10);
                var correct = oi === item.answer;
                if (correct) score.right++;
                score.done++;
                opts.forEach(function (b, bi) {
                  b.disabled = true;
                  if (bi === item.answer) b.classList.add("qopt--right");
                  else if (bi === oi) b.classList.add("qopt--wrong");
                });
                explain.textContent = (correct ? "✅ " : "❌ ") + t(item.explain);
                explain.hidden = false;
                paintScore();
              });
            });
          });
        }
        function show(tab) {
          practiceTab = tab;
          btns.forEach(function (b) {
            var on = b.dataset.tab === tab;
            b.classList.toggle("ltab--active", on);
            b.setAttribute("aria-selected", on ? "true" : "false");
          });
          if (tab === "flashcards") renderFlashcards();
          else if (tab === "quiz") renderQuiz();
          else renderGlossary();
        }
        btns.forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.tab); }); });
        show(practiceTab);
      }
    };

    function render() {
      teardowns.forEach(function (fn) { try { fn(); } catch (e) {} });
      teardowns = [];
      var p = L.currentPage();
      if (!p) { pageEl.innerHTML = '<p class="empty">No page data.</p>'; return; }
      var fn = RENDERERS[p.layout] || RENDERERS.home;
      pageEl.className = "page page--" + p.layout;
      pageEl.innerHTML = fn(p);
      var w = WIRE[p.layout];
      if (w) w(p);
    }

    L.onLang(render);
    render();
  }

  boot();
})();
