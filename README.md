# R0:hello agent

**R0：从零开始的大模型**

> © **制作者 / Creator: Bilibili 黄豆666 (huangdouplone)** · 版权所有 / All rights reserved.
>
> 内容与代码由 **AI 辅助生成 / 组装**；模型名、参数、价格、API 形态随厂商迭代而变化，请以厂商官方文档为准。

从零上手 → 会用 → 部署与落地：一条覆盖 **大模型概念、API 调用、本地部署、提示词工程、RAG、MCP、Agent，以及成本 / 安全 / 评估 / 微调 / 上线** 的纯静态自学课程。单文件 HTML 应用 + 外部数据脚本，无后端、无构建步骤、无第三方运行时依赖，可直接托管到任意静态托管服务。

*A self-study course for large language models — from concepts and API calls to local deployment, prompting, RAG, MCP and Agents, plus cost, safety, evaluation, fine-tuning and shipping. A purely static, dependency-free, offline-capable single-page app. No backend, no build step, no third-party runtime.*

---

## 中文

### 1. 项目边界

| 维度 | 说明 |
| --- | --- |
| 形态 | 单文件 `index.html`（UI + 全部逻辑）+ 4 个外部数据 / 英文脚本 + 1 个 Service Worker |
| 运行 | 双击 `index.html` 即可运行；通过 http(s) 托管时自动启用离线缓存（PWA） |
| 存储 | 全部学习数据存于浏览器 `localStorage`，无服务端、无账号体系 |
| 依赖 | 零外部依赖。不引用任何 CDN、字体、图表库或前端框架，概念图为手写内联 DOM |
| 适配 | PC / 移动端响应式；桌面常驻侧边栏（≥980px），窄屏转为抽屉 + 汉堡按钮 |
| 定位 | 不做「模型原理」的学术推导，目标是**让使用者能熟练、明确地把大模型用起来** |

### 2. 内容规模（实测）

| 指标 | 数值 |
| --- | --- |
| 章节 / 课节 | **14 / 77** |
| 课节深度 | 每节 **6~7 要点**（77/77 节全部深化达标；中英正文双语同步） |
| 阶段测评题 | **117**（choice 66 · judge 26 · fill 25） |
| 抽题数 | 全站 12 题；**每章另有独立测评**（从该章题库抽 4 题、选项乱序，记录最高分） |
| 动手实战 | **14** |
| 名词库 | **57 条**（分 5 类），支持搜索 + 默认 9 条折叠 |
| 概念地图 | **28 节点 / 40 关系**，可交互（总图 ↔ 单点聚焦）；MCP 生态单独成环（Server / Tools / Resources / Prompts / Client） |
| 端到端工作流 | **8 步** + 一条完整示例 |
| 主页配色风格 | **16 套**（1 套默认 + 15 套星币解锁） |
| 成就徽章 | **18**（含分模块「大师」系列 / 测评达人等） |

章节编排：

| 章 | 名称 | 课节 | 题 |
| --- | --- | ---: | ---: |
| c1 | 🧠 大模型是什么 | 5 | 4 |
| c2 | 🔑 通过 API 使用大模型 | 5 | 4 |
| c3 | 🖥️ 本地部署大模型 | 6 | 4 |
| c4 | 🗣️ 提示词工程 | 6 | 4 |
| c5 | 📚 检索增强 RAG | 4 | 4 |
| c6 | 🔌 MCP 协议 | **8** | **5** |
| c7 | 🤖 Agent 智能体 | 6 | 4 |
| c8 | 🧰 环境与工具准备 | 5 | 4 |
| c9 | 💰 成本、延迟与模型选型 | 5 | 4 |
| c10 | 🛡️ 安全、隐私与护栏 | 5 | 4 |
| c11 | 📐 输出质量与评估 | 5 | 4 |
| c12 | 🎛️ 微调、蒸馏与多模态 | 5 | 4 |
| c13 | 🚀 上线：把原型变成日常工具 | 6 | 4 |
| c14 | 🧩 扩展机制：Skill / 插件 / 钩子 / 命令 | 6 | 4 |

课程节奏分三段：**c1–c3 打地基**（是什么 / 怎么调 / 怎么本地跑）→ **c4–c7 会用**（提示词 / RAG / MCP / Agent）→ **c8–c14 落地**（环境 / 成本 / 安全 / 评估 / 进阶 / 上线 / 扩展机制）。

#### 交互模块（v2 新增）

