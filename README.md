# R0:hello agent

面向大模型应用的静态自学课程，覆盖概念、API 调用、本地部署、提示词工程、RAG、MCP、Agent，以及成本、安全、评估、微调与上线机制。单文件应用，可离线运行。
A static, self-contained self-study course on large language models, from concepts and API calls to local deployment, prompting, RAG, MCP, Agents, and the cost, safety, evaluation, fine-tuning and shipping mechanisms around them.

- **形式 Form**：单个 `index.html`（界面 + 逻辑）+ 14 个外部数据 / i18n / 深化脚本 + 1 个 Service Worker / a single `index.html` (UI + logic) + 14 external data / i18n / deepening scripts + 1 Service Worker
- **运行 Runtime**：无后端、无构建步骤、无第三方依赖；直接打开 `index.html` 即可 / no backend, no build step, no third-party dependencies; open `index.html` directly
- **统计口径 Data basis**：下列数字为 2026-11-21 加载全部脚本后的运行时实测，深化层已并入章节、课节、测评、实战与 i18n 表。只统计基础数据文件会得到旧的 14 / 77 / 117 / 14。
  Counts measured at runtime on 2026-11-21 after loading all scripts. Deepening layers are merged into chapters, lessons, quizzes, labs and i18n tables. Counting only base data files gives the older 14 / 77 / 117 / 14 figures.

课程文案、界面与代码由 AI 辅助生成与组装。模型名称、参数、价格与 API 形态随厂商发布变化，请以厂商最新文档为准。
Curriculum text, UI and code are generated and assembled with AI assistance. Model names, parameters, prices and API shapes change with vendor releases; check current vendor documentation.

---

## 内容规模（运行时实测） Content scale (measured at runtime)

| 指标 Metric | 数值 Value |
| --- | ---: |
| 章节 / 课节 Chapters / lessons | **14 / 82** |
| 课节深度 Lesson depth | 每节 6–7 点（71 节 6 点、11 节 7 点，共 503 点 / 6–7 points each: 71 with 6, 11 with 7; 503 points total） |
| 测评题 Quiz questions | **122**（选择 64 · 判断 36 · 填空 22 / choice 64 · true-false 36 · fill-in 22） |
| 测评长度 Quiz length | 全站 12 题；每章另有 4 题测评 / 12 site-wide; each chapter has its own 4-question quiz |
| 编程实战 Hands-on labs | **18 张卡 / 16 个唯一 id**（`lab13`、`lab14` 各出现两次，见已知限制 / 18 cards / 16 unique ids; `lab13` and `lab14` each appear twice — see Known limitations） |
| 名词库 Term library | 71 条记录 / 68 个唯一词条，可检索，默认折叠至 9 条 / 71 records / 68 unique terms, searchable, 9-item collapsed default |
| 概念图 Concept map | 29 节点 / 41 关系，可交互（总览 ↔ 聚焦）/ 29 nodes / 41 relations, interactive (overview ↔ focus) |
| 端到端流程 End-to-end workflow | 8 步 + 1 个完整示例 / 8 steps + one complete example |
| 首页主题 Homepage themes | 16（1 默认 + 15 星币解锁 / 1 default + 15 coin-unlocked） |
| 成就 Achievements | 18 |

渲染出的章节顺序 Chapter order as rendered：

| id | 章节 Chapter | 课节 Lessons | 测评 Quiz |
| --- | --- | ---: | ---: |
| c1 | 什么是大模型 What is an LLM | 5 | 6 |
| c2 | 通过 API 使用大模型 Using LLMs through APIs | 5 | 6 |
| c3 | 本地部署 Local deployment | 6 | 6 |
| c4 | 提示词工程 Prompt engineering | 6 | 9 |
| c5 | 检索增强生成（RAG）Retrieval-augmented generation (RAG) | 6 | 11 |
| c6 | MCP 协议 MCP protocol | 8 | 9 |
| c7 | 智能体 Agents | 6 | 9 |
| c14 | 扩展机制：Skills / 插件 / hooks / 命令 Extension mechanisms: Skills / plugins / hooks / commands | 6 | 9 |
| c8 | 环境与工具 Environment and tooling | 5 | 9 |
| c9 | 成本、延迟与模型选择 Cost, latency and model selection | 6 | 10 |
| c10 | 安全、隐私与护栏 Safety, privacy and guardrails | 5 | 9 |
| c11 | 输出质量与评估 Output quality and evaluation | 5 | 9 |
| c12 | 微调、蒸馏与多模态 Fine-tuning, distillation and multimodality | 5 | 9 |
| c13 | 上线：把原型变成日常工具 Shipping: turning a prototype into a daily tool | 8 | 11 |

