/* =========================================================================
   app.js — page-level rendering engine (vanilla, no build).

   shell.js has already injected the shared chrome and published window.LDW.
   This script picks a renderer from RENDERERS by the current page's `layout`,
   paints it into <main id="page">, wires interactions, and registers an
   onLang() callback so a language switch repaints the whole body.

   Layouts are intentionally NON-card: inline stat strips, feature rows,
   index lists, a connected stepper, numbered editorial lists, an accordion,
   tables and a tabbed practice panel.
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

    /* ---------- shared bits ---------- */
    function head(p) {
      var sub = t(p.subtitle)
        ? '<p class="page-head__sub">' + esc(t(p.subtitle)) + "</p>" : "";
      return '<header class="page-head"><div class="page-head__eyebrow"><span class="material-symbols-rounded" aria-hidden="true">' +
        esc(p.icon || "shield") + '</span><span>' + esc(t(p.title)) + "</span></div>" +
        "<h1>" + esc(t(p.title)) + "</h1>" + sub + "</header>";
    }
    function pad2(n) { return ("0" + n).slice(-2); }
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

      /* ---- home: hero + stat strip + feature rows + lineage band + index list ---- */
      home: function (p) {
        var stats = (p.stats || []).map(function (s) {
          return '<div class="statbar__item" data-item>' +
            '<b class="statbar__value" data-count="' + esc(String(s.value)) + '">' + esc(String(s.value)) + "</b>" +
            '<span class="statbar__label">' + esc(t(s.label)) + "</span></div>";
        }).join("");

        var pitch = (p.pitch || []).map(function (c) {
          return '<div class="frow reveal" data-item>' +
            '<span class="material-symbols-rounded frow__icon" aria-hidden="true">' + esc(c.icon) + "</span>" +
            '<div class="frow__text"><h3 class="frow__title">' + esc(t(c.title)) + "</h3>" +
            '<p class="frow__body">' + esc(t(c.body)) + "</p></div></div>";
        }).join("");

        var lin = p.lineage || {};
        var metrics = (lin.metrics || []).map(function (m) {
          return '<div class="metricbar__item" data-item><b class="metricbar__value">' + esc(String(m.value)) + "</b>" +
            '<span class="metricbar__label">' + esc(t(m.label)) + "</span></div>";
        }).join("");
        var lineage = '<section class="band reveal" data-item aria-labelledby="lineageH">' +
          '<h2 class="band__title" id="lineageH">' + esc(t(lin.heading)) + "</h2>" +
          '<p class="band__body">' + esc(t(lin.body)) + "</p>" +
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
          '<div class="flist">' + pitch + "</div>" +
          lineage +
          '<h2 class="section-label"><span class="section-label__hash">//</span> ' + esc(exploreLabel) + "</h2>" +
          '<nav class="idxlist" aria-label="' + esc(exploreLabel) + '">' + idx + "</nav>" +
          sources;
      },

      /* ---- pipeline: connected stepper ---- */
      pipeline: function (p) {
        var intro = t(p.intro) ? '<p class="lead reveal" data-item>' + esc(t(p.intro)) + "</p>" : "";
        var phases = (p.phases || []).map(function (ph) {
          var details = (ph.detail || []).map(function (d) { return "<li>" + esc(t(d)) + "</li>"; }).join("");
          return '<li class="step reveal" data-item>' +
            '<div class="step__rail" aria-hidden="true"><span class="step__num">' + esc(ph.n) + "</span></div>" +
            '<div class="step__body">' +
              '<div class="step__top"><h3 class="step__name">' + esc(t(ph.name)) + "</h3>" +
                '<span class="badge badge--agents"><span class="material-symbols-rounded" aria-hidden="true">smart_toy</span>' + esc(t(ph.agents)) + "</span></div>" +
              '<p class="step__summary">' + esc(t(ph.summary)) + "</p>" +
              (ph.output ? '<div class="step__out"><span class="material-symbols-rounded" aria-hidden="true">output</span><code>' + esc(ph.output) + "</code></div>" : "") +
              '<ul class="step__detail">' + details + "</ul>" +
            "</div></li>";
        }).join("");
        var cov = p.coverage || {};
        var coverage = '<section class="callout reveal" data-item>' +
          '<span class="material-symbols-rounded callout__icon" aria-hidden="true">replay</span>' +
          '<div><h3 class="callout__title">' + esc(t(cov.heading)) + "</h3>" +
          '<p class="callout__body">' + esc(t(cov.body)) + "</p></div></section>";
        return head(p) + intro + '<ol class="steps">' + phases + "</ol>" + coverage;
      },

      /* ---- principles: numbered definition list + severity ladder + numbered anti-patterns ---- */
      principles: function (p) {
        var pr = (p.principles || []).map(function (c, i) {
          return '<div class="defrow reveal" data-item><span class="defrow__n">' + pad2(i + 1) + "</span>" +
            '<span class="material-symbols-rounded defrow__icon" aria-hidden="true">' + esc(c.icon) + "</span>" +
            '<div class="defrow__text"><h3 class="defrow__title">' + esc(t(c.title)) + "</h3>" +
            '<p class="defrow__body">' + esc(t(c.body)) + "</p></div></div>";
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
          return '<li class="numrow reveal" data-item><span class="numrow__n numrow__n--x">' + (i + 1) + "</span>" +
            '<div class="numrow__text"><h3 class="numrow__title">' + esc(t(it.title)) + "</h3>" +
            '<p class="numrow__body">' + esc(t(it.body)) + "</p></div></li>";
        }).join("");
        var anti = '<section class="block reveal" aria-labelledby="apH">' +
          '<h2 class="block__title" id="apH"><span class="section-label__hash">//</span> ' + esc(t(ap.heading)) + "</h2>" +
          '<p class="block__note">' + esc(t(ap.note)) + "</p>" +
          '<ol class="numlist">' + aps + "</ol></section>";

        return head(p) + '<div class="deflist">' + pr + "</div>" + severity + anti;
      },

      /* ---- attacks: searchable + filterable accordion ---- */
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
          '<div class="acc" id="acc"></div>';
      },

      /* ---- hunting: numbered editorial list + validation checklist ---- */
      hunting: function (p) {
        var intro = t(p.intro) ? '<p class="lead reveal" data-item>' + esc(t(p.intro)) + "</p>" : "";
        var angles = (p.angles || []).map(function (a) {
          return '<li class="numrow reveal" data-item><span class="numrow__n">' + esc(a.n) + "</span>" +
            '<div class="numrow__text"><h3 class="numrow__title">' + esc(t(a.title)) + "</h3>" +
            '<p class="numrow__body">' + esc(t(a.body)) + "</p></div></li>";
        }).join("");
        var rl = p.rules || {};
        var rules = (rl.items || []).map(function (it) {
          return '<li class="rule" data-item><span class="material-symbols-rounded rule__check" aria-hidden="true">check_circle</span>' +
            "<span>" + esc(t(it)) + "</span></li>";
        }).join("");
        var rulesBlock = '<section class="block reveal" aria-labelledby="rulesH">' +
          '<h2 class="block__title" id="rulesH"><span class="section-label__hash">//</span> ' + esc(t(rl.heading)) + "</h2>" +
          '<ul class="rules">' + rules + "</ul></section>";
        return head(p) + intro + '<ol class="numlist">' + angles + "</ol>" + rulesBlock;
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
          var heads = lang() === "en" ? ["Field", "Type", "Description"] : ["欄位", "型別", "說明"];
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
        var accEl = document.getElementById("acc");
        var search = document.getElementById("search");
        var count = document.getElementById("resultCount");
        var chips = [].slice.call(pageEl.querySelectorAll(".chip"));
        var st = { q: "", cat: "" };
        var checksLabel = lang() === "en" ? "What to chase" : "重點追查";

        function matches(item) {
          if (st.cat && item.category !== st.cat) return false;
          if (!st.q) return true;
          var hay = (t(item.title) + " " + t(item.summary) + " " + t(item.overview) + " " + (item.tags || []).join(" ")).toLowerCase();
          return hay.indexOf(st.q) !== -1;
        }
        function findItem(slug) {
          return (p.items || []).filter(function (it) { return it.slug === slug; })[0] || null;
        }
        function build() {
          var rows = (p.items || []).filter(matches);
          accEl.innerHTML = rows.map(function (item) {
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
          }).join("");
          if (count) count.textContent = rows.length + (lang() === "en" ? " class(es)" : " 個類別");
          wireToggles();
        }
        function wireToggles() {
          [].forEach.call(accEl.querySelectorAll(".acc-item"), function (d) {
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
          var d = accEl.querySelector('.acc-item[data-slug="' + slug + '"]');
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
        reveal(".acc-item");
      },

      practice: function (p) {
        var panel = document.getElementById("practicePanel");
        var btns = [].slice.call(pageEl.querySelectorAll(".seg__btn"));

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
        btns.forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.tab); }); });
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