| 模块 | 说明 |
| --- | --- |
| 交互式概念地图 | SVG 绘制 28 个概念 / 40 条关系；默认「总图」，点 chip 或节点即聚焦该点及其关系（其余淡出、边带标签） |
| 名词库 | 42 条按 5 类归组；默认只渲染 9 条（3 排）可一键展开；顶部搜索框实时过滤（命中即忽略折叠与分类） |
| 今日任务双层圆盘 | 外环 = 今日新学配额、内环 = 复习进度（SVG `stroke-dashoffset`）；右侧列表按「新学 / 复习」分标签，可直接跳转课节或标记已复习 |
| 断点续学 | 打开课节即写入 `data.last {lesson,stage,ts}`；头部下方常驻续学条，一键回到断点（已学完则自动跳到下一未完成课节） |
| 章节测评 | 每章卡片内「章节测评」按钮，用该章题库出题（choice/judge/fill），最高分 `data.quizBest["stage:<id>"]` 显示在章卡徽章上 |

### 3. 技术架构

#### 3.1 加载顺序与脚本职责

`index.html` 依赖 6 个外部脚本按固定顺序注入，数据层与逻辑层严格分离：

```
① agent-extra-data.js      中文课程数据（c1~c7）+ 实战 + 名词 + 工作流
② lang-en.js               由 *_en 字段派生标题级英文表（STAGE_EN / LESSON_EN / LAB_EN / TERM_EN）
③ lang-en-content.js       正文级英文覆盖（c1~c7 的 summary/code/pit/ex、题目、实战、名词明细）
④ agent-extra-data2.js     扩展包 2：追加 c8~c14 + 新实战 / 名词 + 概念图拓扑，重建标题级英文表、合并正文级英文表
⑤ 内联脚本                 状态、渲染、事件、启动
⑥ agent-sw.js              Service Worker 离线缓存
        ↓  启动期合并
内存态：CUR(章节) / LABS / TERMS / WF + 四张 *_EN 英文表
        ↓  单向读取
渲染层：applyLang() → renderAll() → renderDash / renderChapters / renderTerms / renderLabs / renderSidebar …
```

关键约定：**章节与概念图容器由 JS 用 `innerHTML` 重建**，因此需要被脚本寻址的 `id` 一律挂在内层容器上，`<h2>` 等外壳留在静态 HTML 中；交互按钮统一走 `data-act` 全局事件委派。

#### 3.2 数据模型

```js
stage = {
  id, icon, name, name_en, desc, desc_en,
  lessons: [{ id, title, title_en, summary[], code, pit, ex:{q,a} }],
  quiz:    [{ q, o:[选项], a: 正确下标 | 填空答案, why, whyEn?, type: "choice"|"judge"|"fill" }]
}
lab  = { id, t, t_en, req[], starter, hint, xp }
term = { term, term_en, short, short_en, detail[], vs, vs_en, cat? }   // cat 由叠加层的 TERM_CAT 补齐
cmap = { nodes:[{ id, tier }], edges:[{ a, b, zh, en }] }              // 交互式概念图拓扑（AGENT_CONCEPT_MAP）
```

> ⚠️ **填空题的答案写在 `a`（与选择题共用同一字段），不是 `ans`。** 判分与错题记录统一按 `q.ans != null ? q.ans : q.a` 兼容读取；两者混用会出现「填空永远判错 + 错题本记录 `undefined`」这种不报错的静默缺陷。

#### 3.3 叠加层（overlay）扩展模式

新增章节与题库**不改动原始数据文件**，而是以「叠加层 + 启动期合并」注入：

```js
window.AGENT_CURRICULUM = (window.AGENT_CURRICULUM || []).concat(NEW_STAGES);
window.AGENT_LABS       = (window.AGENT_LABS       || []).concat(NEW_LABS);
window.AGENT_TERMS      = (window.AGENT_TERMS      || []).concat(NEW_TERMS);
```

收益：原始数据文件保持稳定（便于 diff 与回滚），扩容只增新文件；**旧的学习进度键完全不受影响**（进度以 `lesson.id` 为键，新增章节不改变既有 id）。

#### 3.4 题库与抽题算法

- **题型**：`choice`（单选）/ `judge`（判断）/ `fill`（填空）。判断题复用选项渲染（仍参与乱序）；填空题用 `<input class="fill-input">`，判分走 `normAns()`（全角→半角、去空白与中英标点、小写）。
- **抽题**：`buildQuiz(scope)` 先遍历题池，对**每种已存在题型各保底抽 1 题**（防止某一题型被随机淹没），再从未抽中的题目里随机补足。
  - `scope = "all"`（全站测评）→ 抽 12 题；
  - `scope = <章节 id>`（章节测评）→ 用该章整库出题。
- **成绩键**：`data.quizBest["best"]`（全站）/ `data.quizBest["stage:<id>"]`（分章），分章成绩回显在章节卡片徽章上。
- **错题本**：答错即写入 `data.mistakes`（同题去重，只留最新一次），并附正确答案与解析。

#### 3.5 国际化（i18n）：单一事实源 + 双层覆盖

