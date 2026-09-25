/* ================================================================
 * R0:hello agent · 课程深化层 ②（c4–c7）+ 配套五件套扩展
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把 c4 提示词 / c5 RAG / c6 MCP / c7 Agent 从「3 要点」深化到「6~7 要点」。
 * ★ id 与标题必须与主数据完全一致（本层只替换内容，不改标题）。
 * 同步扩展：题库（每章 +3）、关系图（+6 节点/+10 边）、词典（+8）、
 *           学习节奏（minMap，由页面在深化合并后调用）、成就（+5，由页面合并）。
 * ================================================================ */

const DEEPEN_AGENT_B = {
  stages: ["c4", "c5", "c6", "c7"],

  lessons: {

    /* ===== c4 提示词工程 ===== */
    "c4l1": {
      title: "系统提示与角色设定", title_en: "System Prompts & Role Setting",
      summary: [
        "系统提示（system）位于 messages 数组开头，对整轮对话持续生效——它是**最稳定的约束位置**，规则应该写在这里而不是 user 消息里。",
        "角色设定的作用是**缩小输出分布**：同样是解释概念，「面向小学生」和「面向资深工程师」的答案完全不同。",
        "一个能用的系统提示骨架：**身份 + 能力边界 + 输出格式 + 禁止事项**，四块各占两三行即可，不必长篇大论。",
        "把「不变的规则」放 system、「每次变化的内容」放 user——改任务时不必重发规则，也更省 token。",
        "角色要具体：不说「你是助手」，而说「你是处理客服工单的助手，只回答与工单相关的问题」。",
        "多轮裁剪历史时 system 必须保留——它被裁掉后，模型表现会突然「变松」，这类回归很难排查。",
        "调试方法：把实际发送的 messages 完整打印出来，规则丢失、顺序错乱一眼可见。"
      ],
      summary_en: [
        "The system prompt sits at the head of messages and applies to the whole conversation — the most stable place for rules, not user turns.",
        "Role setting narrows the output distribution: 'explain to a child' and 'to a senior engineer' produce very different answers.",
        "A workable skeleton: identity + capability boundary + output format + prohibitions, a couple of lines each.",
        "Put unchanging rules in system and varying content in user, so changing tasks does not resend rules and saves tokens.",
        "Be specific: not 'you are an assistant' but 'you handle support tickets and answer nothing else'.",
        "Never trim system when pruning history — losing it makes behaviour drift suddenly, which is hard to debug.",
        "Debug by printing the full messages array; lost rules and wrong order become obvious."
      ],
      code: "system = \"\"\"你是客服工单助手。\n只回答与工单相关的问题；其他问题回复「请提交工单」。\n输出 JSON：{\"category\":\"...\",\"priority\":\"P0|P1|P2\"}\n不确定就填 null，不要编造。\"\"\"",
      pit: "把规则写在 user 消息里而不是 system——多轮之后规则容易被历史裁剪带走，模型表现会突然「变松」。",
      pit_en: "Putting rules in user turns means history trimming can drop them, and behaviour drifts mid-conversation.",
      ex: {
        q: "为什么规则应该放 system 而不是 user？",
        a: "system 位于数组开头且不会被历史裁剪带走，能稳定地约束整轮对话；放 user 容易在多轮后被挤掉。",
        q_en: "Why put rules in system rather than user?",
        a_en: "system sits at the head and survives history trimming, constraining the whole conversation."
      }
    },

    "c4l2": {
      title: "少样本与结构化输出", title_en: "Few-shot & Structured Output",
      summary: [
        "少样本（few-shot）是在提示里给 2~5 个**输入→输出**的例子，让模型照着做——比描述规则更直观，尤其适合难以言传的格式与判断尺度。",
        "例子的质量比数量重要：例子之间必须**一致**（同样的格式、同样的判断标准），否则模型学到的是噪声。",
        "要覆盖边界：除了典型样例，再给一个「异常输入」的例子，模型才知道特殊情况该怎么处理。",
        "想要结构化输出（JSON）有三层手段：**明确 schema** → **少样本示例** → **JSON 模式/函数调用**（能力允许时最稳）。",
        "必须在提示里禁止多余文字（「只输出 JSON，不要解释、不要代码块」），否则常会得到被反引号包裹的内容。",
        "代码侧必须兜底：**解析失败要带着错误信息重试**，让模型自己修正；重试要有上限（c11）。",
        "注意成本：每个例子都占上下文并被反复计费——例子够用即可，不必堆很多。"
      ],
      summary_en: [
        "Few-shot gives 2–5 **input→output** examples for the model to copy — often clearer than describing rules, especially for formats and judgement scales.",
        "Quality beats quantity: examples must be **consistent**, or the model learns noise.",
        "Cover edges: add one abnormal input so the model knows how to handle exceptions.",
        "Three layers for structured output: **explicit schema** → **few-shot examples** → **JSON mode / function calling** (most reliable when available).",
        "Forbid extra text ('only JSON, no explanation, no code fences'), or you get fenced blocks.",
        "Handle failures in code: **retry with the parse error included**, with a cap (c11).",
        "Mind cost: examples consume context and are billed every call."
      ],
      code: "把句子按情绪分类，只输出：正面 / 负面 / 中性\n\n句子：这个更新太好用了 → 正面\n句子：又崩了，烦死了   → 负面\n句子：会议改到下午三点 → 中性\n句子：<待分类>        →",
      pit: "例子之间标准不一致（同样的输入在两例里归类不同），模型学到的是噪声，输出会变得随机。",
      pit_en: "Inconsistent examples teach noise and make outputs random.",
      ex: {
        q: "让模型稳定输出 JSON 的优先手段是什么？",
        a: "优先用 JSON 模式/函数调用；不支持时靠明确 schema + 少样本示例，并在代码侧做解析失败重试。",
        q_en: "What is the preferred way to get reliable JSON?",
        a_en: "JSON mode / function calling first; otherwise explicit schema plus examples with retry on parse failure."
      }
    },

    "c4l3": {
      title: "思维链与分解任务", title_en: "Chain of Thought & Task Decomposition",
      summary: [
        "思维链（CoT）是**要求模型先写出推理过程再给结论**，能显著提升数学、逻辑与多步判断类问题的准确率。",
        "它有效的直觉：直接给答案等于让模型一步猜中；写出来等于把困难问题拆成若干容易的小步。",
        "最简形式是加一句「请一步步推理后再给结论」；更强的形式是先给一个带推理过程的示例。",
        "任务分解是同一思想的工程化：把一个大问题拆成多个子问题分别调用，再汇总——比一个巨型提示更可控。",
        "代价是输出更长（更多 token、更慢、更贵），所以**简单任务不要用**——只对确实需要推理的任务开。",
        "若要程序解析，要求「最后一行用固定格式给出结论」，把推理与结论分开。",
        "注意它不消除幻觉：推理写得再顺，也可能基于错误前提；关键结论仍要校验。"
      ],
      summary_en: [
        "Chain of thought asks the model to **write the reasoning before the conclusion**, improving accuracy on maths, logic and multi-step judgement.",
        "Why it works: answering directly is one hard guess; writing steps decomposes it into easy ones.",
        "Simplest form: 'think step by step, then conclude'; stronger: show an example with reasoning.",
        "Task decomposition is the engineering version: split a big problem into sub-calls and aggregate — more controllable than one giant prompt.",
        "The cost is longer output (more tokens, slower, pricier) — **skip it for simple tasks**.",
        "For parsing, require 'the final answer in a fixed format on the last line'.",
        "It does not remove hallucination: fluent reasoning can rest on false premises."
      ],
      code: "请一步步推理，最后一行用「答案：X」的格式给出结论。\n\n问题：一件商品先涨价 20%，再降价 20%，最终价格相比原价？",
      pit: "对所有任务都开思维链——简单任务只会多花 token 与时间；应按任务难度决定是否使用。",
      pit_en: "Using chain of thought everywhere just spends tokens and time on easy tasks.",
      ex: {
        q: "思维链为什么能提升复杂题的准确率？",
        a: "它把「一步猜答案」拆成若干可验证的小步骤，模型在每个小步上出错的概率更低，从而提升整体正确率。",
        q_en: "Why does chain of thought improve hard problems?",
        a_en: "It decomposes one hard guess into verifiable small steps, each with a lower error probability."
      }
    },

    "c4l4": {
      title: "提示词的常见坑", title_en: "Common Prompting Pitfalls",
      summary: [
        "坑一：**指令与数据混在一起**——要处理的外部文本里藏着指令，模型可能照着执行（提示注入，见 c10）。",
        "坑二：**一次要太多**——一个提示里塞五个任务，每个都做不精；拆成多次调用，每次专注一件事。",
        "坑三：**约束缺失或互相矛盾**——「要详细」和「控制在 50 字以内」同时出现，模型只能随机选一个遵守。",
        "坑四：**负面指令太多**——「不要 X、不要 Y」列一长串，不如正面说清「应该做什么」。",
        "坑五：**关键信息埋在中段**——长提示的中间最容易被忽略，关键约束应放开头或结尾。",
        "坑六：**把示例和真数据混在一起**——分隔符不清晰时，模型会把示例当成待处理内容。",
        "排查方法：把提示当作「给新同事的交接文档」重读一遍——如果新人会误解，模型也会。"
      ],
      summary_en: [
        "Pit 1: **instructions mixed with data** — external text containing instructions may be followed (prompt injection, see c10).",
        "Pit 2: **asking for too much at once** — five tasks in one prompt are all done poorly; split into calls.",
        "Pit 3: **missing or contradictory constraints** — 'be detailed' and 'under 50 words' cannot both hold.",
        "Pit 4: **too many negative instructions** — a long list of 'don't' is weaker than saying what to do.",
        "Pit 5: **key information buried in the middle** — long prompts neglect the middle; put constraints at the edges.",
        "Pit 6: **examples mixed with real data** — without clear delimiters the model treats examples as input.",
        "Debug: reread the prompt as a handover document for a new colleague — if they would misunderstand, so will the model."
      ],
      code: "反例：请总结这篇文章，要详细，但控制在 50 字以内，不要遗漏任何要点。\n正例：请用 50 字以内总结这篇文章的核心结论；只保留与结论直接相关的信息。",
      pit: "约束互相矛盾还期待稳定输出——模型只能在两个要求里随机满足一个，结果自然不稳定。",
      pit_en: "Contradictory constraints make the model randomly satisfy one of them — instability by construction.",
      ex: {
        q: "为什么「一次要太多」是坑？",
        a: "模型的注意力与输出长度都有限，多任务并发会让每个任务的完成质量下降；拆分后每个调用都有明确的成功标准。",
        q_en: "Why is asking for too much a pitfall?",
        a_en: "Attention and output length are limited; splitting gives each call a clear success criterion."
      }
    },

    "c4l5": {
      title: "反思与自我纠错：让模型自己检查答案", title_en: "Reflection & Self-correction",
      summary: [
        "反思（reflection）是让模型**对自己的输出做一次检查**：找出错误、遗漏或不符合格式的地方，再给出修正版。",
        "最简单的实现是两步调用：第一步生成 → 第二步把「输出 + 检查清单」一起发给模型，请它批评并重写。",
        "对格式类任务特别有效：把 schema 一起给过去，让模型自己核对字段是否齐全、类型是否正确。",
        "它不能替代真正的校验：模型检查自己也可能漏——程序侧的 schema 校验仍然是底线。",
        "成本会翻倍（多一次调用），所以**只对高价值或易错的任务启用**。",
        "进阶形态是「批评者模型」：用另一个模型（或另一次独立调用）来审查输出，避免「自己查自己」的盲区。"
      ],
      summary_en: [
        "Reflection asks the model to **review its own output**: find errors, omissions or format violations, then produce a corrected version.",
        "Simplest form is a second call: send the output plus a checklist and ask it to critique and rewrite.",
        "Especially effective for format tasks: pass the schema along so the model checks fields and types itself.",
        "It does not replace real validation — the model can miss things too; program-side schema checks remain the floor.",
        "It doubles cost (an extra call), so enable it only for high-value or error-prone tasks.",
        "Advanced form: a critic model, or a separate independent call, to avoid the blind spots of self-review."
      ],
      code: "第二步调用：\n以下是你的上一版输出与要求的 schema，请逐项检查：\n1) 是否为合法 JSON  2) 字段是否齐全  3) 取值是否在枚举内\n若有问题，直接输出修正后的完整 JSON；无问题则原样输出。",
      pit: "把「模型说它检查过了」当成真的检查过——自我报告不等于校验通过，程序侧验证不可省。",
      pit_en: "Trusting 'I have checked' as an actual check — self-reports are not validation; keep program-side checks.",
      ex: {
        q: "反思机制为什么对格式类任务特别有效？",
        a: "因为格式是否正确有客观标准（schema），把标准一起给过去，模型能逐项核对，修正成功率远高于凭感觉重写。",
        q_en: "Why does reflection work well for format tasks?",
        a_en: "Format correctness is objective; handing the schema over lets the model check item by item."
      }
    },

    "c4l6": {
      title: "提示词版本管理与 A/B 测试", title_en: "Prompt Versioning & A/B Testing",
      summary: [
        "提示词就是**代码**：它决定输出行为，因此需要和代码一样做版本管理（存档、可回滚、可追溯）。",
        "最低要求：把提示存成独立文件（或常量模块），标注版本号与修改原因，不要散落在业务代码里。",
        "改提示必须**跑评测集**（c11）：同一批样例、同一套标准，改前改后各跑一遍，用数字说话而不是凭感觉。",
        "A/B 测试的做法：新旧两版各跑一半流量（或各跑同一评测集），比较成功率、格式合规率与成本。",
        "注意过拟合：在评测集上反复调优会「背答案」，要留出一部分从未参与调优的样例做复验。",
        "改动要小步：一次只改一处（加一条规则、换一个示例），否则无法归因是哪个改动带来的变化。"
      ],
      summary_en: [
        "A prompt is **code**: it determines behaviour, so version it like code (archived, rollback-able, traceable).",
        "Minimum: store prompts in dedicated files (or constant modules) with version numbers and change reasons, not scattered in business logic.",
        "Every change must run the evaluation set (c11): same samples, same criteria, before and after — numbers, not vibes.",
        "A/B: run old and new versions on half the traffic each (or the same eval set), comparing success rate, format compliance and cost.",
        "Beware overfitting: tuning repeatedly on the eval set memorises it; keep untouched samples for validation.",
        "Change in small steps: one rule or one example at a time, or you cannot attribute the effect."
      ],
      code: "prompts/\n  classifier.v3.txt      # 当前\n  classifier.v2.txt      # 上一版（保留可回滚）\nCHANGELOG.md             # v3: 增加「不确定填 null」→ 格式合规率 91%→97%",
      pit: "凭感觉改提示词且不做评测——「看起来更好」往往是错觉，可能在另一类输入上悄悄变差。",
      pit_en: "Tuning prompts by feel without evaluation: 'looks better' is often an illusion that quietly regresses other inputs.",
      ex: {
        q: "为什么改提示词必须跑评测集？",
        a: "提示词影响输出行为，与代码改动等价；只有同一批样例、同一标准的数字对比，才能证明改动是改善而不是退化。",
        q_en: "Why must prompt changes run the eval set?",
        a_en: "Prompts shape behaviour like code; only before/after numbers on the same samples prove improvement."
      }
    },

    /* ===== c5 检索增强 RAG ===== */
    "c5l1": {
      title: "为什么模型会“瞎编“——幻觉", title_en: "Why Models Hallucinate",
      summary: [
        "幻觉的根源在机制：模型是**按概率生成**，不是按事实检索——当训练数据里没有可靠依据时，它仍会给出「语言上合理」的回答。",
        "三类高发场景：**训练截止后的事实**（时效）、**私有知识**（公司内部资料）、**长尾细节**（具体数字、引用、姓名）。",
        "「语言上合理」是关键：幻觉的句子通常语法通顺、结构完整，**无法从表面分辨真假**——所以不能靠读起来可不可信来判断。",
        "降低幻觉的三个手段：**检索增强**（给依据，c5）、**要求引用**（答案必须标注来源）、**允许说不知道**（明确告诉模型「没有依据就承认」）。",
        "提问方式也有影响：诱导性问题（「为什么 X 是对的」）会推着模型顺着错误前提编造；开放式提问更安全。",
        "高风险场景（医疗、法律、财务、代码删除操作）必须**强制引用 + 人工复核**，不能裸用。"
      ],
      summary_en: [
        "Hallucination is mechanistic: the model **generates by probability**, not by looking up facts — without reliable grounding it still produces plausible text.",
        "Three high-risk areas: **post-cutoff facts**, **private knowledge**, and **long-tail details** (exact numbers, citations, names).",
        "Plausibility is the trap: hallucinated sentences are grammatical and well-structured, **indistinguishable by reading** — never judge by tone.",
        "Three mitigations: **retrieval** (provide grounding, c5), **require citations**, and **allow 'I don't know'**.",
        "Prompting matters: leading questions ('why is X correct') push the model to elaborate a false premise; open questions are safer.",
        "High-stakes domains (medical, legal, financial, destructive code ops) require **mandatory citations plus human review**."
      ],
      code: "系统提示追加：\n只依据提供的资料回答；资料中没有的信息，回答「资料中未提及」。\n引用格式：[来源: 文件名#段落]",
      pit: "用「读起来顺不顺」判断答案真假——幻觉恰恰以通顺著称；唯一可靠的是核对依据与来源。",
      pit_en: "Judging truth by fluency is exactly backwards — hallucinations are fluent; only checking sources is reliable.",
      ex: {
        q: "为什么模型「宁 可编也不说不知道」？",
        a: "因为训练目标是「生成最像答案的文本」，而「承认不知道」在语料里出现得少；不显式允许它说不知道，它就会倾向编一个。",
        q_en: "Why would a model invent rather than say 'I don't know'?",
        a_en: "Training rewards answer-like text; unless explicitly permitted to admit ignorance, it tends to produce one."
      }
    },

    "c5l2": {
      title: "切片、向量化与向量库", title_en: "Chunking, Embeddings & Vector Stores",
      summary: [
        "RAG 的检索通常不是关键词匹配，而是**语义检索**：文本转成向量（embedding），按相似度找最相关的片段。",
        "直觉：语义相近的文字在向量空间里也相近，所以「怎么退款」能匹配到「退货流程说明」——关键词匹配做不到。",
        "离线流程：资料 → **切片** → 每片算向量 → 存入向量库；在线流程：问题转向量 → 相似度检索 → 取 top-k 片段。",
        "切片往往比换模型更影响效果：太长会稀释相关性，太短会丢失上下文；常见做法 300~800 字 + 相邻段重叠。",
        "更好的切片是**按结构切**（标题、段落、列表），并给每片带上元信息（来源、标题、更新时间）便于过滤与引用。",
        "embedding 模型与生成模型是两个模型：前者负责检索，后者负责作答；换 embedding 模型是第二步优化。"
      ],
      summary_en: [
        "RAG retrieval is usually **semantic**: text becomes vectors (embeddings) and the nearest fragments win.",
        "Intuition: similar meanings sit close in vector space, so 'how to get a refund' matches 'returns policy'.",
        "Offline: documents → **chunks** → embeddings → vector store. Online: embed the question → similarity search → top-k fragments.",
        "Chunking often matters more than the model: too long dilutes relevance, too short loses context; 300–800 characters with overlap is common.",
        "Better: **chunk along structure** (headings, paragraphs, lists) with metadata (source, heading, updated time) for filtering and citation.",
        "The embedding model differs from the generation model: one retrieves, the other answers; swapping embeddings is a second-order optimisation."
      ],
      code: "离线：文档 → 切片 → embedding → 向量库\n在线：问题 → embedding → top-k 检索 → 拼进上下文 → 生成",
      pit: "机械地按固定字数切片——把完整的说法切断，模型读到的片段残缺或自相矛盾，答案质量随之下降。",
      pit_en: "Chunking purely by character count cuts complete statements in half, degrading answers.",
      ex: {
        q: "为什么切片方式对 RAG 效果影响这么大？",
        a: "切片决定了「模型能看到的最小知识单元」：切太碎丢上下文，切太大稀释相关性，两者都直接损害检索与生成。",
        q_en: "Why does chunking matter so much?",
        a_en: "It defines the smallest knowledge unit the model sees; both extremes hurt retrieval and generation."
      }
    },

    "c5l3": {
      title: "检索—拼接—生成 三步流程", title_en: "Retrieve → Assemble → Generate",
      summary: [
        "标准 RAG 是三步：**检索**（按问题找相关片段）→ **拼接**（把片段与问题一起放进上下文）→ **生成**（基于资料回答）。",
        "拼接有讲究：片段要标序号与来源，并明确告诉模型「只依据这些资料回答，资料中没有就说没有」。",
        "拼接顺序影响效果：最相关的片段放开头或结尾（注意力强的位置），并控制总长度不超窗口。",
        "生成时要要求**引用格式**（如 [1][2]），让答案可追溯到具体片段——这是「可信」的关键。",
        "检索质量是上限：检索不到就生成不好；所以宁可在检索端多投入（更好的切片、重排），也不要只调生成端。",
        "进阶优化是**重排（rerank）**：先粗检索 top-20，再用重排模型精选 top-3，效果通常明显提升。"
      ],
      summary_en: [
        "Standard RAG is three steps: **retrieve** (find relevant fragments) → **assemble** (place fragments and the question in context) → **generate** (answer from them).",
        "Assembly matters: number the fragments with sources, and instruct 'answer only from these; say so if absent'.",
        "Order affects quality: most relevant fragments at the start or end (strong attention positions), within the window.",
        "Require a **citation format** ([1][2]) so answers are traceable to fragments — the key to trustworthiness.",
        "Retrieval quality is the ceiling: bad retrieval cannot be fixed by generation; invest on the retrieval side first.",
        "Advanced: **reranking** — coarse top-20 first, then a reranker picks top-3, usually a clear improvement."
      ],
      code: "上下文模板：\n【资料 1】(来源: refund.md#3)\n<片段内容>\n…\n【问题】<用户问题>\n【要求】只依据上述资料回答；没有依据就回答「资料中未提及」，并标注引用 [n]。",
      pit: "把检索结果不做标注直接拼进去——模型无法区分「依据」和「普通文本」，也不会给引用，答案可信度无从核对。",
      pit_en: "Dumping retrieved fragments unlabelled means the model cannot tell evidence from filler and cites nothing.",
      ex: {
        q: "为什么要求答案标注引用？",
        a: "引用让每个结论可追溯到具体片段，既方便用户核对，也能在答案出错时快速定位是检索还是生成的问题。",
        q_en: "Why require citations in answers?",
        a_en: "Citations make each claim traceable to a fragment, easing verification and debugging."
      }
    },

    "c5l4": {
      title: "RAG 的边界与成本", title_en: "RAG: Limits & Costs",
      summary: [
        "RAG 不是万能的：**检索不到就答不好**——资料没入库、切片切坏、查询与资料用词差异大，都会导致失败。",
        "成本构成比看上去高：需要 embedding、向量库、切片与索引维护，还有每次查询的检索与更长上下文的生成费用。",
        "文档很小且不常变时，**直接把全文放进上下文**往往更简单也更准——不要为几页资料上一整套向量库。",
        "资料更新是持续成本：文档改了要重新切片入库，忘记更新索引就会答旧内容。",
        "另一条边界：RAG 解决「知识」，不解决「能力」——改变风格、格式或技能要靠微调（c12）或提示工程。",
        "渐进策略更稳：先直接贴全文验证 → 不够再上检索 → 仍不够再优化切片、重排与混合检索。"
      ],
      summary_en: [
        "RAG is not a panacea: **bad retrieval means bad answers** — missing documents, broken chunking or vocabulary mismatch all fail.",
        "Its costs are real: embeddings, a vector store, chunking and index maintenance, plus retrieval and longer-context generation on every query.",
        "For small, stable documents **pasting the full text** is simpler and often more accurate than a vector stack.",
        "Updates are ongoing: changed documents must be re-chunked and re-indexed, or the system answers stale content.",
        "Another limit: RAG fixes knowledge, not capability — style, format or skills need fine-tuning (c12) or prompt engineering.",
        "Go gradually: paste the full text first → add retrieval if needed → then tune chunking, reranking and hybrid search."
      ],
      code: "决策：\n  资料能放进窗口？      是 → 直接放进上下文\n  资料大/常变/要引用？  是 → 上 RAG\n  维护索引的成本能否接受？ 否 → 考虑定期离线重建",
      pit: "资料更新了却忘记重建索引——系统继续回答旧内容，而且没有任何报错，只能靠人工抽查发现。",
      pit_en: "Updating documents without re-indexing keeps answering stale content, silently.",
      ex: {
        q: "什么情况下「直接把全文放进上下文」比 RAG 更好？",
        a: "文档小且不常变、能舒适放进上下文窗口时——此时检索带来的复杂度没有必要，直接全文通常也更准。",
        q_en: "When is pasting the full text better than RAG?",
        a_en: "When documents are small, stable and fit the window — retrieval adds complexity with no benefit."
      }
    },

    /* ===== c6 MCP 协议 ===== */
    "c6l1": {
      title: "为什么需要 MCP——工具调用的乱象", title_en: "Why MCP Exists",
      summary: [
        "没有 MCP 之前，每个应用接工具都要自己写一套「工具描述 + 调用协议 + 鉴权」——同样的 GitHub 工具，A 应用和 B 应用的接法完全不同。",
        "结果是三重浪费：**工具方**要为每个平台各写一份适配、**应用方**要为每个工具各写一套接入、**使用者**在不同应用里体验割裂。",
        "MCP 把这件事标准化：**工具方写一次 Server，任何支持 MCP 的应用都能接**；应用方实现一次 Client，就能接入所有 Server。",
        "类比：MCP 之于工具调用，就像 USB 之于外设——统一接口，双方各自实现一次。",
        "它同时定义了能力 vocabulary（Tools / Resources / Prompts）与传输方式（stdio / HTTP），所以「能做什么」和「怎么连」都有标准答案。",
        "理解动机很重要：MCP 不是「又一个框架」，而是解决 N×M 适配问题的行业协议。"
      ],
      summary_en: [
        "Before MCP, every app rolled its own tool description, calling protocol and auth — the same GitHub tool was integrated differently in every app.",
        "That is a triple waste: tool authors adapt per platform, app authors integrate per tool, and users get fragmented experiences.",
        "MCP standardises it: **write a server once, any MCP-capable app can use it**; implement a client once, connect to every server.",
        "Analogy: MCP is to tool calling what USB is to peripherals — one interface, implemented once on each side.",
        "It standardises both the capability vocabulary (Tools / Resources / Prompts) and the transport (stdio / HTTP), so 'what' and 'how' both have answers.",
        "MCP is not 'another framework' — it is an industry protocol solving the N×M integration problem."
      ],
      code: "没有 MCP：工具 × 应用 = N×M 份适配\n有了 MCP：工具写 1 次 Server + 应用实现 1 次 Client = N+M",
      pit: "把 MCP 当成「又一个需要学习的框架」而抵触——它的价值恰恰是让你以后**少写**适配代码。",
      pit_en: "Resisting MCP as 'yet another framework' misses the point: it exists so you write less glue code.",
      ex: {
        q: "MCP 解决的核心问题是什么？",
        a: "把「工具与应用之间 N×M 的适配」标准化成 N+M：工具方实现一次 Server，应用方实现一次 Client。",
        q_en: "What problem does MCP solve?",
        a_en: "It turns the N×M tool↔app integration matrix into N+M: servers written once, clients implemented once."
      }
    },

    "c6l2": {
      title: "MCP 的角色：Host / Client / Server", title_en: "MCP Roles: Host, Client, Server",
      summary: [
        "**Host** 是用户使用的应用（如 Claude Desktop、IDE），负责提供 UI、管理权限与用户确认——它是安全的责任方。",
        "**Client** 运行在 Host 内部，负责与某个 Server 建立并维护连接（一个 Host 可以同时连多个 Server，各有各的 Client）。",
        "**Server** 对外暴露能力（工具/资源/提示），可以是一个本地进程，也可以是远程服务。",
        "三者分工清楚：Server 只声明能力不关心谁在用；Client 只管连接与转发；Host 决定「允不允许」。",
        "权限与确认发生在 **Host 层**：调用工具前弹窗让用户确认，这是 MCP 安全模型的关键设计。",
        "理解角色的意义在于排查问题：连不上 → 查 Client 与传输；工具行为不对 → 查 Server 实现；权限没弹窗 → 查 Host 设置。"
      ],
      summary_en: [
        "**Host** is the app the user runs (Claude Desktop, an IDE): it owns the UI, permissions and user confirmation — it is responsible for safety.",
        "**Client** lives inside the Host and maintains the connection to one server; a host can run several clients for several servers.",
        "**Server** exposes capabilities (tools/resources/prompts) as a local process or remote service.",
        "Clean separation: servers declare capabilities without caring who calls; clients handle transport; the host decides what is allowed.",
        "Permissions and confirmation live at the **host layer** — the confirmation dialog before a tool call is a key part of the security model.",
        "Role knowledge aids debugging: cannot connect → client/transport; wrong tool behaviour → server; no confirmation prompt → host settings."
      ],
      code: "Host（IDE/桌面应用）\n └─ Client ─── stdio/HTTP ─── Server（本地进程或远程服务）\n权限确认：Host 在调用前向用户弹窗",
      pit: "把三个角色混为一谈（比如以为 Server 负责弹确认框）——权限与确认是 **Host** 的职责，Server 只声明能力。",
      pit_en: "Conflating the roles — confirmation is the **host's** job; servers only declare capabilities.",
      ex: {
        q: "「调用工具前向用户确认」是谁的职责？",
        a: "Host：它拥有 UI 与权限体系，在调用前向用户确认；Server 只声明并执行能力。",
        q_en: "Who is responsible for confirming tool calls with the user?",
        a_en: "The host: it owns UI and permissions; servers only declare and execute capabilities."
      }
    },

    "c6l3": {
      title: "MCP 能传什么：Tools / Resources / Prompts", title_en: "MCP Primitives: Tools, Resources, Prompts",
      summary: [
        "MCP 有三类原语，回答「能传什么」：**Tools**（可执行的动作）、**Resources**（可读取的数据）、**Prompts**（可复用的提示模板）。",
        "三者的边界就是「副作用」：Tools 会改变外部状态（发消息、写文件），Resources 只读不改，Prompts 只是文本。",
        "Tools 由**模型决定**何时调用（模型自主选择）；Resources 由**应用/用户**决定何时读取；Prompts 由**用户**显式选择。",
        "设计 Server 时按这个边界拆能力：能做成 Resources 的不要做成 Tools（只读的东西不该有副作用入口）。",
        "Prompts 常被忽略，但它很有用：把团队的最佳问法固化成模板，用户敲个斜杠就能用。",
        "同一份数据可以同时以 Resources 和 Tools 暴露——只读走 Resources，需要参数化查询时走 Tools。"
      ],
      summary_en: [
        "MCP has three primitives answering 'what can be shared': **Tools** (actions), **Resources** (readable data), **Prompts** (reusable templates).",
        "The boundary is side effects: tools change external state, resources are read-only, prompts are just text.",
        "Who decides: the **model** picks tools, the **app/user** picks resources, the **user** picks prompts.",
        "Design servers along this line: anything read-only should be a Resource, not a Tool.",
        "Prompts are underrated: they freeze a team's best phrasings into slash-command templates.",
        "The same data can be exposed both ways — read-only via Resources, parameterised queries via Tools."
      ],
      code: "Tools     → send_email(to, body)        模型决定调用\nResources → file:///notes/llm.md        应用按需读取\nPrompts   → /review-pr                  用户显式选择",
      pit: "把「只读数据」也包装成 Tools——模型可能频繁误调，还平白多出参数校验与副作用的烦恼。",
      pit_en: "Wrapping read-only data as tools invites needless model calls and parameter friction.",
      ex: {
        q: "Tools / Resources / Prompts 的判断标准是什么？",
        a: "看副作用与决策者：有副作用且模型决定 → Tools；只读、按需取 → Resources；预置文案、用户选 → Prompts。",
        q_en: "How do you choose between Tools, Resources and Prompts?",
        a_en: "By side effects and decision-maker: state-changing & model-chosen → tools; read-only on demand → resources; user-picked templates → prompts."
      }
    },

    "c6l4": {
      title: "MCP vs Function Calling 的区别", title_en: "MCP vs Function Calling",
      summary: [
        "两者不是竞争关系，而是**不同层次**：Function Calling 是**模型的能力**（决定调用哪个函数），MCP 是**连接协议**（工具如何被描述、发现与调用）。",
        "可以这么理解：Function Calling 回答「模型怎么决定调工具」，MCP 回答「工具从哪来、怎么连、怎么鉴权」。",
        "配合方式：MCP Server 把工具暴露给 Host，Host 把工具的 schema 通过 Function Calling 交给模型，模型决定调用后由 Host 执行并回传结果。",
        "没有 MCP 也能用 Function Calling——只是每个工具都要自己写接入；有了 MCP，工具的「发现与接入」被标准化了。",
        "迁移角度：已有的 Function Calling 代码不需要推倒重来，MCP 通常作为**工具来源**的一层替换或补充。",
        "一句话：**Function Calling 是引擎，MCP 是标准化的插座**。"
      ],
      summary_en: [
        "They are different layers, not rivals: function calling is a **model capability** (deciding which function to call), MCP is a **connection protocol** (how tools are described, discovered and called).",
        "Function calling answers 'how does the model decide'; MCP answers 'where do tools come from, how do they connect and authenticate'.",
        "They compose: an MCP server exposes tools to the host, the host passes schemas via function calling, the model decides, the host executes and returns results.",
        "Function calling works without MCP — you just hand-wire every tool; MCP standardises discovery and integration.",
        "Migration-wise, existing function-calling code stays; MCP usually replaces or supplements the tool-source layer.",
        "One line: **function calling is the engine; MCP is the standard socket**."
      ],
      code: "模型（Function Calling 决定调用）\n   ↑ schema\nHost（把 MCP 工具转成模型可见的函数）\n   ↑ 协议\nMCP Server（工具的真正实现）",
      pit: "以为「用了 MCP 就不需要 Function Calling」——模型决定调用靠的仍是 Function Calling；MCP 只是换了工具的来源与接入方式。",
      pit_en: "Thinking MCP removes the need for function calling — the model still decides via function calling; MCP only changes where tools come from.",
      ex: {
        q: "MCP 与 Function Calling 是什么关系？",
        a: "互补关系：Function Calling 是模型「决定调用」的能力；MCP 是工具「被发现与接入」的标准化协议，两者配合使用。",
        q_en: "How do MCP and function calling relate?",
        a_en: "They complement: function calling is the model's decision capability; MCP standardises tool discovery and integration."
      }
    },

    "c6l5": {
      title: "自己搭一个 MCP Server", title_en: "Building Your Own MCP Server",
      summary: [
        "搭一个最小 Server 只需要三步：**声明工具**（名字、描述、参数 schema）→ **实现处理函数** → **注册传输**（stdio 或 HTTP）。",
        "工具的 description 是给模型看的「使用说明书」：写清楚什么时候该用、参数含义，模型调用的准确率直接取决于它。",
        "参数 schema 要精确：类型、必填、枚举值、默认值——越精确，模型填错参数的概率越低。",
        "返回值要对模型友好：返回结构化文本（而不是二进制），出错时返回可读的错误信息而不是抛异常堆栈。",
        "最小可行做法是「包装一个你已有的能力」：把团队里常用的脚本、查询、API 包成工具，立刻就有价值。",
        "安全三查：这个工具能不能改数据？能不能外发？出错时的爆炸半径多大——按答案决定是否需要 Host 层确认。"
      ],
      summary_en: [
        "A minimal server is three steps: **declare tools** (name, description, parameter schema) → **implement handlers** → **register transport** (stdio or HTTP).",
        "The tool description is the model's manual: when to use it and what parameters mean — call accuracy depends directly on it.",
        "Make schemas precise: types, required flags, enums and defaults reduce wrong arguments.",
        "Return model-friendly results: structured text, not binary; readable errors, not stack traces.",
        "The fastest win is wrapping an existing capability — a team script, query or API — as a tool.",
        "Safety triage: can it modify data, send things out, and how big is the blast radius on failure?",
      ],
      code: "server.tool(\n  \"get_ticket\",\n  \"查询工单详情，参数为工单 ID\",\n  { id: z.string().describe(\"工单 ID，如 T-1024\") },\n  async ({ id }) => ({ content: [{ type: \"text\", text: JSON.stringify(await db.get(id)) }] })\n);",
      pit: "工具描述写得含糊（「查询数据」）——模型无法判断什么时候该用它，调用准确率会明显下降。",
      pit_en: "Vague tool descriptions ('query data') leave the model unable to judge when to call, dropping accuracy.",
      ex: {
        q: "MCP Server 里最重要的是什么？",
        a: "工具的描述与参数 schema：它们是模型的「使用说明书」，直接决定模型能否正确选择与调用工具。",
        q_en: "What matters most in an MCP server?",
        a_en: "Tool descriptions and parameter schemas — they are the model's manual and decide call accuracy."
      }
    },

    "c6l6": {
      title: "Resources：把资料喂给模型（只读原语）", title_en: "Resources: Feeding Material In (Read-only)",
      summary: [
        "Resources 是 MCP 里「只读的资料」：文件、数据库记录、网页、日志，用 URI 标识，读取不产生副作用。",
        "它和 Tools 的分工很清楚：Resources 提供上下文（读），Tools 执行动作（做）。模型需要「知道」，就读 Resource；需要「改变世界」，才调 Tool。",
        "客户端还会用 Roots 告诉服务器「能访问哪些目录」，把资源访问限制在安全边界内。",
        "设计资源时要想清楚粒度：一整个文件？某个目录列表？还是某条记录——粒度越细，越能按需取用、避免塞爆上下文。",
        "大文件不要一次性作为 Resource 暴露：应配合检索或分页，按需读取相关片段。",
        "资源内容发生变化时，Server 可以通过通知机制让客户端知道（订阅更新），避免用到过期数据。"
      ],
      summary_en: [
        "Resources are MCP's read-only material: files, database records, web pages, logs — identified by URI, read without side effects.",
        "The split with tools is clean: resources supply context (read), tools perform actions (do).",
        "The client uses Roots to tell the server which directories it may touch, keeping access inside a safe boundary.",
        "Design granularity deliberately: a whole file, a directory listing or a single record — finer granularity avoids blowing up the context.",
        "Never expose a huge file as one resource: pair it with retrieval or pagination and read slices on demand.",
        "Servers can notify clients when resource contents change (subscriptions), preventing stale data."
      ],
      code: "Resource 示例：\n  file:///notes/llm.md        一份笔记\n  db://orders/1024            一条订单记录\n  https://docs.example.com    一个网页\n\n流程：list(resources) → read(uri) → 拼进上下文",
      pit: "把整本手册当 Resource 一次性读进来——上下文会被塞爆；应按需读取，或配合检索只取相关片段。",
      pit_en: "Reading an entire handbook as one resource blows up the context; read slices on demand.",
      ex: {
        q: "Resources 与 Tools 的边界是什么？",
        a: "Resources 只读、提供上下文、无副作用；Tools 会执行动作、改变外部状态。",
        q_en: "Where is the line between Resources and Tools?",
        a_en: "Resources are read-only context with no side effects; tools act and change external state."
      }
    },

    "c6l7": {
      title: "Transport：stdio 与 HTTP/SSE 怎么选", title_en: "Transport: stdio vs HTTP/SSE",
      summary: [
        "MCP 把「说什么」和「怎么传」分开：能力设计用 Tools / Resources / Prompts，传输方式交给 Transport。",
        "本地最常用 **stdio**——Server 就是宿主拉起的子进程，用标准输入输出传 JSON-RPC；简单、隔离好、无需网络。",
        "远程用 **Streamable HTTP / SSE**：Server 部署在服务端供多人共享，必须补上鉴权、TLS 与重连。",
        "stdio 的优势是安全与简单：进程随 Host 启停、天然隔离；劣势是无法多人共享、不能远程。",
        "HTTP 的优势是共享与集中管理（一处升级全员生效）；劣势是要处理鉴权、网络与多租户隔离。",
        "换 Transport 不需要改 Server 的能力语义——这正是「能力与传输分离」设计的价值。"
      ],
      summary_en: [
        "MCP separates what is said from how it travels: capability design uses Tools / Resources / Prompts, while transport decides delivery.",
        "Locally the norm is **stdio** — the server is a child process the host spawns, exchanging JSON-RPC over stdin/stdout: simple, isolated, no network.",
        "Remote uses **Streamable HTTP / SSE**: a shared server that must add auth, TLS and reconnect logic.",
        "stdio wins on safety and simplicity (the process lives and dies with the host) but cannot be shared or remote.",
        "HTTP wins on sharing and central upgrades; it costs auth, networking and multi-tenant isolation.",
        "Swapping transport does not change capability semantics — the value of separating capability from transport."
      ],
      code: "本地：Host ──stdio(JSON-RPC)──▶ Server 子进程\n远程：Host ──HTTPS + SSE/Streamable──▶ 线上 Server\n远程必备：Authorization / OAuth、TLS、重连与超时",
      pit: "远程传输忘了鉴权与来源校验——等于在公网开了一个「任意工具调用」的入口。",
      pit_en: "Remote transport without auth or origin checks opens a public 'call any tool' doorway.",
      ex: {
        q: "stdio 与远程 Transport 各自适合什么场景？",
        a: "stdio 简单、隔离好，适合本地单机；远程便于共享与托管，但必须补齐鉴权、TLS 与重连。",
        q_en: "When do you pick stdio vs remote transport?",
        a_en: "stdio for local single-machine use; remote (with auth, TLS, reconnect) for shared or hosted servers."
      }
    },

    "c6l8": {
      title: "MCP 的安全边界与权限", title_en: "MCP: Security Boundaries & Permissions",
      summary: [
        "MCP 让模型能做的事变多，风险也随之放大：越权读文件、误删数据、把敏感内容外发。",
        "落地抓四条：**能力最小化**（只暴露必需的工具与资源）、**目录边界**（Roots）、**写操作人工确认**、**全程审计日志**。",
        "第三方 Server 要像对待第三方代码一样审查：它声明了什么能力、要访问什么、会不会联网。",
        "权限确认的体验要设计： confirmation 太多用户会盲点，太少则失去保护——把确认留给**真正危险的动作**。",
        "审计日志要记全：每次工具调用的入参、结果、时间与是否被用户批准——出事后这是唯一能还原现场的依据。",
        "最小权限原则同样适用于资源：Roots 限定目录、按需暴露文件，而不是整个磁盘。"
      ],
      summary_en: [
        "MCP multiplies what the model can do, and with it the risk: unauthorised reads, accidental deletion, sensitive data exfiltration.",
        "Four practices: **least capability**, **directory boundaries (Roots)**, **human confirmation for writes**, and **full audit logging**.",
        "Vet third-party servers like third-party code: what capabilities do they declare, what do they access, do they phone home?",
        "Design the confirmation UX: too many prompts get blindly accepted, too few lose protection — reserve them for **genuinely dangerous actions**.",
        "Log everything: inputs, results, timestamps and whether the user approved — the only way to reconstruct an incident.",
        "Least privilege applies to resources too: bound with Roots and expose files on demand, not the whole disk."
      ],
      code: "上线前检查：\n  □ 只暴露必需的 Tools / Resources\n  □ 用 Roots 限定可访问目录\n  □ 写/删/发类操作要求人工确认\n  □ 记录每次工具调用的入参与结果\n  □ 第三方 Server 先读权限声明",
      pit: "只因为「能跑」就把社区 Server 挂上，还给了全盘读写权限——出事只是时间问题。",
      pit_en: "Mounting a community server just because it runs — with full disk read/write — makes an incident a matter of time.",
      ex: {
        q: "给 MCP Server 授权时最容易犯的错是什么？",
        a: "图省事给全盘／全权限，而不是按最小权限只暴露必要的工具与目录。",
        q_en: "The most common mistake when authorising an MCP server?",
        a_en: "Granting full disk or full permissions for convenience instead of exposing only what is needed."
      }
    },

    /* ===== c7 Agent 智能体 ===== */
    "c7l1": {
      title: "什么是 Agent：会“自己想办法”的模型", title_en: "What Is an Agent",
      summary: [
        "Agent = **LLM + 自主循环 + 工具**：模型不再只是回答，而是围绕一个目标自己决定「下一步做什么」，直到任务完成。",
        "与普通对话的区别在于**自主性**：对话是你问它答，Agent 是你给目标、它自己拆步骤、选工具、执行并验证。",
        "支撑它的是三件事：**规划**（拆解目标）、**工具**（与外部世界交互）、**记忆**（跨步骤保持信息）。",
        "Agent 的能力边界由工具决定：没有文件工具就改不了文件，没有搜索工具就查不了资料——工具清单就是能力清单。",
        "自主性也带来风险：它会「自作主张」走偏，所以必须有**终止条件**与**最大步数**限制。",
        "判断是否需要 Agent 的标准：任务是否需要多步、是否需要外部信息或操作、步骤是否难以预先写死——三者皆是才值得上 Agent。"
      ],
      summary_en: [
        "An agent = **LLM + autonomous loop + tools**: instead of just answering, it decides what to do next toward a goal until the task is done.",
        "The difference from chat is **autonomy**: you give a goal and it plans, picks tools, executes and verifies by itself.",
        "Three pillars: **planning** (decompose goals), **tools** (interact with the world), **memory** (keep information across steps).",
        "Its capability boundary is the tool list: no file tools means no file edits; no search means no research.",
        "Autonomy brings risk: it can wander, so you need **termination conditions** and a **max-step cap**.",
        "When to use an agent: multi-step, needs external information or actions, and steps are hard to pre-script — all three."
      ],
      code: "while (not done and steps < MAX):\n    thought = llm(目标 + 历史 + 工具列表)\n    action  = 解析(thought)        # 调用哪个工具、参数是什么\n    result  = 执行(action)\n    历史.append(result)",
      pit: "没有设置最大步数与终止条件——Agent 陷入循环反复调用同一个工具，token 与时间双爆炸。",
      pit_en: "No max-step cap or termination condition — the agent loops on the same tool, burning tokens and time.",
      ex: {
        q: "Agent 与「带工具的对话」的本质区别是什么？",
        a: "对话是你主导每一步；Agent 自己决定下一步（规划、选工具、执行、验证），只在必要时向你确认。",
        q_en: "What separates an agent from a chat with tools?",
        a_en: "In chat you drive each step; an agent plans, selects tools, executes and verifies on its own."
      }
    },

    "c7l2": {
      title: "ReAct：思考—行动—观察", title_en: "ReAct: Reason, Act, Observe",
      summary: [
        "ReAct 是 Agent 最经典的循环模式：**Thought**（思考要做什么）→ **Action**（调用工具）→ **Observation**（观察结果）→ 再思考，如此往复。",
        "它的价值在于把「推理」和「行动」交替进行：每一步行动都基于当前最新的观察，而不是一次性规划到底。",
        "Observation 这一步**绝不能省**：工具的结果是下一步决策的依据，跳过它等于蒙着眼睛走路。",
        "Thought 的质量取决于提示：要让模型「先想清楚再行动」，并明确它有哪些工具可用。",
        "循环要有出口：任务完成、达到最大步数、或连续 N 次失败——三个终止条件缺一不可。",
        "调试 Agent 的第一步就是**打印完整循环**：每一步的 Thought / Action / Observation 摊开看，问题立刻现形。"
      ],
      summary_en: [
        "ReAct is the classic agent loop: **Thought** (what to do) → **Action** (call a tool) → **Observation** (read the result) → repeat.",
        "Its value is interleaving reasoning with action: each action is based on the latest observation rather than a one-shot plan.",
        "The Observation step is **never optional** — tool results drive the next decision; skipping it is walking blindfolded.",
        "Thought quality depends on the prompt: ask the model to think before acting and list the available tools.",
        "The loop needs exits: task complete, max steps reached, or N consecutive failures — all three.",
        "Debugging starts with printing the full loop; Thought/Action/Observation laid out exposes problems immediately."
      ],
      code: "Thought: 我需要先查用户信息，再查订单。\nAction: get_user(user_id=42)\nObservation: {\"name\": \"Tom\", \"vip\": true}\nThought: 是 VIP，优先处理。\nAction: get_orders(user_id=42, limit=5)\nObservation: [...]\n…",
      pit: "Observation 结果太长时不做裁剪，直接塞回上下文——几轮之后窗口就被工具输出撑爆。",
      pit_en: "Not trimming long tool outputs before appending them blows up the window within a few rounds.",
      ex: {
        q: "为什么 Observation 不能省略？",
        a: "Observation 是下一步思考的依据；省略它，模型只能凭想象继续，等于在真实环境里盲操作。",
        q_en: "Why is Observation indispensable?",
        a_en: "It is the evidence for the next thought; without it the model acts on imagination."
      }
    },

    "c7l3": {
      title: "规划、工具与记忆", title_en: "Planning, Tools & Memory",
      summary: [
        "**规划**是把大目标拆成可执行的子任务：好的规划能减少无效循环，差的规划会让 Agent 在细节里打转。",
        "规划两种做法：让模型一次性列出全部步骤（计划式），或每步动态决定（渐进式）——前者可控、后者灵活，常混合使用。",
        "**工具**是 Agent 的手脚：工具描述写得越清楚（何时用、参数含义、返回什么），选择就越准确。",
        "工具不宜过多：超过十几个后模型的选择准确率会下降，应按任务分组或动态启用。",
        "**记忆**分两层：短期记忆（当前上下文里的对话与观察）与长期记忆（外部存储，需要时检索回来）。",
        "长期记忆通常用 RAG 实现：把关键结论写入向量库，下一轮按需取回——等于给 Agent 配了一个可检索的笔记本。"
      ],
      summary_en: [
        "**Planning** decomposes a big goal into executable sub-tasks; good planning cuts wasted loops, bad planning spins in details.",
        "Two styles: list all steps upfront (plan-style) or decide dynamically each step (incremental) — often mixed.",
        "**Tools** are the agent's hands: the clearer the descriptions (when to use, parameters, returns), the more accurate the choice.",
        "Don't offer too many tools: past a dozen, selection accuracy drops; group or enable them dynamically.",
        "**Memory** has two layers: short-term (context) and long-term (external storage retrieved on demand).",
        "Long-term memory is usually RAG: write key conclusions to a vector store and retrieve them next round — a searchable notebook."
      ],
      code: "规划式：\n  1) 让模型先输出步骤清单（可人工确认）\n  2) 逐步执行，每步可回退\n渐进式：\n  每轮让模型在「继续/换方法/结束」中决策",
      pit: "给 Agent 塞二十个工具而不分组——选择空间过大，模型经常选错工具或填错参数。",
      pit_en: "Offering twenty tools ungrouped enlarges the choice space and breeds wrong tools and bad arguments.",
      ex: {
        q: "Agent 的长期记忆通常怎么实现？",
        a: "把关键结论写入外部存储（常见是向量库），下一轮按需检索回上下文——本质就是 RAG。",
        q_en: "How is long-term agent memory usually implemented?",
        a_en: "Write key points to external storage (often a vector DB) and retrieve them into context on demand — RAG."
      }
    },

    "c7l4": {
      title: "多 Agent 协作", title_en: "Multi-Agent Collaboration",
      summary: [
        "多 Agent 是把一个复杂任务拆给多个各有分工的 Agent：例如「研究员负责查资料、写手负责成稿、审稿人负责挑错」。",
        "它的价值是**职责分离**：每个 Agent 的提示更聚焦、上下文更干净，也便于单独优化与测试。",
        "常见协作模式：**流水线**（A 的输出是 B 的输入）、**分工协作**（并行处理再汇总）、**审查者**（一个生成、一个挑错）。",
        "代价是复杂度：通信协议、错误传播、成本翻倍——**能用单 Agent 解决就不要上多 Agent**。",
        "多 Agent 的通信要结构化：传递的不是「一段话」，而是明确的数据结构（任务、结果、状态），否则信息在传递中失真。",
        "务必有「总控」角色：负责分配任务、汇总结果与最终决策，避免多个 Agent 各说各话。"
      ],
      summary_en: [
        "Multi-agent splits a complex task among specialised agents: a researcher gathers, a writer drafts, a critic reviews.",
        "The value is **separation of concerns**: focused prompts, cleaner contexts, and independently testable parts.",
        "Common patterns: **pipeline** (A's output feeds B), **parallel split-and-merge**, and **generator-critic**.",
        "The cost is complexity: protocols, error propagation and doubled spend — **use one agent if it suffices**.",
        "Communication must be structured: pass explicit data structures (task, result, status), not prose, or meaning decays.",
        "Always have an orchestrator: assign tasks, merge results and make the final call."
      ],
      code: "researcher = Agent(角色=\"资料收集\", 工具=[search])\nwriter     = Agent(角色=\"成稿\", 工具=[])\ncritic     = Agent(角色=\"审稿\", 工具=[])\n\nfacts = researcher.run(主题)\ndraft = writer.run(主题, facts)\nfinal = critic.run(draft) 或 writer.run(draft, critic 意见)",
      pit: "为了「看起来高级」上多 Agent——通信与调试成本翻倍，效果却未必比一个精心设计的单 Agent 好。",
      pit_en: "Adopting multi-agent for prestige doubles communication and debugging cost, often with no gain over one well-designed agent.",
      ex: {
        q: "什么时候才值得上多 Agent？",
        a: "当任务能清晰拆成「职责不同、可并行或需相互审查」的多个角色，且单 Agent 的上下文已经装不下时。",
        q_en: "When is multi-agent worth it?",
        a_en: "When the task splits into distinct roles that are parallel or need mutual review, and one agent's context cannot hold it."
      }
    },

    "c7l5": {
      title: "Agent 的失败模式", title_en: "Agent Failure Modes",
      summary: [
        "失败模式一：**无限循环**——反复调用同一工具、或任务已完成仍在继续；解法是最大步数 + 完成判定的显式化。",
        "失败模式二：**工具误用**——选错工具、参数填错、或在只读工具上期待副作用；解法是写清工具描述与参数校验。",
        "失败模式三：**上下文溢出**——工具输出与历史堆积超出窗口；解法是裁剪、摘要与只保留关键字段。",
        "失败模式四：**目标漂移**——做着做着偏离了原始目标；解法是在每轮提示里重申目标与已完成进度。",
        "失败模式五：**过早放弃或过度自信**——没试几次就宣布失败，或连续成功后跳过验证；两者都要靠提示与流程约束。",
        "通用兜底：所有 Agent 都要有「降级方案」——失败时把已完成的部分与原因输出给用户，而不是静默返回垃圾。"
      ],
      summary_en: [
        "Failure 1: **infinite loops** — repeating the same tool or continuing after completion; fix with max steps and explicit completion checks.",
        "Failure 2: **tool misuse** — wrong tool, wrong arguments, or expecting side effects from read-only tools; fix with better descriptions and validation.",
        "Failure 3: **context overflow** — tool outputs and history fill the window; fix with trimming, summarising and keeping only key fields.",
        "Failure 4: **goal drift** — wandering from the original goal; restate the goal and progress in every turn.",
        "Failure 5: **premature giving up or overconfidence** — quitting after a few tries or skipping verification after wins; constrain via prompts and process.",
        "Universal fallback: every agent needs a degraded path — output what was done and why it failed instead of silently returning junk."
      ],
      code: "终止条件（三选一即停）：\n  1) 模型明确宣布任务完成\n  2) steps >= MAX_STEPS\n  3) 连续 3 次工具调用失败\n兜底：失败时输出 {done: [], failed: 原因, partial: 已完成部分}",
      pit: "失败时静默返回空结果——调用方无法区分「做完了但没结果」和「根本没做成」，排障成本极高。",
      pit_en: "Returning empty results on failure makes 'done with nothing' indistinguishable from 'never ran'.",
      ex: {
        q: "Agent 最危险的失败模式是哪种？",
        a: "静默失败：不报错、不说明，返回看似正常实则错误的结果——它不会打断流程，却会污染下游。",
        q_en: "Which failure mode is most dangerous?",
        a_en: "Silent failure: plausible-looking wrong output that neither interrupts nor flags itself."
      }
    },

    "c7l6": {
      title: "记忆：短期上下文与长期记忆", title_en: "Memory: Short-term vs Long-term",
      summary: [
        "Agent 的记忆分两层：短期记忆就是当前上下文窗口里的对话与观察；长期记忆是外部存储，需要时再检索回来。",
        "长期记忆通常用 RAG 实现：把要点写进向量库或数据库，下一轮按相似度取回，等于给 Agent 配了一个可检索的笔记本。",
        "记忆要做「写什么」的取舍：沉淀**关键结论与用户偏好**，别把整段原始对话都存进去——噪声比信息还多。",
        "短期记忆的管理是裁剪与摘要：保留最近 N 轮 + 对更早内容做摘要，system 提示永远保留。",
        "写入时机很讲究：任务结束、用户纠正模型、出现明确偏好时才写——不是每轮都写。",
        "检索回来的记忆要标注来源与时间，过期记忆（如用户已取消的偏好）要及时失效。"
      ],
      summary_en: [
        "Agent memory has two layers: short-term is the context window (dialogue and observations); long-term is external storage retrieved on demand.",
        "Long-term memory is usually RAG: write key points to a vector store or database and fetch them next round — a searchable notebook.",
        "Memory requires a 'what to write' judgement: persist **conclusions and user preferences**, not raw transcripts — noise outweighs signal.",
        "Short-term memory is managed by trimming and summarising: keep the last N turns plus a summary; always keep system.",
        "Write timing matters: at task end, when the user corrects the model, or on explicit preferences — not every turn.",
        "Retrieved memories should carry source and time, and stale ones (revoked preferences) must be invalidated."
      ],
      code: "短期：context = 系统提示 + 历史 + 本轮观察（随轮次增长，需截断或摘要）\n长期：关键结论 → 向量库 / 数据库 → 下一轮按需检索回上下文",
      pit: "把全部对话原文塞进长期记忆，检索时噪声比信息还多；应先抽取要点再存。",
      pit_en: "Dumping whole transcripts into long-term memory makes retrieval mostly noise; extract key points first.",
      ex: {
        q: "Agent 的长期记忆通常怎么实现？",
        a: "把要点写入外部存储（常见是向量库），下一轮按需检索回上下文——本质就是 RAG。",
        q_en: "How is long-term agent memory usually implemented?",
        a_en: "Write key points to external storage (often a vector DB) and retrieve them into context on demand — RAG."
      }
    }
  },

  /* ---------- 题库：每章 +3（对准深化新增知识点） ---------- */
  quizAdd: {
    c4: [
      { q: "规则类的指令应该放在 messages 的哪个位置？", o: ["user 消息里", "system 消息里", "assistant 消息里", "随便哪个"], a: 1,
        why: "system 位于数组开头且不会被历史裁剪带走，能稳定约束整轮对话。", type: "choice" },
      { q: "少样本示例最需要保证的是？", o: ["数量越多越好", "例子之间标准一致", "覆盖所有可能", "例子越长越好"], a: 1,
        why: "例子标准不一致会让模型学到噪声，输出变得随机。", type: "choice" },
      { q: "改了提示词之后，判断是否真的变好的依据是？", o: ["自己读一遍感觉更好", "同一评测集改前改后的数字对比", "模型自己说更好", "换个人看一眼"], a: 1,
        why: "提示词影响行为，必须用同一批样例、同一标准的数字对比来证明。", type: "choice" }
    ],
    c5: [
      { q: "RAG 检索质量最关键的环节是？", o: ["换更强的生成模型", "切片与检索策略", "提高 temperature", "增加输出长度"], a: 1,
        why: "检索不到就生成不好；切片方式直接决定「模型能看到的最小知识单元」。", type: "choice" },
      { q: "把检索到的片段直接拼进上下文而不做标注，主要问题是？", o: ["更耗 token", "模型无法区分依据与普通文本，也不会给引用", "模型会拒绝回答", "速度变慢"], a: 1,
        why: "标注序号与来源才能让答案可追溯，也才能要求模型只依据资料回答。", type: "choice" },
      { q: "扫描件 PDF 不能直接检索，需要先做什么？", o: ["压缩", "OCR 识别", "合并", "加密"], a: 1,
        why: "扫描件没有文字层，必须 OCR 之后才能检索、复制与引用。", type: "choice" }
    ],
    c6: [
      { q: "「调用工具前向用户确认」是谁的职责？", o: ["Server", "Client", "Host", "模型"], a: 2,
        why: "Host 拥有 UI 与权限体系，在调用前向用户确认；Server 只声明并执行能力。", type: "choice" },
      { q: "把只读数据包装成 MCP Tools 暴露，主要问题是？", o: ["无法被模型发现", "模型可能频繁误调，且平白多出参数与副作用烦恼", "速度太慢", "不兼容 stdio"], a: 1,
        why: "只读数据应该用 Resources 暴露；Tools 用于有副作用的动作。", type: "choice" },
      { q: "stdio 与远程 HTTP 传输之间切换，需要重写 Server 的能力实现吗？", o: ["需要", "不需要，能力与传输是分离的", "只有 Tools 需要重写", "Resources 需要重写"], a: 1,
        why: "MCP 把能力设计与传输方式分离，换传输不改变能力语义。", type: "choice" }
    ],
    c7: [
      { q: "Agent 循环中绝对不能省略的环节是？", o: ["Thought", "Action", "Observation", "总结"], a: 2,
        why: "Observation 是下一步思考的依据；省略它等于盲操作。", type: "choice" },
      { q: "Agent 的长期记忆通常怎么实现？", o: ["把所有对话原文存起来", "要点写入外部存储，按需检索回上下文", "每次都重新告诉模型", "存在模型权重里"], a: 1,
        why: "本质是 RAG：先抽取要点再存，检索时才有信噪比。", type: "choice" },
      { q: "Agent 最危险的失败模式是？", o: ["无限循环", "工具误用", "静默失败（返回看似正常实则错误的结果）", "上下文溢出"], a: 2,
        why: "静默失败不会打断流程，却会污染下游，且最难被发现。", type: "choice" }
    ]
  },

  /* ---------- 关系图扩展（+6 节点 / +10 边） ---------- */
  mapAdd: {
    nodes: [
      { id: "System Prompt", tier: 2 },
      { id: "Few-shot", tier: 2 },
      { id: "Chain of Thought", tier: 2 },
      { id: "Hallucination", tier: 2 },
      { id: "Chunking", tier: 2 },
      { id: "ReAct", tier: 2 }
    ],
    edges: [
      { a: "System Prompt", b: "Prompt", zh: "最稳定的规则位置", en: "the most stable rules" },
      { a: "Few-shot", b: "Prompt", zh: "用示例定格式", en: "formats by example" },
      { a: "Chain of Thought", b: "Prompt", zh: "先推理再作答", en: "reason then answer" },
      { a: "Hallucination", b: "LLM", zh: "生成机制的副产品", en: "a by-product of generation" },
      { a: "Chunking", b: "RAG", zh: "检索质量的关键", en: "the key to retrieval quality" },
      { a: "Chunking", b: "Vector DB", zh: "切片后入库", en: "chunks go into the store" },
      { a: "ReAct", b: "Agent", zh: "经典循环模式", en: "the classic loop" },
      { a: "ReAct", b: "Agent Loop", zh: "循环的具体形态", en: "the loop in practice" },
      { a: "Hallucination", b: "RAG", zh: "用检索给出依据", en: "retrieval grounds answers" },
      { a: "Few-shot", b: "Inference", zh: "推理时的上下文", en: "context at inference" }
    ]
  },

  /* ---------- 词典扩展（+8） ---------- */
  terms: [
    { term: "System Prompt", term_en: "System Prompt", short: "位于 messages 开头、对整轮对话持续生效的规则区。",
      short_en: "The rules at the head of messages that apply to the whole conversation.",
      detail: ["不会被历史裁剪带走，是最稳定的约束位置。", "骨架：身份 + 能力边界 + 输出格式 + 禁止事项。"],
      vs: "system 定规则，user 给内容。", vs_en: "system sets rules; user brings content." },
    { term: "少样本示例", term_en: "Few-shot Examples", short: "在提示里给 2~5 个输入→输出的例子，让模型照着做。",
      short_en: "2–5 input→output examples the model copies.",
      detail: ["例子之间必须标准一致，否则学到噪声。", "要包含边界样例，定义异常时的行为。"],
      vs: "少样本胜在直观，详细规则胜在精确。", vs_en: "Few-shot is intuitive; detailed rules are precise." },
    { term: "Chain of Thought", term_en: "Chain of Thought", short: "要求模型先写推理过程再给结论，提升多步问题准确率。",
      short_en: "Asking the model to reason before concluding, improving multi-step accuracy.",
      detail: ["把一步猜答案拆成若干可验证的小步。", "简单任务不必用：会更慢更贵。"],
      vs: "思维链换准确率，直接回答换速度。", vs_en: "Chain of thought buys accuracy; direct answers buy speed." },
    { term: "幻觉", term_en: "Hallucination", short: "语言上合理但缺乏依据的回答，生成机制的自然产物。",
      short_en: "Plausible but unsupported answers — a natural product of generation.",
      detail: ["高发于时效事实、私有知识与长尾细节。", "对策：检索、要求引用、允许说不知道。"],
      vs: "幻觉管「没依据」，grounding 管「有依据」。", vs_en: "Hallucination lacks grounding; grounding provides it." },
    { term: "切片", term_en: "Chunking", short: "把长文档切成适合检索的小段，往往比换模型更影响效果。",
      short_en: "Splitting documents into retrievable pieces — often more impactful than swapping models.",
      detail: ["常见 300~800 字 + 相邻段重叠。", "按结构（标题/段落）切优于按字数切。"],
      vs: "切片定最小知识单元，检索决定取哪些。", vs_en: "Chunking defines the unit; retrieval picks them." },
    { term: "ReAct", term_en: "ReAct", short: "Agent 经典循环：思考 → 行动 → 观察，往复直到完成。",
      short_en: "The classic agent loop: thought → action → observation, repeating until done.",
      detail: ["Observation 绝不能省，它是下一步的依据。", "循环要有出口：完成、最大步数、连续失败。"],
      vs: "ReAct 是模式，Agent Loop 是实现。", vs_en: "ReAct is the pattern; the agent loop is the implementation." },
    { term: "自我纠错", term_en: "Self-correction", short: "让模型对自己的输出做一次检查并修正。",
      short_en: "Asking the model to review and correct its own output.",
      detail: ["对格式类任务特别有效（把 schema 一起给过去）。", "不能替代程序侧校验，成本会翻倍。"],
      vs: "自我纠错提质量，程序校验守底线。", vs_en: "Reflection improves; program-side checks guarantee." },
    { term: "提示词版本管理", term_en: "Prompt Versioning", short: "把提示词当代码管理：存档、可回滚、可追溯。",
      short_en: "Managing prompts like code: archived, rollback-able, traceable.",
      detail: ["每次改动必须跑评测集，用数字对比。", "小步修改，一次只改一处。"],
      vs: "版本管理防退化，A/B 测试定优劣。", vs_en: "Versioning prevents regressions; A/B decides winners." }
  ],

  /* ---------- 学习节奏（c4–c7 每节建议时长） ---------- */
  minMap: {
    "c4l1": 12, "c4l2": 14, "c4l3": 12, "c4l4": 12, "c4l5": 12, "c4l6": 12,
    "c5l1": 12, "c5l2": 14, "c5l3": 14, "c5l4": 12,
    "c6l1": 10, "c6l2": 12, "c6l3": 12, "c6l4": 12, "c6l5": 14, "c6l6": 12, "c6l7": 12, "c6l8": 12,
    "c7l1": 12, "c7l2": 14, "c7l3": 12, "c7l4": 12, "c7l5": 14, "c7l6": 14
  },

  /* ---------- 关系图/词典/成就 的英文 ---------- */
  termEnMap: {
    "System Prompt": "System Prompt", "少样本示例": "Few-shot Examples", "思维链": "Chain of Thought",
    "幻觉": "Hallucination", "切片": "Chunking", "ReAct": "ReAct",
    "自我纠错": "Self-correction", "提示词版本管理": "Prompt Versioning"
  },

  /* ---------- 成就扩展（由主页面合并进 ACHIEVEMENTS） ---------- */
  achievements: [
    { id: "prompt_master", icon: "✍️", name: "提示词大师", name_en: "Prompt Master",
      desc: "完成 c4 · 提示词工程 全部课节", desc_en: "Finish all lessons of c4 Prompt Engineering",
      check: "prompt_master" },
    { id: "rag_builder", icon: "🔎", name: "检索工程师", name_en: "RAG Engineer",
      desc: "完成 c5 · 检索增强 全部课节", desc_en: "Finish all lessons of c5 RAG",
      check: "rag_builder" },
    { id: "mcp_explorer", icon: "🔌", name: "协议探索者", name_en: "Protocol Explorer",
      desc: "完成 c6 · MCP 协议 全部课节", desc_en: "Finish all lessons of c6 MCP",
      check: "mcp_explorer" },
    { id: "agent_designer", icon: "🤖", name: "智能体设计师", name_en: "Agent Designer",
      desc: "完成 c7 · Agent 智能体 全部课节", desc_en: "Finish all lessons of c7 Agents",
      check: "agent_designer" },
    { id: "quiz_five", icon: "✅", name: "测评达人", name_en: "Quiz Veteran",
      desc: "完成 5 个章节的测评", desc_en: "Complete quizzes for 5 chapters",
      check: "quiz_five" }
  ]
};
