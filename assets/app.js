/* =========================================================================
   app.js — page-level rendering engine (vanilla, no build).

   shell.js has already injected the shared chrome and published window.LDW.
   This script picks a renderer from RENDERERS by the current page's `layout`,
   paints it into <main id="page">, wires interactions, and registers an
   onLang() callback so a language switch repaints the whole body.

   Custom layouts: home | pipeline | principles | attacks | hunting |
                   schema | practice
   ========================================================================= */
(function () {
  "use strict";

  /* state that should survive a language-triggered repaint */
  var practiceTab = "glossary";

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

    /* ---------- shared bits ---------- */
    function head(p) {
      var sub = t(p.subtitle)
        ? '<p class="page-head__sub">' + esc(t(p.subtitle)) + "</p>" : "";
      return '<header class="page-head"><div class="page-head__eyebrow"><span class="material-symbols-rounded" aria-hidden="true">' +
        esc(p.icon || "shield") + '</span><span>' + esc(t(p.title)) + "</span></div>" +
        "<h1>" + esc(t(p.title)) + "</h1>" + sub + "</header>";
    }
    function reveal(selector) {
      if (!("IntersectionObserver" in window)) {
        [].forEach.call(pageEl.querySelectorAll(selector), function (el) { el.classList.add("is-in"); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      [].forEach.call(pageEl.querySelectorAll(selector), function (el) { io.observe(el); });
      teardowns.push(function () { io.disconnect(); });
    }
    /* count-up only for integer-valued stats; others render as-is */
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

    /* =====================================================================
       LAYOUT REGISTRY
       ===================================================================== */
    var RENDERERS = {

      /* ---- home / overview ---- */
      home: function (p) {
        var stats = (p.stats || []).map(function (s) {
          return '<div class="kstat" data-item>' +
            '<b class="kstat__value" data-count="' + esc(String(s.value)) + '">' + esc(String(s.value)) + "</b>" +
            '<span class="kstat__label">' + esc(t(s.label)) + "</span></div>";
        }).join("");

        var pitch = (p.pitch || []).map(function (c) {
          return '<article class="pitch reveal" data-item>' +
            '<span class="material-symbols-rounded pitch__icon" aria-hidden="true">' + esc(c.icon) + "</span>" +
            '<h3 class="pitch__title">' + esc(t(c.title)) + "</h3>" +
            '<p class="pitch__body">' + esc(t(c.body)) + "</p></article>";
        }).join("");

        var lin = p.lineage || {};
        var metrics = (lin.metrics || []).map(function (m) {
          return '<div class="metric" data-item><b class="metric__value">' + esc(String(m.value)) + "</b>" +
            '<span class="metric__label">' + esc(t(m.label)) + "</span></div>";
        }).join("");
        var lineage = '<section class="slab reveal" data-item aria-labelledby="lineageH">' +
          '<h2 class="slab__title" id="lineageH">' + esc(t(lin.heading)) + "</h2>" +
          '<p class="slab__body">' + esc(t(lin.body)) + "</p>" +
          '<div class="metric-row">' + metrics + "</div>" +
          '<blockquote class="quote">' + esc(t(lin.quote)) + "</blockquote></section>";

        var src = p.sources || {};
        var links = (src.links || []).map(function (a) {
          return '<a class="srclink" href="' + esc(a.url) + '" target="_blank" rel="noopener">' +
            '<span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>' +
            '<span>' + esc(t(a.label)) + "</span></a>";
        }).join("");
        var sources = '<section class="slab slab--muted reveal" data-item aria-labelledby="srcH">' +
          '<h2 class="slab__title" id="srcH">' + esc(t(src.heading)) + "</h2>" +
          '<p class="slab__body">' + esc(t(src.note)) + "</p>" +
          '<div class="srclinks">' + links + "</div></section>";

        var cards = L.pages.filter(function (q) { return q.slug !== "home"; }).map(function (q) {
          return '<a class="navcard reveal" data-item href="' + esc(L.pageHref(q)) + '" aria-label="' + esc(t(q.title)) + '">' +
            '<span class="material-symbols-rounded navcard__icon" aria-hidden="true">' + esc(q.icon || "label") + "</span>" +
            '<span class="navcard__text"><b>' + esc(t(q.title)) + "</b>" +
            '<span>' + esc(t(q.subtitle)) + "</span></span>" +
            '<span class="material-symbols-rounded navcard__go" aria-hidden="true">arrow_forward</span></a>';
        }).join("");

        var exploreLabel = lang() === "en" ? "Explore the skill" : "逐章拆解";

        return '<section class="hero" data-item>' +
            '<div class="terminal" aria-hidden="true"><span class="terminal__dot"></span><span class="terminal__dot"></span><span class="terminal__dot"></span>' +
              '<code class="terminal__cmd">' + esc(p.command || "") + '<span class="terminal__caret"></span></code></div>' +
            '<p class="hero__lede">' + esc(t(p.lede)) + "</p>" +
            '<div class="kstats">' + stats + "</div>" +
          "</section>" +
          '<div class="pitch-grid">' + pitch + "</div>" +
          lineage +
          '<h2 class="section-label"><span class="section-label__hash">//</span> ' + esc(exploreLabel) + "</h2>" +
          '<div class="navgrid">' + cards + "</div>" +
          sources;
      },

      /* ---- pipeline ---- */
      pipeline: function (p) {
        var intro = t(p.intro) ? '<p class="lead reveal" data-item>' + esc(t(p.intro)) + "</p>" : "";
        var phases = (p.phases || []).map(function (ph) {
          var details = (ph.detail || []).map(function (d) {
            return "<li>" + esc(t(d)) + "</li>";
          }).join("");
          return '<li class="phase reveal" data-item data-phase="' + esc(ph.key) + '">' +
            '<div class="phase__rail" aria-hidden="true"><span class="phase__num">' + esc(ph.n) + "</span></div>" +
            '<div class="phase__card">' +
              '<div class="phase__top">' +
                '<h3 class="phase__name">' + esc(t(ph.name)) + "</h3>" +
                '<span class="badge badge--agents"><span class="material-symbols-rounded" aria-hidden="true">smart_toy</span>' + esc(t(ph.agents)) + "</span>" +
              "</div>" +
              '<p class="phase__summary">' + esc(t(ph.summary)) + "</p>" +
              (ph.output ? '<div class="phase__out"><span class="material-symbols-rounded" aria-hidden="true">output</span><code>' + esc(ph.output) + "</code></div>" : "") +
              "<ul class=\"phase__detail\">" + details + "</ul>" +
            "</div></li>";
        }).join("");
        var cov = p.coverage || {};
        var coverage = '<section class="callout reveal" data-item>' +
          '<span class="material-symbols-rounded callout__icon" aria-hidden="true">replay</span>' +
          '<div><h3 class="callout__title">' + esc(t(cov.heading)) + "</h3>" +
          '<p class="callout__body">' + esc(t(cov.body)) + "</p></div></section>";
        return head(p) + intro + '<ol class="phases">' + phases + "</ol>" + coverage;
      },

      /* ---- principles + severity + anti-patterns ---- */
      principles: function (p) {
        var pr = (p.principles || []).map(function (c) {
          return '<article class="prin reveal" data-item>' +
            '<span class="material-symbols-rounded prin__icon" aria-hidden="true">' + esc(c.icon) + "</span>" +
            '<h3 class="prin__title">' + esc(t(c.title)) + "</h3>" +
            '<p class="prin__body">' + esc(t(c.body)) + "</p></article>";
        }).join("");

        var sev = p.severity || {};
        var levels = (sev.levels || []).map(function (lv) {
          return '<div class="sev sev--' + esc(lv.level) + '" data-item>' +
            '<span class="sev__tag">' + esc(t(lv.label)) + "</span>" +
            '<p class="sev__body">' + esc(t(lv.body)) + "</p></div>";
        }).join("");
        var severity = '<section class="block reveal" aria-labelledby="sevH">' +
          '<h2 class="block__title" id="sevH"><span class="section-label__hash">//</span> ' + esc(t(sev.heading)) + "</h2>" +
          '<p class="block__note">' + esc(t(sev.note)) + "</p>" +
          '<div class="sev-ladder">' + levels + "</div></section>";

        var ap = p.antipatterns || {};
        var aps = (ap.items || []).map(function (it, i) {
          return '<article class="anti reveal" data-item>' +
            '<span class="anti__x material-symbols-rounded" aria-hidden="true">block</span>' +
            '<div><h3 class="anti__title">' + esc(t(it.title)) + "</h3>" +
            '<p class="anti__body">' + esc(t(it.body)) + "</p></div></article>";
        }).join("");
        var anti = '<section class="block reveal" aria-labelledby="apH">' +
          '<h2 class="block__title" id="apH"><span class="section-label__hash">//</span> ' + esc(t(ap.heading)) + "</h2>" +
          '<p class="block__note">' + esc(t(ap.note)) + "</p>" +
          '<div class="anti-grid">' + aps + "</div></section>";

        return head(p) + '<div class="prin-grid">' + pr + "</div>" + severity + anti;
      },

      /* ---- attacks: search + chips + cards + dialog ---- */
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
          '<div class="atk-grid" id="grid"></div>';
      },

      /* ---- hunting angles + validation rules ---- */
      hunting: function (p) {
        var intro = t(p.intro) ? '<p class="lead reveal" data-item>' + esc(t(p.intro)) + "</p>" : "";
        var angles = (p.angles || []).map(function (a) {
          return '<article class="angle reveal" data-item>' +
            '<span class="angle__n">' + esc(a.n) + "</span>" +
            '<h3 class="angle__title">' + esc(t(a.title)) + "</h3>" +
            '<p class="angle__body">' + esc(t(a.body)) + "</p></article>";
        }).join("");
        var rl = p.rules || {};
        var rules = (rl.items || []).map(function (it) {
          return '<li class="rule" data-item><span class="material-symbols-rounded rule__check" aria-hidden="true">check_circle</span>' +
            "<span>" + esc(t(it)) + "</span></li>";
        }).join("");
        var rulesBlock = '<section class="block reveal" aria-labelledby="rulesH">' +
          '<h2 class="block__title" id="rulesH"><span class="section-label__hash">//</span> ' + esc(t(rl.heading)) + "</h2>" +
          '<ul class="rules">' + rules + "</ul></section>";
        return head(p) + intro + '<div class="angle-grid">' + angles + "</div>" + rulesBlock;
      },

      /* ---- schema: field tables + example + validator ---- */
      schema: function (p) {
        var intro = t(p.intro) ? '<p class="lead reveal" data-item>' + esc(t(p.intro)) + "</p>" : "";

        function fieldTable(group) {
          var rows = (group.fields || []).map(function (f) {
            return '<tr data-item><td class="fld__name"><code>' + esc(f.name) + "</code></td>" +
              '<td class="fld__type"><code>' + esc(f.type) + "</code></td>" +
              '<td class="fld__desc">' + esc(t(f.desc)) + "</td></tr>";
          }).join("");
          var heads = lang() === "en"
            ? ["Field", "Type", "Description"]
            : ["欄位", "型別", "說明"];
          return '<section class="block reveal" aria-labelledby="' + esc(group._id) + '">' +
            '<h2 class="block__title" id="' + esc(group._id) + '"><span class="section-label__hash">//</span> ' + esc(t(group.heading)) + "</h2>" +
            '<div class="table-wrap"><table class="fld-table"><thead><tr>' +
              "<th>" + esc(heads[0]) + "</th><th>" + esc(heads[1]) + "</th><th>" + esc(heads[2]) + "</th>" +
            "</tr></thead><tbody>" + rows + "</tbody></table></div></section>";
        }

        var confirmed = p.confirmed ? fieldTable({ _id: "cfH", heading: p.confirmed.heading, fields: p.confirmed.fields }) : "";
        var rejected = p.rejected ? fieldTable({ _id: "rjH", heading: p.rejected.heading, fields: p.rejected.fields }) : "";

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

        return head(p) + intro + confirmed + rejected + example + validator;
      },

      /* ---- practice: glossary + flashcards + quiz ---- */
      practice: function (p) {
        var tabs = p.tabs || {};
        function seg(key) {
          return '<button class="seg__btn' + (practiceTab === key ? " seg__btn--active" : "") +
            '" type="button" role="tab" aria-selected="' + (practiceTab === key) + '" data-tab="' + key + '">' +
            esc(t(tabs[key])) + "</button>";
        }
        return head(p) +
          '<div class="seg" role="tablist">' + seg("glossary") + seg("flashcards") + seg("quiz") + "</div>" +
          '<div id="practicePanel" data-item></div>';
      }
    };

    /* =====================================================================
       WIRING
       ===================================================================== */
    var WIRE = {
      home: function () { wireCounters(); reveal(".reveal"); },
      pipeline: function () { reveal(".reveal"); },
      principles: function () { reveal(".reveal"); },
      hunting: function () { reveal(".reveal"); },
      schema: function () { reveal(".reveal"); },

      attacks: function (p) {
        var grid = document.getElementById("grid");
        var search = document.getElementById("search");
        var count = document.getElementById("resultCount");
        var chips = [].slice.call(pageEl.querySelectorAll(".chip"));
        var st = { q: "", cat: "" };

        function matches(item) {
          if (st.cat && item.category !== st.cat) return false;
          if (!st.q) return true;
          var hay = (t(item.title) + " " + t(item.summary) + " " + (item.tags || []).join(" ")).toLowerCase();
          return hay.indexOf(st.q) !== -1;
        }
        function findItem(slug) {
          return (p.items || []).filter(function (it) { return it.slug === slug; })[0] || null;
        }
        function paint() {
          var rows = (p.items || []).filter(matches);
          grid.innerHTML = rows.map(function (item) {
            var tags = (item.tags || []).slice(0, 4).map(function (g) { return '<span class="tag">' + esc(g) + "</span>"; }).join("");
            return '<article class="atk-card" tabindex="0" role="button" data-item data-slug="' + esc(item.slug) + '" aria-label="' + esc(t(item.title)) + '">' +
              '<span class="material-symbols-rounded atk-card__icon" aria-hidden="true">' + esc(item.icon || "swords") + "</span>" +
              '<h3 class="atk-card__title">' + esc(t(item.title)) + "</h3>" +
              '<p class="atk-card__summary">' + esc(t(item.summary)) + "</p>" +
              (tags ? '<div class="card__tags">' + tags + "</div>" : "") + "</article>";
          }).join("");
          if (count) count.textContent = rows.length + (lang() === "en" ? " class(es)" : " 個類別");
          wireCards();
        }
        function wireCards() {
          [].forEach.call(grid.querySelectorAll(".atk-card[data-slug]"), function (card) {
            var slug = card.dataset.slug;
            card.addEventListener("click", function () { openItem(slug); });
            card.addEventListener("keydown", function (e) {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openItem(slug); }
            });
          });
        }
        function openItem(slug) {
          var item = findItem(slug); if (!item) return;
          var dlg = L.dialog(), body = document.getElementById("dialogBody");
          var tags = (item.tags || []).map(function (g) { return '<span class="tag">' + esc(g) + "</span>"; }).join("");
          var checks = (item.checks || []).map(function (c) { return "<li>" + esc(t(c)) + "</li>"; }).join("");
          var checksLabel = lang() === "en" ? "What to chase" : "重點追查";
          body.innerHTML =
            '<div class="dlg-head"><span class="material-symbols-rounded dlg-head__icon" aria-hidden="true">' + esc(item.icon || "swords") + "</span>" +
            '<h2 id="dialogTitle">' + esc(t(item.title)) + "</h2></div>" +
            (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
            "<p>" + esc(t(item.overview)) + "</p>" +
            (checks ? '<h3 class="dlg-sub">' + esc(checksLabel) + "</h3><ul class=\"dlg-list\">" + checks + "</ul>" : "");
          if (!dlg.open) dlg.showModal();
          if (location.hash.slice(1) !== slug) history.replaceState(null, "", "#" + slug);
        }
        function syncHash() {
          var slug = location.hash.slice(1);
          if (slug && findItem(slug)) openItem(slug);
        }
        if (search) search.addEventListener("input", function () { st.q = this.value.trim().toLowerCase(); paint(); });
        chips.forEach(function (chip) {
          chip.addEventListener("click", function () {
            chips.forEach(function (c) { c.classList.remove("chip--active"); });
            chip.classList.add("chip--active");
            st.cat = chip.dataset.cat || "";
            paint();
          });
        });
        var dlg = L.dialog();
        function onClose() {
          var slug = location.hash.slice(1);
          if (slug && findItem(slug)) history.replaceState(null, "", location.pathname + location.search);
        }
        dlg.addEventListener("close", onClose);
        var onHash = function () { syncHash(); };
        window.addEventListener("hashchange", onHash);
        teardowns.push(function () {
          window.removeEventListener("hashchange", onHash);
          dlg.removeEventListener("close", onClose);
        });
        paint();
        syncHash();
      },

      practice: function (p) {
        var panel = document.getElementById("practicePanel");
        var btns = [].slice.call(pageEl.querySelectorAll(".seg__btn"));

        function renderGlossary() {
          var box =
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
          panel.innerHTML = box;
          var s = document.getElementById("gloSearch");
          var items = [].slice.call(panel.querySelectorAll(".glo"));
          if (s) s.addEventListener("input", function () {
            var q = this.value.trim().toLowerCase();
            items.forEach(function (it) {
              it.style.display = (!q || (it.dataset.hay || "").indexOf(q) !== -1) ? "" : "none";
            });
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
            b.classList.toggle("seg__btn--active", on);
            b.setAttribute("aria-selected", on ? "true" : "false");
          });
          if (tab === "flashcards") renderFlashcards();
          else if (tab === "quiz") renderQuiz();
          else renderGlossary();
        }
        btns.forEach(function (b) {
          b.addEventListener("click", function () { show(b.dataset.tab); });
        });
        show(practiceTab);
      }
    };

    /* =====================================================================
       RENDER
       ===================================================================== */
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