- **界面文案**：`t(zh)` —— 中文串即 key，`LANG === "en"` 时查 `I18N_EN` 映射，缺 key 原样返回（不报错）。
- **课程内容**：数据文件里的 `*_en` 字段是**唯一事实源**，`lang-en.js` 只做「提取/索引」，不重复抄写文案；缺字段回退中文。
- **模块级常量坑**：侧边栏 `NAV` 存中文 key，渲染时再 `t()`，避免加载期被「烘焙」成中文。

#### 3.6 侧边栏 / 进度 / 版权

- **侧边栏**（对齐 R0-hello-world）：桌面 ≥980px 常驻 264px（`body{padding-left:284px}`），`<980px` 转为抽屉；`body.sbCollapsed` 可整体收起；右缘 `.sb-resizer` 可拖拽调宽，宽度写入 `data.flags.sbWidth`。内容分「页面区块」导航 + 「课程章节」列表（带 `done/total` 进度）+ EDU 系列互链。
- **进度与激励**：`localStorage` 保存完成进度、XP / 等级、星币、连续打卡、复习队列（间隔重复）、错题本、热力图、成就、笔记、日报；主题皮肤仅解锁配色，**不做 pay-to-win**。
- **版权注释**：代码块通过 `crAttr()` 注入 `<span class="cr-attr">`（`display:none`）——**页面不展示、复制随行带走**；页脚另有可见版权行；各 JS 文件头部含「制作者 / 版权所有」注释。

#### 3.7 开发约定（几条「不报错、只静默失效」的坑）

改这个工程前先把下面几条钉在墙上——它们都不会抛异常，只会在运行时悄悄退化：

1. **任何 `data-act` 都必须在全局事件委派里有分支。** 按钮在、函数在，但委派里少一个 `else if (act === "x")`，点击就毫无反应。新增按钮后自检：**markup 的 `data-act` 集合 ∖ JS 的 `act ===` 集合必须为空**。
2. **填空题答案读 `a`**，见 3.2 的 ⚠️。
3. **别把函数写进 `localStorage`。** `data.streak.lastCheck = t`（误写 i18n 函数）会被 `JSON.stringify` 静默丢弃，表现为「连续打卡天数永远重置为 1」。
4. **列表渲染时，底部操作条别写在循环体内**，否则「提交 / 导出」类控件会被渲染 N 份。
5. **`innerHTML` 重建容器会清掉 `open` 等状态类**：`renderChapters()` 之后所有章节都会折叠，交互代码需要重设。
6. **改被缓存文件后**，同时 bump 页面 `?v=` 与 SW `CACHE`（见第 4 节）。

### 4. 运行与部署

```bash
# 本地直接运行
双击 index.html

# 或起一个静态服务（推荐，可验证 PWA 离线缓存）
python -m http.server 8080
```

**部署到 GitHub Pages**：将本目录（`index.html` + 4 个数据 / 英文脚本 + `agent-sw.js`）推送至仓库**根目录**（不要套子目录），然后在 *Settings → Pages → Build and deployment → Source* 选择 `Deploy from a branch`、分支 `main`、目录 `/ (root)`。

> 仓库名仅允许字母、数字与 `.` `-` `_`（不支持冒号与空格），建议 `R0-hello-agent`，把「**R0:hello agent**」写进仓库 About。跨站互链已指向 `huangdouplone.github.io/R0-hello-world` 与 `.../R0-hello-agi`。

#### 4.1 仓库简介（可直接粘贴到 GitHub 的 About / Description）

