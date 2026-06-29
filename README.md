# Security Audit Skill — 互動拆解

> 把 coding agent 變成資安稽核員的開源 skill,用六階段、對抗式的方式只找「真的能被利用」的漏洞——這是它的互動式拆解。

本網站把 [`cloudflare/security-audit-skill`](https://github.com/cloudflare/security-audit-skill) 的內容與概念整理成一個可瀏覽、可搜尋、可互動的多頁網站:六階段管線、九類攻擊代理視角、十二個獵捕視角、嚴重度判準、反模式,以及 `findings.json` 結構化輸出。背景脈絡與正式系統數據引自 Cloudflare 工程部落格〈[Build your own vulnerability harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness)〉。

---

## 🔗 線上版 / Live

| | |
|---|---|
| 🌐 網站 | <https://cloudflare-security-skill.peteraim.com/> |

> 直接點進去就能用,無需安裝。「攻擊類別」頁可用 `https://cloudflare-security-skill.peteraim.com/attacks.html#injection` 之類的深連結直達特定類別。

---

## ✨ 功能特色

- 🌏 **雙語全頁切換** — 中文 / English 一鍵切換,整站重繪、跨頁持久
- 🌗 **深色 / 淺色模式** — 預設深色「資安主控台」風,可手動切換並記住
- 🧭 **多頁面 + 跨頁導航** — 七個主題各有獨立 URL,對 SEO 與分享友善
- 🔍 **即時搜尋 + 分類篩選** — 在「攻擊類別」依關鍵字與類別群組過濾
- 🔗 **深連結 + Modal 詳情** — 每個攻擊類別都有專屬 `#<slug>`,點開看完整說明
- 🎴 **互動練習場** — 可搜尋術語表、八大類別 / 六階段翻卡、即時計分隨堂測驗
- 📱 **響應式設計** — 手機、平板、桌機皆適配(含 375px)
- ⚡ **純靜態零依賴** — 無後端、載入快、可離線瀏覽

---

## 📂 內容結構 / 資料來源

本站內容整理自 **`cloudflare/security-audit-skill`(MIT)**,正式系統數據引自 Cloudflare 工程部落格。

```
cloudflare-security-skill/
├── index.html          # 總覽(hub):緣起、關鍵數字、從 skill 到機隊
├── pipeline.html       # 六階段管線
├── principles.html     # 設計原則 · 嚴重度判準 · 反模式
├── attacks.html        # 九類攻擊代理視角(可搜尋 / 篩選 / Modal)
├── hunting.html        # 十二個獵捕視角 + 驗證規則
├── schema.html         # findings.json schema + 範例 + 驗證器
├── practice.html       # 練習場:術語表 / 字卡 / 測驗
├── assets/             # styles.css · shell.js(共用 chrome)· app.js(版型引擎)
├── data/data.js        # 全站唯一資料層(雙語 {en,zh})
├── CNAME · .nojekyll   # 自訂網域 + GitHub Pages 設定
└── README.md
```

> ⚠️ **非官方**:本網站為個人整理之非官方教學資源,與 Cloudflare 無隸屬關係。內容如有錯誤或出入,請以官方來源為準:
> - Skill 原始碼:<https://github.com/cloudflare/security-audit-skill>
> - 背景部落格:<https://blog.cloudflare.com/build-your-own-vulnerability-harness>

---

## 🛠 本機使用

```bash
# 1. clone 專案
git clone git@github.com:tingwei161803/cloudflare-security-skill.git
cd cloudflare-security-skill

# 2a. 最簡單:直接開啟入口頁
open index.html

# 2b. 或啟動本機伺服器(建議,跨頁導航 / 深連結才完全正常)
uv run python -m http.server 4173
# 然後瀏覽 http://localhost:4173
```

> 本專案為純靜態網站,不需安裝任何依賴。若要跑本機伺服器,一律使用 `uv`。

---

## 📊 隱私 / 分析

本網站使用 Google Analytics 4(GA4 property:**Cloudflare Security Audit Skill**)蒐集匿名的流量數據(如頁面瀏覽),用於了解使用情況。不蒐集任何個人身分資訊。

---

## 📝 聲明 / License

- 本站為非官方整理,所述方法與概念之著作權歸原始來源 `cloudflare/security-audit-skill` 所有。
- 本網站程式碼以 **MIT** 授權釋出。
- 如為權利人且希望調整或移除內容,請開 issue 聯絡。