`c14` 由深化层注册，经 `stageOrder` 插入 `c7` 之后；其 id 未变，因此进度保留。整体顺序为 c1–c3 基础、c4–c7 使用，再由 c14 与 c8–c13 承担上线与扩展。
`c14` is registered by a deepening layer and inserted after `c7` via `stageOrder`; its id is unchanged, so progress is preserved. The sequence is c1–c3 foundations, c4–c7 usage, then c14 and c8–c13 for shipping and extension.

## 功能 Features

- **交互式概念图 Interactive concept map**：29 个概念 / 41 条关系；点击标签或节点可聚焦其自身与关系。/ 29 concepts / 41 relations; clicking a chip or node focuses it and its relations.
- **名词库 Term library**：71 条记录（68 个唯一词条）按类分组，可检索，默认折叠至 9 条。/ 71 records (68 unique terms) grouped by category, searchable, collapsed to 9 items by default.
- **每日任务环 Daily task dial**：两个 SVG 环——外环为今日新学配额，内环为复习进度。/ Two SVG rings — outer for today's new-lesson quota, inner for review progress.
- **断点续学 Resume**：打开课节写入 `data.last {lesson, stage, ts}`，常驻条可回到断点。/ Opening a lesson writes `data.last {lesson, stage, ts}`; a persistent bar returns to the breakpoint.
- **章节测评 Chapter quizzes**：每张章节卡有测评按钮，最高分显示在卡片徽标上。/ A quiz button on each chapter card; the best score is shown on the card badge.
- **分组实战 Grouped labs**：18 张实战卡按章节折叠，展开状态存于 `data.labOpen`。/ 18 lab cards folded by chapter; open state is stored in `data.labOpen`.

## 架构 Architecture

脚本按固定顺序注入。
Scripts are injected in a fixed order:

```
① agent-extra-data.js      base curriculum c1~c7 + labs / terms / workflow
② lang-en.js               title-level EN tables derived from *_en fields
③ ped-ext.js               "extension" tags for out-of-scope terms
④ lang-en-content.js       body-level EN side tables (summary / code / pit / ex)
⑤ agent-extra-data2.js     pack 2: c8~c14 + new labs / terms + concept-map topology
⑥ agent-deepen-a.js…i.js   9 deepening layers: lesson points, quizzes, labs, terms, map, workflow
        ↓  merged at startup
in-memory: CUR / LABS / TERMS / WF + four EN tables
        ↓  read-only
applyLang() → renderAll() → renderDash / renderChapters / renderTerms / renderLabs / renderSidebar …
```

章节与概念图容器通过 `innerHTML` 重建；可被脚本寻址的 `id` 放在内层容器。交互使用全局 `data-act` 事件委托。
Stage and concept-map containers are rebuilt with `innerHTML`; script-addressable `id`s sit on inner containers. Interactions use global `data-act` event delegation.

数据模型 Data model：

```js
stage = {
  id, icon, name, name_en, desc, desc_en,
  lessons: [{ id, title, title_en, summary[], code, pit, ex:{q,a} }],
  quiz: [{ q, o:[…], a, why, whyEn?, type }]
}
lab  = { id, t, t_en, req[], starter, hint, xp, stage }
term = { term, term_en, short, short_en, detail[], vs, vs_en, cat? }
cmap = { nodes:[{ id, tier }], edges:[{ a, b, zh, en }] }
```

填空答案存于 `a`（与选择题共用），而非 `ans`。判分与错题本读 `q.ans != null ? q.ans : q.a`；混用会导致「填空恒错 / 错题 undefined」的静默故障。
Fill-in answers are stored in `a` (shared with choice questions), not `ans`. Scoring and the mistake log read `q.ans != null ? q.ans : q.a`; mixing the two causes silent "always wrong fill-in / undefined mistake" failures.

新章节与题目以叠加层注入。
New chapters and questions are injected as overlays:

```js
window.AGENT_CURRICULUM = (window.AGENT_CURRICULUM || []).concat(NEW_STAGES);
window.AGENT_LABS       = (window.AGENT_LABS       || []).concat(NEW_LABS);
window.AGENT_TERMS      = (window.AGENT_TERMS      || []).concat(NEW_TERMS);
```

进度按 `lesson.id`、实战按 `lab.id` 存档，因此 id 必须唯一。`innerHTML` 重建会清除 `open` 等状态类，交互代码需在渲染后恢复。
Progress is keyed by `lesson.id` and lab progress by `lab.id`, so ids must be unique. `innerHTML` rebuilds clear state classes such as `open`, so interaction code must restore them after render.