| 字段 | 值 |
| --- | --- |
| About（一行） | `R0:hello agent · 从零开始的大模型` |
| Description（中文） | 从零上手 → 会用 → 部署落地：**14 章 71 节**的大模型自学课程，覆盖 LLM 概念、API 调用、本地部署、提示词工程、RAG、MCP、Agent，以及成本 / 安全 / 评估 / 微调 / 上线。纯静态单文件应用，零依赖、可离线，自带交互式概念图、名词库与章节测评。 |
| Description (English) | A **14-chapter, 71-lesson** self-study course for large language models — concepts, API calls, local deployment, prompting, RAG, MCP and Agents, plus cost, safety, evaluation, fine-tuning and shipping. A purely static, dependency-free, offline-capable single-page app with an interactive concept map, a searchable term library and per-chapter quizzes. |
| Website | `https://huangdouplone.github.io/R0-hello-agent/` |
| Topics | 见文末 [🏷️ Topics](#-topics) |

> ⚠️ **Service Worker 缓存键约定**：`agent-sw.js` 的 `ASSETS` 必须与 `index.html` 中 `<script src>` 的 URL **逐字符一致**（含 `?v=N` 查询串）。缓存以完整请求 URL 为键，裸文件名匹配不上带查询串的请求，会导致离线时取不到这些资源。**修改被缓存文件后，需同时 bump 文件名后的 `?v=` 与 SW 的 `CACHE` 版本号。**

### 5. 文件清单

| 文件 | 作用 |
| --- | --- |
| `index.html` | 单文件应用：全部 UI、样式、状态与逻辑 |
| `agent-extra-data.js` | 课程数据 c1~c7 + 实战 / 名词 / 工作流 |
| `agent-extra-data2.js` | 扩展包 2：章节 c8~c14、新实战 / 名词、概念图拓扑，并重建 / 合并英文表 |
| `lang-en.js` | 标题级英文表（由 `_en` 字段派生） |
| `lang-en-content.js` | 正文级英文覆盖（c1~c7） |
| `agent-sw.js` | Service Worker（离线缓存） |
| `README.md` / `LICENSE.md` | 说明与许可 |

### 6. 已知边界

- **正文英文覆盖不均**：c1~c14 的**章节名 / 课节标题 / 实战标题 / 名词卡 / 概念图边标签**均为全量双语；课节**正文**（summary/code/pit/ex）在 EN 模式下，未收录的条目回退中文（现覆盖 c1~c14 全部课节，属系列已知约定）。
- **测评进行中切换语言**不会重渲染已出好的题面（切语言只重渲染静态文案与列表）；重新点「开始测评 / 章节测评」即为新语言。
- Service Worker 在 `file://` 下会被浏览器拒绝注册，属正常现象；经由 http(s) 托管才会真正生效。
- 课程中的模型名、价格与命令均为示例，请以厂商官方文档为准。

---

## English

### 1. Scope

| Aspect | Notes |
| --- | --- |
| Form | Single `index.html` (UI + all logic) + 4 external data/i18n scripts + 1 Service Worker |
| Run | Double-click `index.html`; served over http(s) it enables offline caching (PWA) |
| Storage | All progress in browser `localStorage`; no backend, no accounts |
| Deps | Zero. No CDN, fonts, chart libraries or frameworks — the concept map is hand-written inline DOM |
| Layout | Responsive; persistent 264px sidebar on ≥980px, drawer + hamburger below |
| Goal | Not theory — **get you fluent and explicit about actually using LLMs** |

### 2. Scale (measured)

| Metric | Value |
| --- | --- |
| Chapters / lessons | **14 / 77** |
| Quiz questions | **57** (choice 29 · judge 14 · fill 14) |
| Quiz length | 12 site-wide; **plus a per-chapter quiz** drawn from that chapter's full bank |
| Hands-on labs | **14** |
| Term library | **42 entries** in 5 categories, with search and a 9-item collapsed default |
| Concept map | **22 nodes / 30 relations**, interactive (overview ↔ focus) |
| Workflow | **8 steps** + a full example |
| Homepage themes | **16** (1 default + 15 coin-unlocked) |
| Achievements | **10** |

### 3. Architecture

- **Single source of truth for English**: `*_en` fields in the data files; `lang-en.js` only derives id-indexed maps (no duplicated literals); missing fields fall back to Chinese.
- **Overlay pattern**: new chapters, lessons, quizzes, labs and terms are all appended via `agent-extra-data2.js` at startup (it also rebuilds the derived EN title maps), keeping the original data files stable and **existing progress keys untouched**.
- **UI i18n**: `t(zh)` — the Chinese string is the key; `I18N_EN` supplies English.
- **Copyright in code blocks**: injected as `<span class="cr-attr">` (`display:none`) so it is invisible on the page but travels with copy-paste.

### 4. Run & deploy

Open `index.html`, or `python -m http.server 8080` to exercise the PWA. For GitHub Pages, push this folder as the repository **root** (repo name `R0-hello-agent`; put `R0:hello agent` in the repo *About*; ready-to-paste Description and Topics are in §4.1 and the end of this document).

> ⚠️ SW `ASSETS` must match the `<script src>` URLs **character for character, including `?v=N`**. Bump both the `?v=` and the SW `CACHE` version after changing any cached file.

---

隶属于拾色造梦企划 EDU 系列 · Part of the 「Shise Zaomeng」EDU series
系列其他项目 / Other projects in the series：
- 🌱 [R0:hello world · 从零开始的编程之路](https://huangdouplone.github.io/R0-hello-world/)
- 🔗 [R0:hello agi · 从零开始的 AGI 之路](https://huangdouplone.github.io/R0-hello-agi/)

## 🏷️ Topics

`llm` · `large-language-models` · `ai-agents` · `prompt-engineering` · `rag` · `mcp` · `model-context-protocol` · `function-calling` · `local-llm` · `ollama` · `fine-tuning` · `lora` · `llm-evaluation` · `ai-safety` · `agent-skills` · `self-study` · `learning-roadmap` · `static-site` · `pwa` · `no-build`
