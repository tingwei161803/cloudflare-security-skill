/* =========================================================================
   data.js — single source of truth for the whole site.
   window.SITE_META  : site title + subtitle (drives <title>, brand, footer)
   window.SITE_PAGES : one entry per page; order === cross-page nav order.
   Every human-facing string is a {en, zh} object so a language switch can
   repaint the entire site with nothing left untranslated.
   ========================================================================= */

window.SITE_META = {
  title:    { en: "Security Audit Skill", zh: "Security Audit Skill" },
  subtitle: {
    en: "An interactive field guide to Cloudflare's open-source agentic security-audit skill.",
    zh: "Cloudflare 開源 agentic 資安稽核 skill 的互動式拆解。"
  }
};

window.SITE_PAGES = [

  /* =====================================================================
     1 · HOME / OVERVIEW
     ===================================================================== */
  {
    slug: "home",
    layout: "home",
    icon: "shield",
    title:    { en: "Overview", zh: "總覽" },
    subtitle: {
      en: "Turn a coding agent into a security auditor that finds exploitable bugs — not checklist noise.",
      zh: "把 coding agent 變成資安稽核員,只找「真的能被利用」的漏洞,不堆砌 checklist 雜訊。"
    },
    command: "$ security audit ./codebase",
    lede: {
      en: "security-audit is an agent-neutral skill that orchestrates many parallel sub-agents through a six-phase pipeline — recon, hunting, validation, reporting, structured output, and independent verification — to surface vulnerabilities with real, demonstrable impact. It is the open-source seed that grew into Cloudflare's fleet-wide vulnerability harness.",
      zh: "security-audit 是一個與平台無關(agent-neutral)的 skill,透過六階段管線——偵察、獵捕、驗證、報告、結構化輸出、獨立複查——調度大量平行子代理,找出「有真實、可展示影響」的漏洞。它正是後來長成 Cloudflare 全機隊漏洞獵捕系統的開源種子。"
    },
    stats: [
      { value: "6",    label: { en: "Phases in the pipeline",     zh: "管線階段" } },
      { value: "9",    label: { en: "Attack-agent scopes",        zh: "攻擊代理視角" } },
      { value: "12",   label: { en: "Hunting angles",             zh: "獵捕視角" } },
      { value: "~50%", label: { en: "Bugs found in one run",      zh: "單次執行覆蓋率" } }
    ],
    pitch: [
      {
        icon: "bug_report",
        title: { en: "Exploit, don't theorize", zh: "能利用,而非空談" },
        body: {
          en: "Every finding needs a concrete attack: who the attacker is, what they send, and what they get. \"An attacker could theoretically…\" is not a finding.",
          zh: "每個發現都要有具體攻擊:攻擊者是誰、送出什麼、得到什麼。「攻擊者理論上可以……」不算發現。"
        }
      },
      {
        icon: "balance",
        title: { en: "Adversarial by design", zh: "對抗式設計" },
        body: {
          en: "The agent that finds a bug is never the agent that validates it, and a third fresh agent re-verifies every claim against the source. Bias is cancelled, not trusted.",
          zh: "找到 bug 的代理,絕不是驗證它的代理;再由第三個全新的代理對著原始碼複查每一項主張。偏誤被相互抵銷,而非被信任。"
        }
      },
      {
        icon: "layers",
        title: { en: "Severity = impact", zh: "嚴重度=影響" },
        body: {
          en: "Severity is likelihood × impact, not deviation from OWASP. A gap that another layer already blocks is a hardening note, not a vulnerability.",
          zh: "嚴重度是「可能性 × 影響」,不是「偏離 OWASP 多少」。若另一層已擋住,那只是強化建議,不是漏洞。"
        }
      }
    ],
    lineage: {
      heading: { en: "From a skill to a fleet", zh: "從一個 skill 到一支機隊" },
      body: {
        en: "Cloudflare published this single-repo skill as the starting point for its internal harness. That harness grew into a two-stage, fleet-wide system — a Vulnerability Discovery Harness (VDH) plus a Vulnerability Validation System (VVS) — scanning 128 repositories. The numbers below are from that production system; the skill on this site is the foundation it evolved from.",
        zh: "Cloudflare 把這個單一 repo 的 skill 開源,作為其內部獵捕系統的起點。該系統後來長成一套兩階段、覆蓋全機隊的架構——漏洞發掘系統(VDH)+ 漏洞驗證系統(VVS)——掃描 128 個 repo。下方數字來自那套正式系統;本站介紹的 skill 即是它演化的地基。"
      },
      metrics: [
        { value: "~450", label: { en: "Lines in the original skill", zh: "原始 skill 行數" } },
        { value: "128",  label: { en: "Repos scanned by the harness", zh: "機隊掃描 repo 數" } },
        { value: "7,245",label: { en: "Final actionable findings",    zh: "最終可處理發現數" } },
        { value: "40→11%",label:{ en: "False-positive rejection rate", zh: "誤報拒絕率變化" } }
      ],
      funnel: {
        heading: { en: "How 20,799 candidates became 7,245 findings", zh: "20,799 個候選如何收斂成 7,245 筆發現" },
        steps: [
          { value: 20799, label: { en: "Raw candidates", zh: "原始候選" } },
          { value: 12057, label: { en: "Survived VDH validation", zh: "通過 VDH 驗證" } },
          { value: 7245,  label: { en: "Final actionable findings", zh: "最終可處理發現" } }
        ]
      },
      quote: {
        en: "\"The harness is the bit that lasts.\" Models are swappable components; the orchestration is the durable asset. Start with a skill, get the prompts right, and only build the next stage when not having it is the specific thing slowing you down.",
        zh: "「真正會留下來的是 harness。」模型是可替換的零件,編排才是耐久的資產。先從一個 skill 開始,把 prompt 調好,等到「缺了下一個架構階段」真的成為瓶頸時,再去建它。"
      }
    },
    sources: {
      heading: { en: "Sources", zh: "資料來源" },
      note: {
        en: "This is an independent, unofficial explainer. Content is distilled from the skill's own files; production metrics are from Cloudflare's engineering blog. Not affiliated with Cloudflare.",
        zh: "本站為獨立、非官方的整理。內容萃取自 skill 本身的檔案;正式系統數據引自 Cloudflare 工程部落格。與 Cloudflare 無隸屬關係。"
      },
      links: [
        { label: { en: "Skill repository (MIT)", zh: "Skill 原始碼(MIT)" }, url: "https://github.com/cloudflare/security-audit-skill" },
        { label: { en: "Blog: Build your own vulnerability harness", zh: "部落格:Build your own vulnerability harness" }, url: "https://blog.cloudflare.com/build-your-own-vulnerability-harness" }
      ]
    }
  },

  /* =====================================================================
     2 · PIPELINE — the six phases
     ===================================================================== */
  {
    slug: "pipeline",
    layout: "pipeline",
    icon: "account_tree",
    title:    { en: "The 6-Phase Pipeline", zh: "六階段管線" },
    subtitle: {
      en: "Run all six phases in order. Each narrows the funnel from \"map the code\" to \"a verified, machine-readable finding\".",
      zh: "六個階段依序執行,把漏斗從「先看懂程式碼」一路收斂到「一筆經過複查、可被機器讀取的發現」。"
    },
    intro: {
      en: "Sub-agents in phases 2, 3 and 6 do not write files — they return results to the orchestrator, which owns every artifact written to the output directory.",
      zh: "第 2、3、6 階段的子代理不寫檔——它們把結果交回給協調者,由協調者統一把所有產物寫進輸出資料夾。"
    },
    phases: [
      {
        n: "01", key: "recon",
        name:   { en: "Recon", zh: "偵察 Recon" },
        agents: { en: "3 parallel research agents", zh: "3 個平行 research 代理" },
        summary: {
          en: "Understand the application before hunting. Three agents map it from different angles, then their output is synthesized into architecture.md.",
          zh: "在獵捕之前先看懂應用程式。三個代理從不同面向描繪它,再把輸出整併成 architecture.md。"
        },
        output: "architecture.md",
        detail: [
          { en: "1a — Overview, tech stack, and a comparable baseline to calibrate against.", zh: "1a — 應用概覽、技術棧,以及可用來校準的對照基準(comparable baseline)。" },
          { en: "1b — Trust boundaries, authentication, authorization, privilege separation, bypass mechanisms.", zh: "1b — 信任邊界、認證、授權、權限分離,以及各種繞道機制。" },
          { en: "1c — Exhaustive inventory of every place untrusted input enters the system.", zh: "1c — 鉅細靡遺列出所有「不受信任輸入進入系統」的入口。" },
          { en: "architecture.md is injected verbatim into every Phase 2 agent prompt.", zh: "architecture.md 會被原樣注入每一個第 2 階段代理的 prompt。" }
        ]
      },
      {
        n: "02", key: "hunt",
        name:   { en: "Hunt", zh: "獵捕 Hunt" },
        agents: { en: "parallel general agents (can spawn sub-agents)", zh: "多個平行 general 代理(可再生子代理)" },
        summary: {
          en: "Many general agents attack the codebase concurrently, each owning an attack class and/or subsystem. They think like an attacker, not a code reviewer.",
          zh: "多個 general 代理同時攻擊程式碼,各自負責一個攻擊類別與/或子系統。它們以攻擊者的角度思考,而非審稿者。"
        },
        output: "→ findings (returned to orchestrator)",
        detail: [
          { en: "3–4 agents for a small library; 8–12+ for a large app — split by attack class AND subsystem.", zh: "小型函式庫 3–4 個代理;大型應用 8–12 個以上——依攻擊類別「與」子系統拆分。" },
          { en: "Each prompt carries the architecture summary, an attack class, starting file paths, the hunting methodology, and the validation rules.", zh: "每個 prompt 都帶上架構摘要、一個攻擊類別、起點檔案路徑、獵捕方法論與驗證規則。" },
          { en: "A hunter can fork a focused research sub-agent to go deep on a subsystem instead of overflowing its own context.", zh: "獵人可以分叉一個聚焦的 research 子代理深入某子系統,而不必把所有東西塞進自己的 context。" }
        ]
      },
      {
        n: "03", key: "validate",
        name:   { en: "Validate", zh: "驗證 Validate" },
        agents: { en: "separate research agent per finding", zh: "每筆發現一個獨立 research 代理" },
        summary: {
          en: "Consolidate duplicates first, then a different agent tries to DISPROVE each finding. Hunters are biased to find; validators are biased to kill false positives.",
          zh: "先合併重複,再由「不同的」代理嘗試「推翻」每筆發現。獵人傾向找出東西,驗證者傾向幹掉誤報。"
        },
        output: "CONFIRMED / REJECTED",
        detail: [
          { en: "Exploitation test — read the actual code; can you construct the exact triggering input?", zh: "可利用性測試——讀真正的程式碼;你能構造出確切的觸發輸入嗎?" },
          { en: "Impact test — what does the attacker actually get? \"Learns field names\" is LOW at best.", zh: "影響測試——攻擊者實際得到什麼?「知道欄位名稱」頂多是 LOW。" },
          { en: "Baseline / mitigation / parser-runtime tests — does another layer already stop it? Verify against the spec, don't reason from intuition.", zh: "基準 / 緩解 / parser-runtime 測試——是否已有另一層擋住?要對照規格驗證,別憑直覺推論。" }
        ]
      },
      {
        n: "04", key: "report",
        name:   { en: "Report", zh: "報告 Report" },
        agents: { en: "orchestrator writes the prose", zh: "由協調者撰寫人類可讀報告" },
        summary: {
          en: "Two human-readable documents. Keep them short: if the report is longer than the codebase deserves, it's padding.",
          zh: "兩份人類可讀文件。要短:如果報告長到超過這份程式碼所值得的篇幅,那就是在灌水。"
        },
        output: "REPORT.md · FINDINGS-DETAIL.md",
        detail: [
          { en: "REPORT.md — exec summary, baseline comparison, findings table, hardening notes, and what the code does well.", zh: "REPORT.md——執行摘要、基準比較、發現表、強化建議,以及這份程式碼做得好的地方。" },
          { en: "FINDINGS-DETAIL.md — for every MEDIUM+ finding: full data flow with file:line, exact requests, what the attacker gets.", zh: "FINDINGS-DETAIL.md——每筆 MEDIUM 以上發現:含 file:line 的完整資料流、確切請求、攻擊者所得。" },
          { en: "Naming what's solid builds trust in the findings you do report.", zh: "點出哪裡穩固,能讓你「真正報出來」的發現更被信任。" }
        ]
      },
      {
        n: "05", key: "structured",
        name:   { en: "Structured Output", zh: "結構化輸出" },
        agents: { en: "schema-validated JSON", zh: "經 schema 驗證的 JSON" },
        summary: {
          en: "Every surviving finding becomes a JSON object conforming to report-schema.json, then validate-findings.cjs checks it structurally.",
          zh: "每筆存活的發現轉成符合 report-schema.json 的 JSON 物件,再由 validate-findings.cjs 做結構檢查。"
        },
        output: "findings.json",
        detail: [
          { en: "additionalProperties:false is enforced — extra fields make the output invalid.", zh: "強制 additionalProperties:false——多餘欄位會讓輸出不合法。" },
          { en: "If you can't fill trace with real, source-verified file paths and line numbers, the finding isn't verified enough.", zh: "若你無法用「對著原始碼驗證過的真實檔案路徑與行號」填滿 trace,代表這筆發現驗證得還不夠。" },
          { en: "The validator is a structural check only — factual correctness is Phase 6's job.", zh: "驗證器只做結構檢查——事實正確性是第 6 階段的工作。" }
        ]
      },
      {
        n: "06", key: "verify",
        name:   { en: "Independent Verification", zh: "獨立複查" },
        agents: { en: "one fresh research agent per finding", zh: "每筆發現一個全新 research 代理" },
        summary: {
          en: "The agent that wrote the finding can't catch its own blind spots. A fresh agent re-reads the source and checks every factual claim. This is the final quality gate — do not skip it.",
          zh: "寫出發現的代理看不見自己的盲點。一個全新的代理重讀原始碼,逐項查核每個事實主張。這是最後一道品質關卡——不可略過。"
        },
        output: "VERIFIED / CORRECTED / REJECTED",
        detail: [
          { en: "Verify every trace step: the file exists, the line matches, the scope (function) is right, the description is accurate.", zh: "查核每個 trace 步驟:檔案存在、行號吻合、scope(函式)正確、描述準確。" },
          { en: "Verify the payloads would actually work, conditions are complete, and the remediation wouldn't break normal functionality.", zh: "查核 payload 真的會生效、前提條件完整,且修補不會弄壞正常功能。" },
          { en: "Reconcile REPORT.md and findings.json so the prose and the machine output never disagree.", zh: "校準 REPORT.md 與 findings.json,讓人類報告與機器輸出永不矛盾。" }
        ]
      }
    ],
    coverage: {
      heading: { en: "Runs are additive", zh: "多次執行會累加" },
      body: {
        en: "No single run finds everything — the best single run finds roughly half the vulnerabilities discoverable across multiple runs. Subsequent runs read prior findings.json files to skip known issues and aim hunting effort at the gaps.",
        zh: "沒有任何單次執行能找到全部——最好的單次執行大約只找到「多次執行可發現漏洞」的一半。後續執行會讀取先前的 findings.json,跳過已知問題,把獵捕火力對準缺口。"
      }
    }
  },

  /* =====================================================================
     3 · PRINCIPLES + SEVERITY + ANTI-PATTERNS
     ===================================================================== */
  {
    slug: "principles",
    layout: "principles",
    icon: "gavel",
    title:    { en: "Principles & Severity", zh: "原則與嚴重度" },
    subtitle: {
      en: "The philosophy that separates a useful audit from a checklist dump — plus how severity is actually decided.",
      zh: "把「有用的稽核」和「checklist 大雜燴」區分開來的哲學——以及嚴重度到底怎麼判。"
    },
    principles: [
      {
        icon: "target",
        title: { en: "Only report what you can exploit", zh: "只報你能利用的" },
        body: {
          en: "Every finding needs a concrete attack scenario. \"Send this request, get this result\" — never \"an attacker could theoretically…\".",
          zh: "每筆發現都要有具體攻擊情境。要的是「送出這個請求,得到這個結果」,而不是「攻擊者理論上可以……」。"
        }
      },
      {
        icon: "balance",
        title: { en: "Adversarial validation", zh: "對抗式驗證" },
        body: {
          en: "The agent that checks a finding is never the agent that found it. Hunters find; a separate validator tries to disprove.",
          zh: "驗證發現的代理,絕不是找到它的代理。獵人負責找;另一個驗證者負責試圖推翻。"
        }
      },
      {
        icon: "scale",
        title: { en: "Severity requires impact", zh: "嚴重度需要影響" },
        body: {
          en: "Severity = likelihood × impact, on both axes. If you can't describe the concrete damage, the severity is lower than you think.",
          zh: "嚴重度=可能性 × 影響,兩軸並看。若你說不出具體損害,那它的嚴重度比你想的低。"
        }
      },
      {
        icon: "shield",
        title: { en: "Defense-in-depth gaps aren't bugs", zh: "防禦縱深缺口不是漏洞" },
        body: {
          en: "If Layer A already prevents the attack, the absence of Layer B is a hardening suggestion — report it separately, don't inflate it.",
          zh: "若 Layer A 已擋住攻擊,缺少 Layer B 只是強化建議——另外列出即可,別灌嚴重度。"
        }
      },
      {
        icon: "tune",
        title: { en: "Determine the baseline dynamically", zh: "動態決定基準" },
        body: {
          en: "Identify comparable software and calibrate. Same pattern exploited elsewhere? Stronger finding. Never exploited in 20 years? Understand why first.",
          zh: "找出可比較的同類軟體並校準。同樣的模式在別處被打穿過?那是更強的發現。二十年來從沒被打穿?先搞懂為什麼。"
        }
      },
      {
        icon: "replay",
        title: { en: "Multiple runs improve coverage", zh: "多跑幾次提升覆蓋" },
        body: {
          en: "A single run finds roughly half. Re-running with prior findings in hand keeps surfacing new ground.",
          zh: "單次執行大約只找到一半。帶著先前的發現再跑,會持續挖出新的地盤。"
        }
      }
    ],
    severity: {
      heading: { en: "Severity rubric", zh: "嚴重度判準" },
      note: {
        en: "The HIGH-vs-MEDIUM line for business logic: does the finding defeat an explicit security boundary?",
        zh: "業務邏輯的 HIGH 與 MEDIUM 分界:這筆發現是否「擊潰了一個明確的安全邊界」?"
      },
      levels: [
        { level: "critical", label: { en: "CRITICAL", zh: "CRITICAL" }, body: {
          en: "Unauthenticated RCE, full database dump, admin account takeover without credentials.",
          zh: "未經認證的 RCE、整個資料庫被倒出、無需憑證即可接管管理員帳號。" } },
        { level: "high", label: { en: "HIGH", zh: "HIGH" }, body: {
          en: "Authenticated RCE, SQLi with exfiltration, stored XSS firing for all users, auth bypass, or an RBAC model completely defeated for a consequential action.",
          zh: "已認證的 RCE、可外洩資料的 SQLi、對所有使用者觸發的 stored XSS、認證繞過,或某個有實際後果的動作其 RBAC 權限模型被完全擊潰。" } },
        { level: "medium", label: { en: "MEDIUM", zh: "MEDIUM" }, body: {
          en: "Targeted XSS needing specific conditions, CSRF with meaningful state change, secrets disclosure, or business-logic bypass with real but limited consequences.",
          zh: "需特定條件的針對性 XSS、能造成實質狀態變更的 CSRF、機密外洩,或影響真實但有限的業務邏輯繞過。" } },
        { level: "low", label: { en: "LOW", zh: "LOW" }, body: {
          en: "Non-secret information disclosure, DoS requiring sustained effort, hardening gaps.",
          zh: "非機密資訊外洩、需要持續施力的 DoS、強化缺口。" } }
      ]
    },
    antipatterns: {
      heading: { en: "Anti-patterns to avoid", zh: "要避免的反模式" },
      note: {
        en: "The mistakes that make security audits useless.",
        zh: "讓資安稽核變得毫無用處的那些錯誤。"
      },
      items: [
        { title: { en: "OWASP as a bug list", zh: "把 OWASP 當 bug 清單" }, body: { en: "Listing everything that deviates from OWASP. It's a checklist, not a bug list; every real app makes tradeoffs.", zh: "把所有「偏離 OWASP」的東西都列為發現。OWASP 是 checklist,不是 bug 清單;真實應用都在做取捨。" } },
        { title: { en: "Inflated defense-in-depth", zh: "灌水防禦縱深" }, body: { en: "Rating a missing redundant check as HIGH/CRITICAL when the query builder already quotes identifiers.", zh: "在查詢建構器已對識別字加引號的情況下,把缺少的冗餘檢查評為 HIGH/CRITICAL。" } },
        { title: { en: "Ignoring the deployment model", zh: "忽略部署模型" }, body: { en: "Rate limiting at the CDN is valid architecture; not every app needs app-level rate limiting.", zh: "在 CDN 層做流量限制是合理架構;不是每個應用都需要應用層級的 rate limiting。" } },
        { title: { en: "Designed behavior as a bug", zh: "把設計行為當 bug" }, body: { en: "If the trust model says admins are fully trusted, admins doing admin things is not a finding.", zh: "若信任模型說管理員是完全受信任的,那管理員做管理員的事就不是發現。" } },
        { title: { en: "Padding with LOWs", zh: "用 LOW 灌篇幅" }, body: { en: "Ten LOWs don't make a useful report. Three real MEDIUMs do.", zh: "十個 LOW 撐不出一份有用的報告;三個真正的 MEDIUM 才行。" } },
        { title: { en: "\"Potential\" findings", zh: "「潛在」發現" }, body: { en: "Either you can exploit it or you can't. If you need \"potentially\", you haven't done enough research.", zh: "要嘛你能利用,要嘛不能。如果你需要用到「潛在地」,代表研究做得不夠。" } },
        { title: { en: "Ignoring what's done well", zh: "無視做得好的地方" }, body: { en: "Saying auth is solid builds trust in the findings you do report and helps prioritization.", zh: "說出「認證很穩」會強化你真正報出之發現的可信度,也幫助排序。" } },
        { title: { en: "Guessing parser/runtime behavior", zh: "臆測 parser/runtime 行為" }, body: { en: "The most convincing false positives reason \"the runtime will interpret this as…\" without verifying. Cite the spec or test it.", zh: "最有說服力的誤報都來自「runtime 會把它解讀成……」卻沒驗證。要引規格或實測。" } },
        { title: { en: "Skipping logic & creativity", zh: "略過邏輯與創意攻擊" }, body: { en: "Scanners check SQLi/XSS/SSRF. A manual audit's value is logic errors, state-machine violations, and chained attacks.", zh: "掃描器查的是 SQLi/XSS/SSRF;人工稽核的價值在邏輯錯誤、狀態機違規與串連攻擊。" } },
        { title: { en: "Giving up too easily", zh: "太早放棄" }, body: { en: "\"It uses parameterized queries\" is lazy. Check every sql.raw(), dynamic identifiers, search/FTS, and bypass paths. Push.", zh: "「它用了參數化查詢」是偷懶結論。檢查每個 sql.raw()、動態識別字、搜尋/FTS,以及繞道路徑。再逼一下。" } }
      ]
    }
  },

  /* =====================================================================
     4 · ATTACK CLASSES (searchable cards + dialog)
     ===================================================================== */
  {
    slug: "attacks",
    layout: "attacks",
    icon: "swords",
    title:    { en: "Attack Classes", zh: "攻擊類別" },
    subtitle: {
      en: "Phase 2 splits the hunt across these scopes. Not every class applies to every codebase — choose based on Recon. Tap a card for what each one chases.",
      zh: "第 2 階段把獵捕分配到這些視角。不是每個類別都適用每份程式碼——依偵察結果挑選。點卡片看每類在追什麼。"
    },
    categories: [
      { key: "standard", en: "Standard classes", zh: "標準類別" },
      { key: "logic",    en: "Where the real bugs hide", zh: "真正的 bug 藏在這" },
      { key: "open",     en: "Open-ended", zh: "開放式" }
    ],
    items: [
      {
        slug: "injection", category: "standard", icon: "syringe",
        title:   { en: "Injection", zh: "注入 Injection" },
        summary: { en: "Trace untrusted input from entry point to a dangerous sink.", zh: "把不受信任的輸入,從入口一路追到危險的 sink。" },
        tags: ["sql", "xss", "shell", "template", "log"],
        overview: {
          en: "What counts as a dangerous sink depends on the app: SQL/HTML/shell/templates/file paths for web apps; buffers and parsers for libraries; command construction for CLI tools. Don't just check direct paths — look for indirect (second-order) injection where data is stored safely then used dangerously later, and injection through field names, keys, headers and metadata, not just values.",
          zh: "什麼算危險 sink 取決於應用:web 應用是 SQL/HTML/shell/模板/檔案路徑;函式庫是緩衝區與 parser;CLI 是指令組裝。別只查直接路徑——找出間接(二階)注入:資料被安全儲存、稍後卻在危險情境被使用;以及透過欄位名稱、key、header、metadata 而非僅僅值的注入。"
        },
        checks: [
          { en: "Indirect / second-order injection (store safe, use dangerous later).", zh: "間接 / 二階注入(先安全儲存,稍後危險使用)。" },
          { en: "Injection into secondary systems: logs, caches, search indexes, analytics.", zh: "注入次級系統:log、cache、搜尋索引、分析。" }
        ]
      },
      {
        slug: "access-control", category: "standard", icon: "key",
        title:   { en: "Access control", zh: "存取控制" },
        summary: { en: "Can a caller do something they shouldn't? Check the right permission, on the right resource, via the right mechanism.", zh: "呼叫者能不能做不該做的事?檢查是否對「正確資源」用「正確機制」查了「正確權限」。" },
        tags: ["authz", "idor", "rbac", "bulk"],
        overview: {
          en: "Go beyond \"does a permission check exist\". Is there a weaker-checked path to the same state change? Can a request-body field override what the permission system intended? Are there endpoints that gate on authentication but forget authorization? Do bulk/batch/export/import operations enforce per-item permissions?",
          zh: "不要止於「有沒有權限檢查」。是否有「檢查較弱」的路徑能達成同樣的狀態變更?request body 的某個欄位能不能蓋掉權限系統的本意?是否有端點只擋了「認證」卻忘了「授權」?批量 / 匯出 / 匯入操作有沒有逐項檢查權限?"
        },
        checks: [
          { en: "Multiple access paths to one resource with inconsistent checks.", zh: "同一資源有多條存取路徑,檢查卻不一致。" },
          { en: "Authenticated-but-not-authorized endpoints.", zh: "已認證但未授權的端點。" }
        ]
      },
      {
        slug: "resource-file", category: "standard", icon: "folder_open",
        title:   { en: "Resource & file handling", zh: "資源與檔案處理" },
        summary: { en: "Path traversal, SSRF, unsafe deserialization, archive extraction, memory safety, and file-op races.", zh: "路徑穿越、SSRF、不安全反序列化、壓縮檔解開、記憶體安全,以及檔案操作競態。" },
        tags: ["ssrf", "traversal", "zip-slip", "toctou"],
        overview: {
          en: "Path traversal through symlinks, encoded sequences and null bytes. SSRF through redirects, DNS rebinding, and URL-parser differentials. Zip slip on archive extraction. Memory safety (buffer overflow, use-after-free, integer overflow) where applicable. TOCTOU races between checking a file and using it.",
          zh: "透過 symlink、編碼序列、null byte 的路徑穿越。透過轉址、DNS rebinding、URL parser 歧異的 SSRF。解壓縮的 zip slip。適用時的記憶體安全(緩衝區溢位、use-after-free、整數溢位)。檢查檔案與使用檔案之間的 TOCTOU 競態。"
        },
        checks: [
          { en: "URL validation that breaks after a redirect.", zh: "轉址後就失效的 URL 驗證。" },
          { en: "Archive entries that escape the target directory.", zh: "逸出目標資料夾的壓縮檔項目。" }
        ]
      },
      {
        slug: "crypto-secrets", category: "standard", icon: "lock",
        title:   { en: "Cryptography & secrets", zh: "加密與機密" },
        summary: { en: "Weak randomness, hardcoded secrets, broken KDF/HMAC, timing side-channels, primitive misuse.", zh: "弱亂數、寫死的機密、壞掉的 KDF/HMAC、時序側通道、原語誤用。" },
        tags: ["randomness", "secrets", "timing", "hmac"],
        overview: {
          en: "Weak randomness for tokens/keys/nonces. Secrets in logs, errors, URLs or client-visible responses. Missing HMAC verification, nonce reuse, ECB mode, static IVs. And the failure path: when a crypto operation fails, does the error path fall back to no-crypto?",
          zh: "用於 token/key/nonce 的弱亂數。出現在 log、錯誤訊息、URL 或前端可見回應的機密。缺少 HMAC 驗證、nonce 重用、ECB 模式、固定 IV。還有失敗路徑:當加密操作失敗時,錯誤路徑會不會退化成「不加密」?"
        },
        checks: [
          { en: "Secret comparison that isn't constant-time.", zh: "非定時(constant-time)的機密比較。" },
          { en: "Crypto failure falling back to plaintext.", zh: "加密失敗退回明文。" }
        ]
      },
      {
        slug: "business-logic", category: "logic", icon: "schema",
        title:   { en: "Business logic", zh: "業務邏輯" },
        summary: { en: "Where the real bugs hide — scanners can't find logic errors.", zh: "真正的 bug 藏身處——掃描器找不到邏輯錯誤。" },
        tags: ["state-machine", "race", "numeric", "time"],
        overview: {
          en: "State-machine violations: skip steps, go backwards, replay a completed flow; if step 2 of 3 fails, is step 1 rolled back? Race conditions with business impact (double-spend, double-approve). Numeric manipulation: negatives, zero, overflow, precision, string↔number coercion. Time-based logic at exact boundary moments. Security posture when config is missing or a flag is off.",
          zh: "狀態機違規:跳步、倒退、重播已完成的流程;若三步中的第二步失敗,第一步會回滾嗎?有業務影響的競態(雙重花費、雙重核准)。數值操弄:負值、零、溢位、精度、字串↔數字強制轉換。在「確切邊界時刻」的時間邏輯。當設定缺失或旗標關閉時的安全姿態。"
        },
        checks: [
          { en: "Check-then-act done non-atomically.", zh: "非原子化的 check-then-act。" },
          { en: "Partial-failure leaving half-modified state.", zh: "部分失敗留下半改的狀態。" }
        ]
      },
      {
        slug: "feature-abuse", category: "logic", icon: "extension",
        title:   { en: "Feature abuse & data leakage", zh: "功能濫用與資料外洩" },
        summary: { en: "Legitimate features used for unintended purposes — bugs in the design, not the code.", zh: "把正當功能用於非預期目的——bug 在設計裡,不在程式碼裡。" },
        tags: ["export", "import", "search-oracle", "webhook"],
        overview: {
          en: "Export/backup as exfiltration — can a low-privilege user export data above their level, or deleted/draft content? Import/restore as injection — can it create records that bypass validation? Search/filter/sort as an oracle — does it reveal whether content exists that you can't access? Enumeration through differing errors/timings. Preview/draft leakage. Notification/webhook URLs as SSRF.",
          zh: "匯出/備份成外洩管道——低權限使用者能否匯出超出其等級的資料,或已刪除/草稿內容?匯入/還原成注入——能否建立繞過驗證的紀錄?搜尋/篩選/排序成 oracle——會不會洩漏你無法直接存取的內容是否存在?透過錯誤/時序差異做列舉。預覽/草稿外洩。通知/webhook URL 成為 SSRF。"
        },
        checks: [
          { en: "Export includes other users' or pruned/deleted data.", zh: "匯出夾帶他人或本應刪除/清除的資料。" },
          { en: "Filter parameters probe hidden statuses or fields.", zh: "篩選參數能探測隱藏狀態或欄位。" }
        ]
      },
      {
        slug: "chained", category: "logic", icon: "link",
        title:   { en: "Chained attacks & trust boundaries", zh: "串連攻擊與信任邊界" },
        summary: { en: "Individually-safe behaviors that become dangerous in combination.", zh: "單獨安全的行為,組合起來卻變危險。" },
        tags: ["chain", "second-order", "escalation", "rollback"],
        overview: {
          en: "Multi-step chains: info disclosure + IDOR + missing rate limit = brute-force; open redirect + OAuth callback = token theft. Cross-component trust gaps where B trusts A's subtly-different validation. Second-order: a value safe in SQL becomes a key in a JSON path; a slug safe in a URL becomes part of a file path. Scope/capability escalation. Rollback/recovery abuse where undelete or restore bypasses current permissions.",
          zh: "多步串連:資訊揭露 + IDOR + 缺 rate limit = 暴力枚舉;open redirect + OAuth callback = 竊取 token。跨元件信任落差:B 信任了 A「細微不同」的驗證。二階:在 SQL 安全的值成了 JSON path 的 key;在 URL 安全的 slug 成了檔案路徑的一部分。範圍/能力提權。回滾/還原濫用:undelete 或還原繞過了當前權限。"
        },
        checks: [
          { en: "A validates 255 chars, B truncates at 128 → different string.", zh: "A 驗證 255 字、B 截到 128 字 → 變成不同字串。" },
          { en: "Restore brings back more than intended, bypassing today's rules.", zh: "還原帶回比預期更多的東西,繞過了今日規則。" }
        ]
      },
      {
        slug: "wildcard", category: "open", icon: "casino",
        title:   { en: "Wildcard", zh: "Wildcard 萬用" },
        summary: { en: "No category. You're given the codebase and told to break it.", zh: "沒有類別。給你整份程式碼,叫你打穿它。" },
        tags: ["curiosity", "weird-code", "git-history", "sabotage"],
        overview: {
          en: "Find the thing nobody thought to look for. Read the boring code. What's the strangest code, and what if it's abused? What features feel half-finished or bolted on (weakest review)? What API calls are possible but the frontend never makes? Anything interesting in git history — reverted security fixes, commented-out auth, committed-then-removed secrets? If a variable is named temp, hack, or legacy, read every line.",
          zh: "找出沒人想到要找的東西。讀那些無聊的程式碼。最奇怪的程式碼是什麼,被濫用會怎樣?哪些功能像半成品或硬接上去(審查最少)?哪些 API 呼叫可行、但前端從不發出?git 歷史裡有沒有可疑處——被回退的安全修補、被註解掉的認證、提交後又移除的機密?若變數叫 temp、hack 或 legacy,逐行讀它。"
        },
        checks: [
          { en: "Mix features never meant to combine: i18n + preview + caching.", zh: "混搭從不該共用的功能:i18n + 預覽 + 快取。" },
          { en: "Maximum damage with a valid account — sabotage, not escalation.", zh: "用一個合法帳號造成最大破壞——蓄意破壞,而非提權。" }
        ]
      },
      {
        slug: "obvious", category: "open", icon: "checklist",
        title:   { en: "Obvious things", zh: "顯而易見的事" },
        summary: { en: "The dumb stuff everyone assumes someone else already checked.", zh: "那些「大家都以為別人查過」的蠢東西。" },
        tags: ["secrets", "debug", "cors", "cookies", "redirect"],
        overview: {
          en: "Be thorough and literal, not creative. Hardcoded passwords/keys/tokens. Security TODO/FIXME/HACK comments. Debug mode reachable in production. Unprotected /debug, /admin, /metrics, /.env. Committed .env or *.pem files. CORS set to * with credentials. Cookies missing HttpOnly/Secure/SameSite. Open redirects. eval()/exec() with dynamic input. But trace the impact before reporting — a flag is not a finding.",
          zh: "要徹底、要照字面,不必創意。寫死的密碼/金鑰/token。提到安全的 TODO/FIXME/HACK 註解。production 可達的 debug 模式。未保護的 /debug、/admin、/metrics、/.env。被提交的 .env 或 *.pem。CORS 設成 * 又帶 credentials。缺 HttpOnly/Secure/SameSite 的 cookie。open redirect。帶動態輸入的 eval()/exec()。但回報前要追完整影響——一個旗標不等於一筆發現。"
        },
        checks: [
          { en: "A missing HttpOnly only matters if JS needn't read the cookie.", zh: "缺 HttpOnly 只有在「JS 本來就不需讀該 cookie」時才要緊。" },
          { en: "An error message field only matters if it's ever populated with secrets.", zh: "錯誤訊息的欄位只有在「真的會被填入機密」時才要緊。" }
        ]
      }
    ]
  },

  /* =====================================================================
     5 · HUNTING ANGLES + validation rules
     ===================================================================== */
  {
    slug: "hunting",
    layout: "hunting",
    icon: "travel_explore",
    title:    { en: "Hunting Angles", zh: "獵捕視角" },
    subtitle: {
      en: "Injected into every Phase 2 prompt. Think like an attacker, not a code reviewer — read the code at depth and try to break the defenses, not just confirm they exist.",
      zh: "注入每個第 2 階段 prompt。以攻擊者而非審稿者思考——深讀程式碼,設法打破防禦,而不只是確認它存在。"
    },
    intro: {
      en: "Bugs live in the gaps between layers. Follow the data from entry point through validation, transformation, storage, retrieval and output.",
      zh: "bug 住在各層之間的縫隙裡。跟著資料,從入口穿過驗證、轉換、儲存、取回到輸出。"
    },
    angles: [
      { n: "1",  title: { en: "Attack the sad path", zh: "攻擊失敗路徑" }, body: { en: "The happy path is defended. Error handlers, fallbacks, catch blocks, timeouts, retries, cleanup — are failures handled with the same rigor as success?", zh: "成功路徑都防好了。錯誤處理、後備分支、catch、逾時、重試、清理——失敗的嚴謹度有跟成功一樣嗎?" } },
      { n: "2",  title: { en: "What happens at boundaries?", zh: "邊界會怎樣?" }, body: { en: "Empty, maximum-length, null vs undefined vs missing, zero, negatives, unicode, first and last item, one over the max, exactly at the rate limit, the moment a token expires.", zh: "空值、最大長度、null vs undefined vs 缺漏、零、負數、unicode、第一項與最後一項、剛好超過上限、剛好卡在 rate limit、token 過期的那一刻。" } },
      { n: "3",  title: { en: "What do components assume?", zh: "元件彼此假設了什麼?" }, body: { en: "Does the DB layer assume the API validated? Does the renderer assume content was sanitized on write? Find where trust is implicit and test whether it's justified.", zh: "資料庫層是否假設 API 已驗證?renderer 是否假設內容在寫入時已淨化?找出隱含信任之處,測試它是否站得住腳。" } },
      { n: "4",  title: { en: "Operations in the wrong order", zh: "順序錯亂的操作" }, body: { en: "Call step 3 before step 1. Delete during create. Hit the confirmation endpoint without starting the flow. Replay a completed flow.", zh: "在第 1 步前呼叫第 3 步。建立時刪除。沒啟動流程就打確認端點。重播一個已完成的流程。" } },
      { n: "5",  title: { en: "Two things at once", zh: "兩件事同時發生" }, body: { en: "Two requests to the same resource. Modify while reading. Delete while iterating. Two users claiming the same unique resource.", zh: "對同一資源兩個請求。一邊讀一邊改。一邊迭代一邊刪。兩個使用者搶同一個唯一資源。" } },
      { n: "6",  title: { en: "Where parsers disagree", zh: "parser 互相打架處" }, body: { en: "Accepted by the schema but rejected by the DB. URL parsed differently by the router vs the app. Filename extension vs MIME type vs magic bytes.", zh: "schema 收、資料庫卻拒。router 與應用對 URL 解讀不同。副檔名 vs MIME type vs magic bytes。" } },
      { n: "7",  title: { en: "What survives a round trip?", zh: "什麼能撐過一次來回?" }, body: { en: "Store then retrieve — same value? Does encoding change, escaping double-up, a relative path resolve differently on read vs write, serialization lose type info?", zh: "存了再取——還是同一個值嗎?編碼會變嗎、跳脫會疊加嗎、相對路徑在讀寫時解析不同嗎、序列化會掉型別資訊嗎?" } },
      { n: "8",  title: { en: "What does config control?", zh: "設定控制了什麼?" }, body: { en: "What happens when config is missing or default? Can an env var override a security control? Does a feature flag disable validation? What's the posture during first-run setup?", zh: "設定缺失或為預設時會怎樣?環境變數能否蓋掉安全控制?feature flag 會不會關掉驗證?首次設定(first-run)期間的安全姿態如何?" } },
      { n: "9",  title: { en: "Follow the privilege", zh: "跟著權限走" }, body: { en: "For every state change, ask: who authorized this? Trace back to the permission check. Is it the right permission, on the right resource? Any parallel path that checks differently — or not at all?", zh: "對每個狀態變更問:誰授權的?往回追到權限檢查。是「正確資源」上的「正確權限」嗎?有沒有平行路徑檢查方式不同——或根本不檢查?" } },
      { n: "10", title: { en: "Look for leaked context", zh: "尋找洩漏的上下文" }, body: { en: "Error messages revealing internal paths. Stack traces in production. Timing that reveals whether a record exists. Response-size differences. Version-disclosing headers. Debug endpoints that survived.", zh: "洩漏內部路徑的錯誤訊息。production 的 stack trace。能看出紀錄是否存在的時序差異。回應大小差異。揭露版本的 header。倖存的 debug 端點。" } },
      { n: "11", title: { en: "Params overriding safe defaults", zh: "蓋掉安全預設的參數" }, body: { en: "Where a default is safe but a user-supplied parameter changes it. Find every input that overrides a security-relevant default and check the override is gated by the right permission.", zh: "預設安全、但使用者參數能改掉它的地方。找出每個能蓋掉「安全相關預設」的輸入,確認這個覆寫有用對的權限把關。" } },
      { n: "12", title: { en: "Unverified claims drive trust", zh: "未驗證主張驅動信任" }, body: { en: "Anywhere self-declared identity, capability, or metadata influences an access or trust decision without independent verification.", zh: "任何「自我宣稱的身分、能力或 metadata」在沒有獨立驗證下就影響了存取或信任決策的地方。" } }
    ],
    rules: {
      heading: { en: "Validation rules — before reporting ANY finding", zh: "驗證規則——回報「任何」發現之前" },
      items: [
        { en: "Construct a concrete attack: exact inputs, requests, or action sequence.", zh: "構造具體攻擊:確切的輸入、請求或動作序列。" },
        { en: "The attack must achieve meaningful impact — not \"learn field names\" or \"cause an error\".", zh: "攻擊要達成有意義的影響——不是「知道欄位名稱」或「造成一個錯誤」。" },
        { en: "Check if another layer already prevents exploitation. If so, it's a hardening note.", zh: "檢查是否已有另一層擋住利用。若有,那只是強化建議。" },
        { en: "If the baseline comparable has the same pattern, note whether it's been exploited there.", zh: "若對照基準有相同模式,記下它在那邊是否被利用過。" },
        { en: "If the exploit depends on parser/runtime behavior, verify against the spec — don't reason from intuition.", zh: "若利用依賴 parser/runtime 行為,要對照規格驗證——別憑直覺推論。" },
        { en: "Return ONLY confirmed findings, or an honest \"No exploitable vulnerabilities found\".", zh: "只回報已確認的發現,否則誠實地回「未發現可利用漏洞」。" }
      ]
    }
  },

  /* =====================================================================
     6 · STRUCTURED OUTPUT — findings.json schema + validator
     ===================================================================== */
  {
    slug: "schema",
    layout: "schema",
    icon: "data_object",
    title:    { en: "Structured Output", zh: "結構化輸出" },
    subtitle: {
      en: "Phase 5 turns each surviving finding into machine-readable JSON, conforming to report-schema.json and checked by a zero-dependency Node validator.",
      zh: "第 5 階段把每筆存活的發現轉成可被機器讀取的 JSON,符合 report-schema.json,並由零依賴的 Node 驗證器檢查。"
    },
    intro: {
      en: "The schema is a oneOf: a finding is either confirmed (full trace, execution and remediation) or rejected (investigated and found factually wrong). additionalProperties:false is enforced everywhere.",
      zh: "schema 是一個 oneOf:一筆發現要嘛是 confirmed(完整 trace、執行與修補),要嘛是 rejected(調查後發現事實有誤)。各處都強制 additionalProperties:false。"
    },
    confirmed: {
      heading: { en: "Confirmed finding — required fields", zh: "Confirmed 發現——必填欄位" },
      fields: [
        { name: "verdict",           type: "const \"confirmed\"", desc: { en: "Marks this as a validated vulnerability.", zh: "標記為已驗證的漏洞。" } },
        { name: "title",             type: "string", desc: { en: "Concise, standard vulnerability title.", zh: "簡潔、標準的漏洞標題。" } },
        { name: "description",       type: "string", desc: { en: "Full explanation incl. proof-of-concept and observed output.", zh: "完整說明,含 PoC 與觀察到的輸出。" } },
        { name: "root_cause",        type: "string", desc: { en: "One sentence: \"[function] in [file] does not [action], allowing [consequence]\".", zh: "一句話:「[函式] 在 [檔案] 沒有做 [動作],導致 [後果]」。" } },
        { name: "intended_behavior", type: "string", desc: { en: "What the developer was trying to build.", zh: "開發者原本想做的、非漏洞的邏輯。" } },
        { name: "trace",             type: "array (≥2)", desc: { en: "Sequential steps entrypoint → … → sink; each {kind,file,line,scope,description}. First must be entrypoint, last must be sink.", zh: "從 entrypoint → … → sink 的循序步驟;每步 {kind,file,line,scope,description}。第一步須為 entrypoint、最後一步須為 sink。" } },
        { name: "conditions",        type: "array", desc: { en: "Factual prerequisites (auth level, role, config, timing…). Empty if exploitable by default.", zh: "事實前提(認證等級、角色、設定、時序……)。預設即可利用則為空陣列。" } },
        { name: "execution",         type: "object", desc: { en: "{attacker_perspective, payloads[], instructions[], expected_result}.", zh: "{attacker_perspective, payloads[], instructions[], expected_result}。" } },
        { name: "remediation",       type: "object", desc: { en: "{strategy, code_changes[]} — the fix.", zh: "{strategy, code_changes[]}——修補。" } },
        { name: "severity",          type: "object", desc: { en: "{likelihood{score,reason}, impact{score,reason}, overall_severity}.", zh: "{likelihood{score,reason}, impact{score,reason}, overall_severity}。" } },
        { name: "confidence",        type: "object", desc: { en: "{score, reason} — note any missing files or ambiguous data flows.", zh: "{score, reason}——記下缺失檔案或模糊的資料流。" } }
      ]
    },
    rejected: {
      heading: { en: "Rejected finding", zh: "Rejected 發現" },
      fields: [
        { name: "verdict", type: "const \"rejected\"", desc: { en: "The described behavior is factually incorrect or the code path doesn't exist.", zh: "所述行為事實錯誤,或該程式碼路徑不存在。" } },
        { name: "reason",  type: "string", desc: { en: "Which specific claims are wrong, with code evidence.", zh: "哪些具體主張錯了,附程式碼證據。" } }
      ]
    },
    example: {
      heading: { en: "A confirmed finding (excerpt)", zh: "一筆 confirmed 發現(節錄)" },
      code:
`{
  "verdict": "confirmed",
  "title": "Stored XSS in comment rendering",
  "root_cause": "renderComment in views/comment.js does not escape body, allowing script injection",
  "trace": [
    { "kind": "entrypoint", "file": "routes/comment.js", "line": 42,
      "scope": "createComment", "description": "req.body.text stored unsanitized" },
    { "kind": "sink", "file": "views/comment.js", "line": 17,
      "scope": "renderComment", "description": "body interpolated into innerHTML" }
  ],
  "severity": {
    "likelihood": { "score": "high", "reason": "any authenticated user can post" },
    "impact":     { "score": "high", "reason": "fires for every viewer" },
    "overall_severity": "high"
  },
  "confidence": { "score": "high", "reason": "trace verified against source" }
}`
    },
    validator: {
      heading: { en: "validate-findings.cjs", zh: "validate-findings.cjs" },
      body: {
        en: "A zero-dependency Node validator. It reads report-schema.json directly and checks required fields, enum values, structural constraints, additionalProperties, and that the trace runs entrypoint → sink. It is a structural check only — it confirms the JSON conforms to the schema, not that the findings are correct. Factual verification is Phase 6's job.",
        zh: "一個零依賴的 Node 驗證器。它直接讀 report-schema.json,檢查必填欄位、enum 值、結構限制、additionalProperties,以及 trace 是否 entrypoint → sink。它只做結構檢查——確認 JSON 符合 schema,而非確認發現正確。事實查核是第 6 階段的工作。"
      },
      command: "node validate-findings.cjs findings.json"
    }
  },

  /* =====================================================================
     7 · PRACTICE — glossary + flashcards + quiz
     ===================================================================== */
  {
    slug: "practice",
    layout: "practice",
    icon: "school",
    title:    { en: "Practice", zh: "練習場" },
    subtitle: {
      en: "Test what you've learned. Switch between a searchable glossary, flip-cards, and a quick quiz.",
      zh: "驗收一下。在可搜尋的術語表、翻卡與隨堂測驗之間切換。"
    },
    tabs: {
      glossary:   { en: "Glossary",   zh: "術語表" },
      flashcards: { en: "Flashcards", zh: "字卡" },
      quiz:       { en: "Quiz",       zh: "測驗" }
    },
    glossary: [
      { term: { en: "RCE", zh: "RCE 遠端程式碼執行" }, def: { en: "Remote Code Execution — running attacker-chosen code on the target. Unauthenticated RCE is CRITICAL.", zh: "Remote Code Execution——在目標上執行攻擊者指定的程式碼。未經認證的 RCE 屬 CRITICAL。" } },
      { term: { en: "XSS", zh: "XSS 跨站腳本" }, def: { en: "Cross-Site Scripting — injecting script into pages others view. Stored XSS firing for all users is HIGH.", zh: "Cross-Site Scripting——把腳本注入別人會看到的頁面。對所有使用者觸發的 stored XSS 屬 HIGH。" } },
      { term: { en: "SQLi", zh: "SQLi 注入" }, def: { en: "SQL Injection — manipulating a database query via unescaped input. Check every sql.raw() and dynamic identifier.", zh: "SQL Injection——透過未跳脫輸入操弄資料庫查詢。檢查每個 sql.raw() 與動態識別字。" } },
      { term: { en: "SSRF", zh: "SSRF 伺服端請求偽造" }, def: { en: "Server-Side Request Forgery — making the server fetch an attacker-controlled URL. Watch redirects, DNS rebinding, webhooks.", zh: "Server-Side Request Forgery——讓伺服器去抓攻擊者控制的 URL。注意轉址、DNS rebinding、webhook。" } },
      { term: { en: "IDOR", zh: "IDOR 不安全直接物件參照" }, def: { en: "Insecure Direct Object Reference — accessing another user's object by changing an ID, with no authorization check.", zh: "Insecure Direct Object Reference——改個 ID 就存取到別人的物件,卻沒有授權檢查。" } },
      { term: { en: "CSRF", zh: "CSRF 跨站請求偽造" }, def: { en: "Cross-Site Request Forgery — tricking a logged-in user's browser into a state-changing request. MEDIUM when it has real effect.", zh: "Cross-Site Request Forgery——誘騙已登入使用者的瀏覽器送出會改變狀態的請求。有實質效果時屬 MEDIUM。" } },
      { term: { en: "TOCTOU / race", zh: "TOCTOU / 競態" }, def: { en: "Time-Of-Check to Time-Of-Use — a gap between checking and using lets state change in between. The classic check-then-act bug.", zh: "Time-Of-Check 到 Time-Of-Use——檢查與使用之間有縫隙,讓狀態在中間被改。經典的 check-then-act 漏洞。" } },
      { term: { en: "Path traversal", zh: "路徑穿越" }, def: { en: "Escaping the intended directory via ../, symlinks, encoded sequences or null bytes to read/write arbitrary files.", zh: "透過 ../、symlink、編碼序列或 null byte 逸出預期資料夾,讀寫任意檔案。" } },
      { term: { en: "Zip slip", zh: "Zip slip" }, def: { en: "Archive extraction writing entries outside the target directory because paths aren't constrained.", zh: "解壓縮時因路徑未受限,把項目寫到目標資料夾之外。" } },
      { term: { en: "Second-order", zh: "二階(攻擊)" }, def: { en: "Data safe when stored becomes dangerous when later used in a different context — a SQL-safe value used as a JSON-path key.", zh: "儲存時安全的資料,稍後在不同情境被使用時變危險——在 SQL 安全的值被當成 JSON path 的 key。" } },
      { term: { en: "Open redirect", zh: "開放轉址" }, def: { en: "A redirect parameter (redirect/return/next/url) sent somewhere unvalidated — a building block for token theft and phishing.", zh: "轉址參數(redirect/return/next/url)未經驗證就導向他處——竊取 token 與釣魚的積木。" } },
      { term: { en: "Defense-in-depth", zh: "防禦縱深" }, def: { en: "Layered controls. If Layer A already blocks the attack, the absence of Layer B is a hardening note, not a vulnerability.", zh: "分層控制。若 Layer A 已擋住攻擊,缺少 Layer B 是強化建議,不是漏洞。" } },
      { term: { en: "Trust boundary", zh: "信任邊界" }, def: { en: "Where untrusted input crosses into a trusted context. Bugs cluster where one component implicitly trusts another.", zh: "不受信任輸入跨入受信任情境之處。bug 聚集在「一個元件隱含信任另一個」的地方。" } },
      { term: { en: "Baseline comparable", zh: "對照基準" }, def: { en: "Comparable mainstream software used to calibrate findings. Exploited there → stronger finding; never exploited → understand why.", zh: "用來校準發現的同類主流軟體。在那被打穿過 → 更強的發現;從沒被打穿 → 先搞懂原因。" } },
      { term: { en: "Parser differential", zh: "parser 歧異" }, def: { en: "Two components parse the same input differently — the router and the app disagree on a URL, opening a bypass.", zh: "兩個元件對同一輸入解析不同——router 與應用對某 URL 認知不一致,開出一條繞道。" } },
      { term: { en: "False positive", zh: "誤報" }, def: { en: "A reported \"vulnerability\" that isn't real. Phase 3's whole job is to kill these adversarially.", zh: "被報出來、其實不存在的「漏洞」。第 3 階段的全部任務就是用對抗方式幹掉它們。" } }
    ],
    flashcards: [
      { front: { en: "Phase 1", zh: "第 1 階段" }, back: { en: "Recon — 3 parallel research agents map the app → architecture.md, injected into every hunt prompt.", zh: "偵察——3 個平行 research 代理描繪應用 → architecture.md,注入每個獵捕 prompt。" } },
      { front: { en: "Phase 3", zh: "第 3 階段" }, back: { en: "Validate — a separate agent tries to DISPROVE each finding. Finder ≠ validator.", zh: "驗證——由「不同的」代理試圖推翻每筆發現。找到的人 ≠ 驗證的人。" } },
      { front: { en: "Phase 6", zh: "第 6 階段" }, back: { en: "Independent verification — a fresh agent re-checks every claim against source. The final gate; never skip it.", zh: "獨立複查——全新代理對著原始碼複查每項主張。最後關卡;絕不略過。" } },
      { front: { en: "Severity formula", zh: "嚴重度公式" }, back: { en: "Likelihood × Impact — on both axes. No describable damage → lower than you think.", zh: "可能性 × 影響——兩軸並看。說不出具體損害 → 比你想的低。" } },
      { front: { en: "Defense-in-depth gap", zh: "防禦縱深缺口" }, back: { en: "If Layer A already prevents the attack, missing Layer B is a hardening note — not a finding.", zh: "若 Layer A 已防住,缺 Layer B 只是強化建議——不是發現。" } },
      { front: { en: "research vs general agent", zh: "research vs general 代理" }, back: { en: "research = focused exploration & verification. general = broad investigation that can spawn its own sub-agents.", zh: "research = 聚焦探索與驗證。general = 廣泛調查,且能自行再生子代理。" } },
      { front: { en: "Single-run coverage", zh: "單次執行覆蓋率" }, back: { en: "≈ 50%. One run finds about half the bugs found across multiple runs — so re-run.", zh: "約 50%。單次大約只找到多次執行所得的一半——所以要重跑。" } },
      { front: { en: "Wildcard agent", zh: "Wildcard 代理" }, back: { en: "No category — find the thing nobody thought to check. Read boring code; chase the weird stuff.", zh: "沒有類別——找出沒人想到要查的東西。讀無聊程式碼;追那些怪東西。" } },
      { front: { en: "trace requirement", zh: "trace 要求" }, back: { en: "≥ 2 steps, first = entrypoint, last = sink, each verified against real file:line.", zh: "至少 2 步,首 = entrypoint、末 = sink,每步對照真實 file:line 驗證。" } },
      { front: { en: "additionalProperties:false", zh: "additionalProperties:false" }, back: { en: "Enforced in the schema — any extra field makes findings.json invalid.", zh: "schema 強制——任何多餘欄位都會讓 findings.json 不合法。" } }
    ],
    quiz: [
      {
        q: { en: "What must every finding include before it's reported?", zh: "每筆發現在被回報前,必須包含什麼?" },
        options: [
          { en: "A concrete, exploitable attack scenario", zh: "一個具體、可利用的攻擊情境" },
          { en: "A matching OWASP Top 10 category", zh: "一個對應的 OWASP Top 10 類別" },
          { en: "A CVSS score above 7.0", zh: "高於 7.0 的 CVSS 分數" },
          { en: "Sign-off from the project owner", zh: "專案負責人的簽核" }
        ],
        answer: 0,
        explain: { en: "\"Send this request, get this result.\" Theoretical concerns aren't findings.", zh: "「送出這個請求,得到這個結果。」理論上的疑慮不算發現。" }
      },
      {
        q: { en: "Who validates a finding?", zh: "誰來驗證一筆發現?" },
        options: [
          { en: "The same agent that found it", zh: "找到它的同一個代理" },
          { en: "A separate agent, biased to disprove it", zh: "另一個傾向推翻它的代理" },
          { en: "The user, manually", zh: "使用者,手動地" },
          { en: "No one — hunters self-certify", zh: "沒有人——獵人自行認證" }
        ],
        answer: 1,
        explain: { en: "Adversarial validation: the checker is never the finder. A third fresh agent later re-verifies too.", zh: "對抗式驗證:驗證者絕非發現者。之後還有第三個全新代理再複查。" }
      },
      {
        q: { en: "Layer A already blocks the attack. What is the absence of Layer B?", zh: "Layer A 已擋住攻擊。那「缺少 Layer B」是什麼?" },
        options: [
          { en: "A CRITICAL vulnerability", zh: "一個 CRITICAL 漏洞" },
          { en: "A HIGH vulnerability", zh: "一個 HIGH 漏洞" },
          { en: "A hardening note, not a vulnerability", zh: "一個強化建議,不是漏洞" },
          { en: "An automatic false positive to ignore", zh: "可直接忽略的誤報" }
        ],
        answer: 2,
        explain: { en: "Defense-in-depth gaps are hardening suggestions — report separately, don't inflate severity.", zh: "防禦縱深缺口是強化建議——另外列出,別灌嚴重度。" }
      },
      {
        q: { en: "How is severity determined?", zh: "嚴重度怎麼決定?" },
        options: [
          { en: "By how far it deviates from a checklist", zh: "看它偏離 checklist 多遠" },
          { en: "Likelihood × impact", zh: "可能性 × 影響" },
          { en: "By the number of affected files", zh: "看受影響的檔案數量" },
          { en: "Alphabetically by attack class", zh: "依攻擊類別字母排序" }
        ],
        answer: 1,
        explain: { en: "Both axes. If you can't describe the concrete damage, the severity is lower than you think.", zh: "兩軸並看。若你說不出具體損害,嚴重度比你想的低。" }
      },
      {
        q: { en: "Roughly how many bugs does a single run find?", zh: "單次執行大約能找到多少漏洞?" },
        options: [
          { en: "Essentially all of them", zh: "幾乎全部" },
          { en: "About half", zh: "大約一半" },
          { en: "Only the CRITICAL ones", zh: "只有 CRITICAL 的" },
          { en: "It's non-deterministic and unmeasurable", zh: "不確定且無法量測" }
        ],
        answer: 1,
        explain: { en: "The best single run finds ~50%. Re-runs read prior findings.json to target the gaps.", zh: "最好的單次執行約 50%。重跑會讀先前的 findings.json,對準缺口。" }
      },
      {
        q: { en: "In a trace, the last step must be of kind…", zh: "在 trace 中,最後一步的 kind 必須是……" },
        options: [
          { en: "entrypoint", zh: "entrypoint" },
          { en: "propagation", zh: "propagation" },
          { en: "sink", zh: "sink" },
          { en: "remediation", zh: "remediation" }
        ],
        answer: 2,
        explain: { en: "The validator enforces first = entrypoint, last = sink, with ≥ 2 steps.", zh: "驗證器強制:首 = entrypoint、末 = sink,至少 2 步。" }
      },
      {
        q: { en: "Which is an audit anti-pattern?", zh: "下列何者是稽核反模式?" },
        options: [
          { en: "Noting what the codebase does well", zh: "點出程式碼做得好的地方" },
          { en: "Padding the report with ten LOW findings", zh: "用十個 LOW 發現灌篇幅" },
          { en: "Verifying exploits against the spec", zh: "對照規格驗證利用手法" },
          { en: "Splitting hunters by subsystem", zh: "依子系統拆分獵人" }
        ],
        answer: 1,
        explain: { en: "Ten LOWs don't make a useful report; three real MEDIUMs do.", zh: "十個 LOW 撐不出有用的報告;三個真正的 MEDIUM 才行。" }
      }
    ]
  }
];