题型为 `choice` / `judge` / `fill`。`buildQuiz(scope)` 先保证每种出现的题型至少一题，再随机补足；`scope = "all"` 抽 12 题，`scope = <章节 id>` 从该章完整题库抽 4 题。最高分存于 `quizBest["best"]` 与 `quizBest["stage:<id>"]`；错题写入 `data.mistakes`（去重，仅保留最近一次）。
Quiz types: `choice` / `judge` / `fill`. `buildQuiz(scope)` guarantees at least one question per present type, then fills randomly. `scope = "all"` draws 12; `scope = <chapter id>` draws 4 from that chapter's full bank. Best scores live at `quizBest["best"]` and `quizBest["stage:<id>"]`; wrong answers are written to `data.mistakes` (deduplicated, latest only).

国际化：`t(zh)` 以中文串为键查 `I18N_EN`，缺失则返回原文。数据文件中的 `*_en` 字段是唯一真源，`lang-en.js` 只派生 id 索引表。运行时覆盖：章节名 14/14、课节标题 82/82、课节正文（summary/code/pit/ex）82/82、测评题 122/122、唯一实战英文 16/16、唯一名词 68/68、流程步骤 8/8。模块级导航常量存中文键，渲染时调用 `t()`。
Internationalization: `t(zh)` uses the Chinese string as key and looks up `I18N_EN`, returning the original if absent. The `*_en` fields in the data files are the single source of truth; `lang-en.js` only derives id-indexed maps. Runtime coverage: 14/14 chapter names, 82/82 lesson titles, 82/82 lesson bodies (summary/code/pit/ex), 122/122 quiz questions, 16/16 unique lab EN records, 68/68 unique terms, 8/8 workflow steps. Module-level navigation constants store Chinese keys and call `t()` at render time.

侧栏：≥980px 时常驻 264px（`body{padding-left:284px}`），窄屏为抽屉；`body.sbCollapsed` 折叠；右缘 `.sb-resizer` 调宽并存于 `data.flags.sbWidth`。进度存于 `localStorage`。代码块版权以 `<span class="cr-attr">`（`display:none`）注入——页面上不可见，但随复制携带。
Sidebar: persistent 264px on ≥980px (`body{padding-left:284px}`), drawer below; `body.sbCollapsed` collapses it; the right edge `.sb-resizer` adjusts width and stores it in `data.flags.sbWidth`. Progress is stored in `localStorage`. Code-block copyright is injected as `<span class="cr-attr">` (`display:none`) — invisible on the page but carried on copy-paste.

开发注意（静默故障场景） Development notes (silent-failure cases)：

1. 每个 `data-act` 都必须在全局事件委托中有分支。/ Every `data-act` must have a branch in the global event delegation.
2. 填空答案从 `a` 读取。/ Fill-in answers are read from `a`.
3. 不要在 `localStorage` 中存函数；`JSON.stringify` 会静默丢弃。/ Do not store functions in `localStorage`; `JSON.stringify` drops them silently.
4. 不要把底部操作条放进渲染循环。/ Do not put bottom action bars inside a render loop.
5. `innerHTML` 重建会清除 `open` 状态；渲染后需恢复。/ `innerHTML` rebuilds clear `open` state; restore it after rendering.
6. 修改被缓存文件后，需同时 bump 页面 `?v=` 与 SW `CACHE`。/ After changing a cached file, bump both the page `?v=` and the SW `CACHE`.

## 运行与部署 Run and deploy

```bash
# 直接打开 / Open directly
index.html

# 或用 http(s) 提供服务以启用 Service Worker / Or serve over http(s) to enable the Service Worker
python -m http.server 8080
```

在 GitHub Pages 上，将本目录作为仓库根推送，从 `main` 的 `/ (root)` 部署。
For GitHub Pages, push this directory as the repository root and deploy from `main`, `/ (root)`.

`agent-sw.js` 为 Service Worker（当前 `CACHE = r0-hello-agent-v50`）。其 `ASSETS` 必须与页面 `<script src>` 的 URL 逐字符一致（含 `?v=N`）；修改被缓存文件后需同时 bump `?v=` 与 `CACHE`。
`agent-sw.js` is the Service Worker (current `CACHE = r0-hello-agent-v50`). Its `ASSETS` must match the page's `<script src>` URLs character for character (including `?v=N`); bump both the `?v=` and `CACHE` after changing a cached file.

GitHub 仓库元数据 GitHub repository metadata：

| 字段 Field | 值 Value |
| --- | --- |
| About | `R0:hello agent · 从零开始的大模型` |
| Description（中文） | 14 章 82 节的大模型自学课程，覆盖 LLM 概念、API 调用、本地部署、提示词工程、RAG、MCP、Agent，以及成本 / 安全 / 评估 / 微调 / 上线与扩展机制。纯静态单文件应用，零依赖、可离线，含交互式概念图、名词库与章节测评。 |
| Description (en) | A 14-chapter, 82-lesson self-study course for LLMs — concepts, API calls, local deployment, prompting, RAG, MCP and Agents, plus cost, safety, evaluation, fine-tuning, shipping and extension. Static, dependency-free, offline-capable, with an interactive concept map, searchable terms and per-chapter quizzes. |
| Website | `https://huangdouplone.github.io/R0-hello-agent/` |

## 已知限制 Known limitations

1. `lab13` 与 `lab14` 各出现两次（temperature / embedding 相似度；输出打分 / 自动摘要流水线）：渲染 18 张卡但唯一 id 仅 16 个。实战进度按 id 存档，重复卡共享完成状态，英文侧表每个 id 只保留一条。修复需分配唯一 id（如 `lab13b` / `lab14b`）并兼容旧进度。
   `lab13` and `lab14` each appear twice (temperature / embedding similarity; output scoring / auto-summary pipeline): 18 cards render but there are 16 unique ids. Lab progress is keyed by id, so duplicate cards share completion state, and the EN side table keeps one entry per id. Fix by assigning unique ids (e.g. `lab13b` / `lab14b`) with old-progress compatibility.
2. 71 条名词记录映射到 68 个唯一词条；重名词条共享检索与英文映射。/ 71 term records map to 68 unique terms; duplicate names share search and EN mapping.
3. 测评中切换语言不会重绘已抽出的题目；需重新开始测评。/ Switching language during a quiz does not re-render the already-drawn questions; restart the quiz.
4. Service Worker 在 `file://` 下被拒绝；离线缓存需 http(s)。/ The Service Worker is rejected under `file://`; http(s) is required for offline caching.
5. 模型名称、价格与命令均为示例，请查厂商文档。/ Model names, prices and commands are examples — check vendor documentation.

## 系列 Series

属于 R0:hello EDU 系列。门户 / Part of the R0:hello EDU series. Portal: <https://huangdouplone.github.io/R0-hello/>

- [R0:hello world](https://huangdouplone.github.io/R0-hello-world/)
- [R0:hello agi](https://huangdouplone.github.io/R0-hello-agi/)
- [R0:hello office](https://huangdouplone.github.io/R0-hello-office/)

## 文件 Files

| 文件 File | 作用 Role |
| --- | --- |
| `index.html` | 单文件应用：界面、样式、状态与逻辑 / Single-file app: UI, styles, state and logic |
| `agent-extra-data.js` | 基础课程 c1~c7 + 实战 / 名词 / 流程 / Base curriculum c1~c7 + labs / terms / workflow |
| `lang-en.js` | 由 `*_en` 派生的标题级英文表 / Title-level EN tables derived from `*_en` |
| `ped-ext.js` | 超范围名词的「拓展」标记 / "Extension" tags for out-of-scope terms |
| `lang-en-content.js` | 正文级英文覆盖 / Body-level English coverage |
| `agent-extra-data2.js` | 第二包：c8~c14、新实战 / 名词、概念图拓扑 / Pack 2: chapters c8~c14, new labs / terms, concept-map topology |
| `agent-deepen-a.js` … `agent-deepen-i.js` | 9 个深化层 / 9 deepening layers |
| `agent-sw.js` | Service Worker（离线缓存 / offline cache） |
| `diagnose.html` / `404.html` | 诊断页与自定义 404 / Diagnostic page and custom 404 |
| `README.md` / `LICENSE.md` | 本文档 / MIT 许可 / This document / MIT license |

## 许可 License

MIT，见 `LICENSE.md`。作者：B 站 黄豆666（huangdouplone）。按「原样」提供，仅供学习，不作任何担保。
MIT. See `LICENSE.md`. Creator: Bilibili 黄豆666 (huangdouplone). Provided as-is for study, without warranty.

Topics：`llm` · `large-language-models` · `ai-agents` · `prompt-engineering` · `rag` · `mcp` · `function-calling` · `local-llm` · `ollama` · `fine-tuning` · `lora` · `llm-evaluation` · `ai-safety` · `agent-skills` · `self-study` · `learning-roadmap` · `static-site` · `pwa` · `no-build`
