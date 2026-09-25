/* ================================================================
 * R0:hello agent · 课程深化层 ①（c1–c3）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 目的：把每节从「3 要点」深化到「6~7 要点」，补齐
 *       「是什么 / 为什么这样设计 / 什么时候会出错」的完整讲法。
 * ★ id 与标题必须与主数据完全一致（本层只替换内容，不改标题），
 *   否则会把真实课节覆盖成别的内容。
 * ================================================================ */

const DEEPEN_AGENT_A = {
  stages: ["c1", "c2", "c3"],
  lessons: {

    /* ===== c1 大模型是什么 ===== */
    "c1l1": {
      title: "什么是大语言模型：从“预测下一个词”说起", title_en: "What Is an LLM: Predicting the Next Token",
      summary: [
        "大语言模型的核心任务极其朴素：**根据前文预测下一个最可能出现的词**，把新词接回前文再继续预测——这个循环就生成了完整段落。",
        "这个单一目标之所以能撑起写作、问答、翻译、写代码，是因为要预测得准，模型必须真的学会语法、事实、逻辑甚至一点常识；能力是训练出来的副产品，而不是被逐条教会的。",
        "「大」体现在两处：**参数量**（模型容量，常用 B 表示）与**训练数据量**（见过的文本规模），两者共同决定上限。",
        "它是**统计模型而不是数据库**：不查找答案，而是按概率生成；所以会自信地说出错误内容（幻觉），这是生成式机制的自然结果，不是 bug。",
        "同一个模型能胜任多种任务，靠的是「上下文里的指令」而不是重新训练——这正是提示词工程（c4）能起作用的前提。",
        "理解这一点会改变你的使用方式：与其问「它知道吗」，不如问「我给了它足够的上下文和约束吗」。"
      ],
      summary_en: [
        "An LLM's core task is simple: **predict the most likely next token**, append it, and repeat — that loop produces whole paragraphs.",
        "This one objective supports writing, Q&A, translation and coding because predicting well forces the model to internalise grammar, facts and logic; capability is a by-product, not a taught list.",
        "'Large' means two things: **parameter count** (capacity, in billions) and **training data volume** — together they set the ceiling.",
        "It is a **statistical model, not a database**: it generates by probability, so confident errors (hallucination) are an inherent consequence, not a bug.",
        "One model handles many tasks because instructions live in the context, not in retraining — which is why prompt engineering (c4) works.",
        "This reframes usage: instead of 'does it know?', ask 'did I give it enough context and constraints?'"
      ],
      code: "输入：今天天气很\n输出概率：好(0.31) / 不错(0.22) / 热(0.15) / …\n采样 → \"好\" → 拼回前文 → 再预测下一个词",
      pit: "把模型当知识库用（相信它说的每个事实），而不是当生成器用（给它依据、要求引用）——这是幻觉事故最常见的成因。",
      pit_en: "Treating the model as a knowledge base instead of a generator is the usual cause of hallucination incidents.",
      ex: {
        q: "为什么「预测下一个词」能涌现出问答、写作、写代码这些能力？",
        a: "因为要预测得准，模型必须学会语法、事实、逻辑与领域惯例——这些能力是压缩海量文本时的副产品，不是被单独教会的。",
        q_en: "Why does such a simple objective produce Q&A, writing and coding abilities?",
        a_en: "Predicting well requires internalising grammar, facts and conventions; the abilities emerge as by-products of compressing massive text."
      }
    },

    "c1l2": {
      title: "Token 与分词：模型怎么“读”文字", title_en: "Tokens & Tokenisation",
      summary: [
        "模型不按字符也不按整词读文本，而是按 **token**（词元）：常见词是一个 token，生僻词或长词会被切成几段。",
        "中文大致 1 个字约 1~2 个 token，英文一个单词约 1~3 个 token（长词拆成词根片段）。",
        "token 重要的原因有两条：**它是模型的计算单位**（上下文窗口按 token 计），**也是计费单位**（输入与输出分别计价）。",
        "输出通常比输入贵：生成需要逐 token 推理，成本更高——所以「少让模型啰嗦」是真实的省钱手段。",
        "副作用：模型在字符级任务上容易失手（数某个字母出现几次、精确倒写字），因为它看到的是 token 而不是字符。",
        "估算上下文占用时别按字数算：中英混排、代码、表格的 token 密度都不同，长提示必须按 token 估。"
      ],
      summary_en: [
        "Models read **tokens**, not characters or whole words: common words are one token; rare or long words split into pieces.",
        "Roughly one Chinese character is 1–2 tokens, one English word 1–3.",
        "Tokens matter twice: they are the **unit of computation** (windows are measured in tokens) and the **unit of billing** (input vs output priced separately).",
        "Output usually costs more because generation infers token by token — asking for brevity genuinely saves money.",
        "Side effect: character-level tasks (counting letters, reversing exactly) trip models up, since they see tokens.",
        "Don't estimate context by character count: mixed languages, code and tables have different token densities."
      ],
      code: "\"hello world\"  → [\"hello\", \" world\"]      2 tokens\n\"unbelievable\" → [\"un\",\"believ\",\"able\"]   3 tokens\n中文「人工智能」→ 约 4~5 tokens（依分词表而定）",
      pit: "按「字数」估算上下文与费用——中英混排、代码、表格的 token 密度差别很大，按字数会严重低估。",
      pit_en: "Estimating by character count badly underestimates mixed-language, code and table content.",
      ex: {
        q: "token 与「字数」的本质差别是什么？",
        a: "token 是模型实际处理与计费的单位（由分词器决定）；字数只是人的计数习惯，两者没有固定换算比例。",
        q_en: "What is the essential difference between tokens and characters?",
        a_en: "Tokens are the real processing and billing unit set by the tokeniser; characters are a human convention with no fixed ratio."
      }
    },

    "c1l3": {
      title: "上下文窗口与”记忆“", title_en: "Context Window & Memory",
      summary: [
        "上下文窗口是模型一次能「看见」的 token 上限，包含系统提示、历史对话、你粘贴的资料和它自己的输出。",
        "**窗口大不等于记得牢**：长上下文里注意力会被稀释，位于中间的内容最容易被忽略（常说的「中间丢失」）。",
        "超出窗口的内容不是被「忘记」，而是根本没进入本次计算——对话越长，最早的内容越可能被挤出窗口。",
        "所以长对话的正确做法是**压缩与检索**：定期做阶段小结替代原文，或用 RAG（c5）按需把资料取回。",
        "实用技巧：把关键约束放在**开头和结尾**（这两端注意力最强），大段参考资料放中间并明确引用位置。",
        "排查「它忘了」：先看窗口占用，再确认关键信息是否还在窗口内——多数情况不是失忆，而是内容已被挤出。"
      ],
      summary_en: [
        "The context window is the token budget seen at once: system prompt, history, pasted material and the model's own output.",
        "**A bigger window is not better memory**: attention dilutes and middle content is often missed ('lost in the middle').",
        "Content beyond the window was never in this computation; as a chat grows, the earliest turns get pushed out.",
        "So long chats need **compression and retrieval**: periodic summaries, or RAG (c5) to fetch material on demand.",
        "Put key constraints at the **start and end** (attention is strongest there) and bulky references in the middle with pointers.",
        "When debugging 'it forgot', check window usage first — usually content was pushed out, not forgotten."
      ],
      code: "窗口 = 系统提示 + 历史 + 资料 + 输出 ≤ 上限\n应对：阶段小结替代原文 / RAG 按需取回 / 关键约束放首尾",
      pit: "以为换更大窗口的模型就能解决遗忘——窗口只是容量，稀释与中间丢失依然存在，仍需小结与检索。",
      pit_en: "A bigger window only raises capacity; dilution and lost-in-the-middle remain, so summaries and retrieval are still needed.",
      ex: {
        q: "窗口变大为什么不等价于「记忆变好」？",
        a: "窗口只决定能放多少；长上下文里注意力会稀释、中间内容易被忽略，真正解决长程依赖要靠压缩小结与按需检索。",
        q_en: "Why doesn't a bigger window equal better memory?",
        a_en: "It only raises capacity; attention dilutes and middle content is missed, so summaries and retrieval are required."
      }
    },

    "c1l4": {
      title: "参数规模与开源 / 闭源", title_en: "Model Size: Open vs Closed",
      summary: [
        "参数量（7B / 13B / 70B）代表容量：**同一代架构下**，更大的参数通常带来更强的理解与推理，但更贵、更慢。",
        "参数量不是唯一变量：**训练数据质量、训练方法、对齐水平**同样决定体验；做得好的小模型可以打赢大模型。",
        "闭源（商用 API）的优势是**能力上限与省心**（不用运维、按量付费）；劣势是数据要出网、成本随调用量增长、无法定制底层。",
        "开源的优势是**可控与可部署**（本地跑、可微调、数据不出内网）；劣势是需要自己解决硬件与运维。",
        "选型的第一性问题不是「哪个更强」，而是**数据能不能出网、预算结构是什么、要不要定制**——这三个答案通常直接决定路线。",
        "混用是常态：敏感任务走本地小模型，复杂任务走云端大模型；靠兼容接口（c2）可以低成本互切。"
      ],
      summary_en: [
        "Parameter count (7B / 13B / 70B) is capacity: **within a generation**, more parameters usually means better comprehension, at higher cost and latency.",
        "Size is not everything: **data quality, training method and alignment** matter as much; a good small model can beat a bigger one.",
        "Closed APIs win on **ceiling and low ops** (pay per use); they lose on data leaving, linear cost growth and no low-level customisation.",
        "Open models win on **control** (local, fine-tunable, in-house data); they require hardware and ops.",
        "The first question is not 'which is stronger' but **can data leave, what is the budget shape, is customisation needed**.",
        "Mixing is normal: local small models for sensitive tasks, cloud for hard ones; compatible APIs (c2) make it cheap to switch."
      ],
      code: "选型三问：\n  1) 数据能不能出网？     不能 → 本地 / 开源\n  2) 预算固定还是按量？   固定偏好本地，按量偏好 API\n  3) 要不要定制底层？     要 → 开源可微调",
      pit: "只看参数数字选模型，忽略数据质量与对齐水平——同为 7B，不同训练质量的实际体验可能天差地别。",
      pit_en: "Choosing by parameter count alone ignores data quality and alignment; two 7B models can feel completely different.",
      ex: {
        q: "开源模型最重要的优势是什么？",
        a: "可控与可部署：能本地运行、可微调、数据不出内网，适合有合规与定制需求的场景。",
        q_en: "What is the main advantage of open models?",
        a_en: "Control and deployability: local execution, fine-tuning and keeping data in-house."
      }
    },

    "c1l5": {
      title: "推理与训练：你只用得上前者", title_en: "Inference vs Training",
      summary: [
        "**训练**是用海量数据和算力把参数学到手的一次性过程，成本极高、周期长，由模型厂商完成。",
        "**推理**是用训练好的模型生成结果——你日常调用的每一次 API 都是推理。",
        "两者成本结构完全不同：训练是**一次性的巨额投入**，推理是**按次持续的支出**；绝大多数使用者的钱花在推理上。",
        "微调（c12）处在中间：不是从零训练，而是在已有模型上用少量数据继续训练，成本远低于预训练。",
        "因此「让它学会新知识」的正确做法通常是 RAG 或微调，而不是指望模型自己更新——预训练的知识**凝固在权重里**。",
        "时效性是硬约束：模型不知道训练截止之后发生的事，要靠检索（c5）或工具（c6）补齐。"
      ],
      summary_en: [
        "**Training** learns parameters from massive data with heavy compute — one-off and expensive, done by vendors.",
        "**Inference** uses the trained model to produce output; every API call is inference.",
        "The cost shapes differ: training is a **one-off capital cost**, inference is **ongoing per-use spend**.",
        "Fine-tuning (c12) is in between: continue training a base model on a small dataset, far cheaper than pre-training.",
        "So teaching new knowledge means RAG or fine-tuning, not waiting — pre-trained knowledge is **frozen in weights**.",
        "Timeliness is a hard limit: nothing after the cutoff is known; retrieval (c5) or tools (c6) fill the gap."
      ],
      code: "训练：数据 + 算力 → 参数（一次性，厂商）\n推理：参数 + 输入 → 输出（按次，你付费）\n微调：参数 + 小数据 → 适配参数（中间选项）",
      pit: "以为「多调用几次它就会记住我的资料」——调用不更新权重；必须用 RAG 或微调。",
      pit_en: "Repeated calls never update weights; use RAG or fine-tuning.",
      ex: {
        q: "为什么「让它学会公司最新资料」首选 RAG？",
        a: "调用只做推理、不改权重；RAG 把资料放进上下文，改资料即可生效，成本与时效都优于重新训练。",
        q_en: "Why prefer RAG for new company data?",
        a_en: "Calls only infer; RAG puts material in context and updates as soon as the data changes."
      }
    },

    /* ===== c2 通过 API 使用大模型 ===== */
    "c2l1": {
      title: "注册与 API Key 安全", title_en: "Sign-up & API Key Safety",
      summary: [
        "API Key 是调用凭证：谁拿到谁就能以你的身份花钱，安全等级不低于密码（而且直接对应账单）。",
        "正确存放：放进 `.env` 并在代码中读取，**并把 .env 加入 .gitignore**；绝不能硬编码进源码。",
        "前端/客户端代码里绝对不能放 Key——前端代码是公开的，浏览器里就能看到。",
        "不同环境用不同 Key（开发/生产分开），便于单独吊销与限额，出问题时影响面可控。",
        "务必开启**额度上限与用量告警**：这是「密钥泄露后被刷爆账单」的最后一道保险。",
        "泄露后的标准动作：**立即吊销并重新生成**，而不是只改代码——旧 Key 不会因为你在代码里换了新的就失效。",
        "定期轮换（或人员变动时主动换 Key）是低成本的卫生习惯。"
      ],
      summary_en: [
        "An API key is a credential: anyone holding it can spend as you — treat it like a password with a card attached.",
        "Store it in `.env`, read from code, and **gitignore it**; never hard-code.",
        "Never place keys in frontend code — it is public and visible in the browser.",
        "Use different keys per environment so you can revoke or cap one safely.",
        "Enable **spending caps and usage alerts** — the last defence against a drained account.",
        "After a leak: **revoke and regenerate immediately**; changing code does not kill the old key.",
        "Rotate keys periodically or on team changes."
      ],
      code: "# .env（不进版本库）\nOPENAI_API_KEY=sk-xxxxx\n# .gitignore\n.env\n# 代码\nimport os; key = os.environ[\"OPENAI_API_KEY\"]",
      pit: "密钥泄露后只改代码而不吊销——旧 Key 依然有效，账单继续被刷。",
      pit_en: "Changing code without revoking leaves the old key live and the bill running.",
      ex: {
        q: "密钥泄露后第一件事做什么？",
        a: "立即吊销并重新生成，再排查代码与日志；只改代码不会让旧 Key 失效。",
        q_en: "What is the first step after a leak?",
        a_en: "Revoke and regenerate, then audit code and logs."
      }
    },

    "c2l2": {
      title: "一次最小请求长什么样", title_en: "Anatomy of a Minimal Request",
      summary: [
        "最小组成：**模型名 + 消息数组 + 少量参数**；真正要用的返回值通常只是 choices[0].message.content。",
        "消息数组里 role 有三种：system（定规则）、user（你/用户说的）、assistant（模型的回复）。",
        "响应里还有 usage（输入/输出 token 数）——它是成本核算与限流判断的依据，务必记录。",
        "调用可能失败：网络抖动、限流 429、参数错误 400，**必须写错误处理与重试**。",
        "把调用封装成自己的函数/模块：之后换供应商、加缓存、加重试都只改一处。",
        "先用命令行（curl）验证服务与参数，再写代码——能把「服务问题」和「代码问题」分开排查。"
      ],
      summary_en: [
        "Minimum: **model + messages + a few parameters**; you usually need only choices[0].message.content.",
        "Messages use three roles: system (rules), user (input), assistant (model output).",
        "The response carries usage (tokens) — record it for cost and rate decisions.",
        "Calls fail (jitter, 429, 400): **handle errors and retry**.",
        "Wrap calls in your own module: vendor switches, caching and retries then touch one place.",
        "Verify with curl before writing code to separate service issues from code issues."
      ],
      code: "resp = client.chat.completions.create(\n    model=\"gpt-4o-mini\",\n    messages=[{\"role\":\"user\",\"content\":\"用一句话解释 RAG\"}]\n)\nprint(resp.choices[0].message.content)\nprint(resp.usage.prompt_tokens, resp.usage.completion_tokens)",
      pit: "没有错误处理与重试——偶发 429 或网络抖动就会中断整批任务，前面的结果也白跑。",
      pit_en: "Without retry handling, one hiccup aborts a batch and wastes completed work.",
      ex: {
        q: "为什么要把 API 调用封装成自己的函数？",
        a: "封装后换供应商、加缓存、加重试都只改一处，避免调用逻辑散落导致维护成本上升。",
        q_en: "Why wrap API calls?",
        a_en: "Switching vendors, caching and retries then happen in one place."
      }
    },

    "c2l3": {
      title: "常用参数：temperature / top_p / max_tokens", title_en: "Key Parameters",
      summary: [
        "**temperature** 控制随机性：越低越稳定（适合抽取、分类、JSON），越高越发散（适合创意）。",
        "**top_p** 也是随机性控制（核采样，只从累计概率前 p 的候选里采样）；**一般与 temperature 二选一调**，同时调容易互相干扰。",
        "**max_tokens** 限制输出长度：它既是防「跑不停」的保险，也是直接的成本控制手段。",
        "要稳定复现结果，把 temperature 设为 0（或很低），并固定其它随机相关参数。",
        "还需要关注 stop（停止序列）与超时设置：前者控制生成边界，后者防止请求卡死。",
        "调参的正确顺序：先保证结构与正确性（低温、给示例），再按需要提高多样性。"
      ],
      summary_en: [
        "**temperature** controls randomness: low for extraction, classification and JSON; high for creative work.",
        "**top_p** also controls randomness (nucleus sampling); **prefer tuning one of the two**, not both.",
        "**max_tokens** caps output length — insurance against runaway generation and a direct cost lever.",
        "For reproducibility, set temperature to 0 (or very low) and pin the other sampling parameters.",
        "Also mind stop sequences and timeouts: one bounds generation, the other prevents hangs.",
        "Tune in order: secure structure and correctness first (low temperature, examples), then add variety."
      ],
      code: "# 稳定场景\ntemperature=0, max_tokens=500\n# 创意场景\ntemperature=0.8（此时一般不再调 top_p）",
      pit: "同时大幅调 temperature 和 top_p——两者作用重叠，结果难以解释，也不利于稳定复现。",
      pit_en: "Tuning temperature and top_p together makes results hard to reason about or reproduce.",
      ex: {
        q: "想让输出稳定可复现，参数该怎么设？",
        a: "把 temperature 设为 0（或很低），固定采样参数与提示，输出基本可复现。",
        q_en: "How do you make output reproducible?",
        a_en: "Set temperature to 0 (or very low) and keep prompts and sampling parameters fixed."
      }
    },

    "c2l4": {
      title: "流式输出与多轮对话", title_en: "Streaming & Multi-turn",
      summary: [
        "流式（stream=True）让模型**边生成边返回**，改善的是「首字延迟」的体感，而不是总耗时。",
        "流式下要按 chunk 累积内容，注意有些 chunk 没有 content（只有元数据），要做空值判断。",
        "解析冲突：下游要解析 JSON 时，**流式阶段只做展示**，拿到完整结果再解析——半截 JSON 必然解析失败。",
        "多轮对话的本质是**把历史重发**：模型无状态，每次调用独立；messages 数组就是它唯一的上下文来源。",
        "只发最新一句而丢弃历史，模型就会「失忆」——这是多轮最常见的错误。",
        "历史增长会带来成本上升与窗口溢出，需要保留最近 N 轮 + 早期内容做摘要；**system 提示永远保留**。"
      ],
      summary_en: [
        "Streaming returns output **as it is generated**, improving perceived first-token latency, not total time.",
        "Accumulate chunks; some carry no content (metadata only), so guard for None.",
        "Parsing conflict: when downstream needs JSON, **use streaming only for display**; parse the complete text.",
        "Multi-turn means **resending history**: the model is stateless and messages are its only context.",
        "Sending only the latest turn causes 'amnesia' — the most common multi-turn bug.",
        "Growth raises cost and risks overflow: keep the last N turns plus a summary, and **always keep system**."
      ],
      code: "# 流式\nfor chunk in client.chat.completions.create(..., stream=True):\n    print(chunk.choices[0].delta.content or \"\", end=\"\")\n# 多轮\nmessages.append({\"role\":\"user\",\"content\":q})\nmessages.append({\"role\":\"assistant\",\"content\":reply})  # 回复也要放回历史",
      pit: "在流式还没结束就拿内容去解析 JSON——拿到的是半截文本，必然失败。",
      pit_en: "Parsing JSON mid-stream always fails — accumulate first.",
      ex: {
        q: "多轮对话为什么必须把历史一起发？",
        a: "模型无状态，每次调用独立计算；历史消息是它理解上下文的唯一来源，不发就等于让它从头开始。",
        q_en: "Why resend history every turn?",
        a_en: "The model is stateless; history is its only source of context."
      }
    },

    "c2l5": {
      title: "主流平台与“OpenAI 兼容“协议", title_en: "Platforms & OpenAI-compatible Protocol",
      summary: [
        "「OpenAI 兼容」指供应商提供**相同的接口形状**（路径、字段名、消息结构），切换只需改 base_url、model 与 Key。",
        "这让本地模型（Ollama / vLLM，见 c3）也能用同一套代码调用，本地与云端切换成本接近零。",
        "兼容**不等于能力一致**：模型名、可用参数、上下文长度、计费方式各不相同，切换后要重新验证效果与限额。",
        "实践建议：base_url / model / key 全部放进配置或环境变量，代码只依赖「兼容接口」这一层抽象。",
        "留意的兼容缺口：**流式、函数调用、JSON 模式**在各家的支持程度不一。",
        "把兼容接口当作**降低迁移成本**的保险，而不是「所有供应商完全等价」的承诺。"
      ],
      summary_en: [
        "'OpenAI-compatible' means the same interface shape; switching needs only base_url, model and key.",
        "That lets local models (Ollama / vLLM, see c3) use the same code, making local↔cloud switching nearly free.",
        "Compatibility is not equivalence: models, parameters, context limits and pricing differ — re-verify.",
        "Keep base_url/model/key in config; let code depend on the compatible-interface abstraction.",
        "Watch gaps in **streaming, function calling and JSON mode** support.",
        "Treat compatibility as **migration insurance**, not a promise of equivalence."
      ],
      code: "client = OpenAI(\n    base_url=\"http://localhost:11434/v1\",   # 或厂商地址\n    api_key=os.environ[\"API_KEY\"],\n)\nresp = client.chat.completions.create(model=\"qwen2.5:7b\", messages=messages)",
      pit: "以为兼容就是完全等价而切换后不验证——模型、参数、上下文与限流都不同，效果与费用可能显著变化。",
      pit_en: "Assuming equivalence and skipping verification; models, limits and pricing differ.",
      ex: {
        q: "「OpenAI 兼容」的实际好处是什么？",
        a: "同一套代码只改 base_url 与模型名即可切换厂商或本地模型，大幅降低迁移与对比成本。",
        q_en: "What is the practical benefit of compatibility?",
        a_en: "One codebase switches vendors or local models by changing base_url and model."
      }
    },

    /* ===== c3 本地部署 ===== */
    "c3l1": {
      title: "为什么要在本地跑", title_en: "Why Run Locally",
      summary: [
        "三大动机：**数据不出内网**（合规与隐私）、**把按量成本换成固定成本**（长期高频更划算）、**可控可定制**（可微调、可离线）。",
        "代价也很明确：需要显卡/内存、要自己运维、能力上限通常低于最强的云端模型。",
        "判断是否值得本地化，看两个量：调用量（够大才摊得平硬件）与数据敏感度（敏感则本地几乎是唯一解）。",
        "折中很常见：本地跑小模型处理敏感与高频的简单任务，复杂任务仍走云端。",
        "离线可用性常被低估：内网、出差、弱网环境下依然可用。",
        "选型前先确认硬件门槛：显存决定能跑多大规模（7B 量化约 4~6GB，13B 约 8~10GB 起）。"
      ],
      summary_en: [
        "Three motives: **data stays in-house**, **variable cost becomes fixed**, and **control** (fine-tuning, offline).",
        "Costs: GPU/RAM, ops burden, and usually a lower ceiling than top cloud models.",
        "Judge by two numbers: call volume and data sensitivity.",
        "A hybrid is common: local small models for sensitive or high-frequency simple tasks, cloud for hard ones.",
        "Offline availability is underrated: intranets and travel.",
        "Check hardware: VRAM decides model size (7B quantised ≈ 4–6GB, 13B ≈ 8–10GB+)."
      ],
      code: "本地化判断：\n  数据能否出网？     否 → 本地（合规硬约束）\n  月调用量够大？     是 → 可摊平硬件成本\n  要离线/定制？     是 → 更适合本地",
      pit: "为了「省钱」盲目上本地，忽略了显卡、运维与能力差距——低频场景下按量付费往往更便宜。",
      pit_en: "Going local purely to save money ignores hardware, ops and capability gaps; at low volume pay-per-use wins.",
      ex: {
        q: "什么情况下本地部署是「必选项」？",
        a: "当数据因合规不能出网，或必须离线可用时——此时本地几乎是唯一解，而不只是成本问题。",
        q_en: "When is local deployment mandatory?",
        a_en: "When compliance forbids data leaving, or offline operation is required."
      }
    },

    "c3l2": {
      title: "Ollama：一行命令跑模型", title_en: "Ollama: One Command",
      summary: [
        "Ollama 的定位是「本地模型的一键运行器」：一条命令拉模型、一条命令跑起来，并自带 OpenAI 兼容端点。",
        "典型流程：安装 → `ollama run <模型>` 拉取并进入交互 → 或用兼容端点从代码调用。",
        "它默认在本机提供 `/v1` 兼容接口，因此 c2 的代码把 base_url 指过去即可复用。",
        "模型名带标签表示规格（`qwen2.5:7b`、`llama3:8b`），标签决定下载体积与显存占用。",
        "量化版本（如 q4）能显著降低显存需求，是入门首选；精度损失通常可以接受。",
        "注意磁盘：每个模型都是几 GB，长期试用会快速占满空间，应定期清理不用的模型。"
      ],
      summary_en: [
        "Ollama is a one-command runner: pull with one command, run with another, with a compatible endpoint included.",
        "Flow: install → `ollama run <model>` → or call the endpoint from code.",
        "It exposes a local `/v1` endpoint, so c2's code works by pointing base_url at it.",
        "Tags denote size (`qwen2.5:7b`), determining download size and VRAM.",
        "Quantised variants (q4) cut VRAM needs and are a sensible default.",
        "Watch disk: models are several GB each; prune unused ones."
      ],
      code: "ollama run qwen2.5:7b      # 拉取并进入交互\nollama list                # 已装模型\n# 代码：base_url=\"http://localhost:11434/v1\"",
      pit: "把本地端点直接暴露到公网且不加鉴权——等于把自己的显卡送给别人。",
      pit_en: "Exposing the local endpoint publicly without auth gives away your GPU.",
      ex: {
        q: "Ollama 自带兼容端点的价值是什么？",
        a: "让本地模型复用 OpenAI 兼容代码，本地与云端切换只需改 base_url 与模型名。",
        q_en: "What is the value of Ollama's compatible endpoint?",
        a_en: "Local models reuse compatible code; switching needs only base_url and model."
      }
    },

    "c3l3": {
      title: "llama.cpp 与 GGUF 量化", title_en: "llama.cpp & GGUF Quantisation",
      summary: [
        "GGUF 是 llama.cpp 生态常用的**单文件模型格式**：把权重与元信息打包在一起，便于分发与加载。",
        "量化把权重从高精度（FP16）压到低精度（4-bit 等）：体积与显存显著下降，代价是少量精度损失。",
        "它的价值是**让更大的模型能在更小的显存上跑**，尤其适合 CPU 或入门显卡环境。",
        "命名里的 q4 / q5 / q8 指量化位数：**q4 通常是性价比平衡点**（如 q4_K_M）。",
        "量化主要省资源，**不会让模型更准**；想提升效果应换更好的模型或更好的提示。",
        "不同量化版本的效果有差异，关键任务前要用你自己的样例实测，而不是只看参数。"
      ],
      summary_en: [
        "GGUF is the single-file model format of the llama.cpp ecosystem, bundling weights and metadata for easy distribution.",
        "Quantisation compresses weights (FP16 → 4-bit), cutting size and VRAM at a small accuracy cost.",
        "Its value is **fitting larger models into smaller VRAM**, especially on CPUs or entry GPUs.",
        "Names q4 / q5 / q8 denote bit width; **q4 is usually the sweet spot** (e.g. q4_K_M).",
        "Quantisation saves resources; it does not make a model smarter.",
        "Benchmark quantisations on your own samples before critical use."
      ],
      code: "常见：qwen2.5-7b-instruct-q4_K_M.gguf（4-bit）\n判断：显存不够 → 降量化位数 / 换更小模型\n注意：llama.cpp / Ollama 生态认 GGUF",
      pit: "以为量化越狠越好——过度量化会明显退化；应先保证效果，再按显存余量决定量化程度。",
      pit_en: "Heavier quantisation is not better; secure quality first, then fit VRAM.",
      ex: {
        q: "量化解决什么、不解决什么？",
        a: "解决显存与体积；不解决能力（不会更准，过度量化还会变差）。",
        q_en: "What does quantisation solve and not solve?",
        a_en: "It solves VRAM and size, not capability."
      }
    },

    "c3l4": {
      title: "vLLM 与高并发服务", title_en: "vLLM & High-concurrency Serving",
      summary: [
        "vLLM 的定位是**高吞吐的服务端**：同样的显卡，它能同时服务更多请求，适合团队共享与生产环境。",
        "关键机制是 PagedAttention 式的显存管理（把 KV Cache 分页复用），显著减少显存浪费、提升并发。",
        "它同样提供 OpenAI 兼容接口，所以客户端代码无需改动即可从 Ollama 切到 vLLM。",
        "与 Ollama 的分工：**Ollama 偏个人/单机体验，vLLM 偏服务化与吞吐**。",
        "上线前要压测：确定在你的显卡、模型与上下文长度下，能稳定支撑多少并发。",
        "并发上不去的常见原因：显存被 KV Cache 吃满、上下文过长、批处理参数不合适。"
      ],
      summary_en: [
        "vLLM is a **high-throughput server**: more concurrent requests on the same GPU, suited to teams and production.",
        "Its key mechanism is paged KV-cache management, cutting VRAM waste and raising concurrency.",
        "It also speaks the OpenAI-compatible API, so clients switch from Ollama unchanged.",
        "Division: **Ollama for personal/single-machine, vLLM for serving and throughput**.",
        "Load-test before launch: find the sustainable concurrency for your GPU, model and context length.",
        "Concurrency usually stalls because KV cache fills VRAM, contexts are too long, or batching is misconfigured."
      ],
      code: "vllm serve Qwen/Qwen2.5-7B-Instruct --port 8000\n# 客户端：base_url=\"http://localhost:8000/v1\"（兼容接口，代码不变）",
      pit: "拿 Ollama 的并发预期去要求 vLLM（或反过来）——两者定位不同；选型前先明确是「个人体验」还是「多人服务」。",
      pit_en: "Ollama and vLLM target different scenarios — decide between single-user experience and multi-user serving first.",
      ex: {
        q: "什么时候该从 Ollama 换成 vLLM？",
        a: "当有多人同时调用、需要更高吞吐与更稳定的服务时；个人本地体验用 Ollama 更省事。",
        q_en: "When switch from Ollama to vLLM?",
        a_en: "When several users call concurrently and you need throughput and stability."
      }
    },

    "c3l5": {
      title: "硬件需求速算", title_en: "Sizing Hardware Quickly",
      summary: [
        "显存是第一约束：**模型权重 + KV Cache × 并发数 + 运行时开销**共同决定需要多少显存。",
        "粗略经验：7B 量化约 4~6GB，13B 约 8~10GB 起；未量化（FP16）大约按「参数量 × 2GB」估算。",
        "上下文很吃显存：每个并发会话都保留自己的 KV Cache，**长会话 × 高并发会迅速吃满**。",
        "并发是最容易低估的一环：单人聊天流畅，多人同时用会明显排队变慢。",
        "优化方向：降量化位数、限制上下文长度、限制并发数、或换高吞吐服务端（c3-4）。",
        "没有独显也能跑（CPU 推理），但速度通常慢一个量级，只适合体验与低并发。"
      ],
      summary_en: [
        "VRAM is the first constraint: **weights + KV cache × concurrency + runtime overhead**.",
        "Rough: 7B quantised ≈ 4–6GB, 13B ≈ 8–10GB+; unquantised FP16 ≈ params × 2GB.",
        "Context is expensive: each session keeps its own KV cache; long contexts times concurrency fills VRAM fast.",
        "Concurrency is underestimated: smooth for one user, queuing for several.",
        "Optimise: lower quantisation, cap context, cap concurrency, or use a high-throughput server (c3-4).",
        "CPU-only works but is roughly an order of magnitude slower — fine for trials."
      ],
      code: "速算：权重(7B q4≈4~6GB) + KV×并发 + 开销\n13B q4 ≈ 8~10GB起；FP16 ≈ 参数量×2GB",
      pit: "只按「模型体积」估算显存，忽略上下文与并发——一个人跑得好好的，加第二个用户就 OOM。",
      pit_en: "Sizing by model size alone ignores context and concurrency — OOM arrives with the second user.",
      ex: {
        q: "为什么本地部署要特别关注并发？",
        a: "每个并发会话都额外占用 KV Cache 显存，并发上来后显存与吞吐都会成为瓶颈。",
        q_en: "Why does concurrency matter locally?",
        a_en: "Each session adds KV cache; VRAM and throughput become the bottleneck."
      }
    },

    "c3l6": {
      title: "把本地模型变成 API：Ollama / vLLM", title_en: "Turn a Local Model into an API",
      summary: [
        "本地跑起来只是第一步：把它变成「OpenAI 兼容的接口」，代码、插件、Agent 才能像调云端一样调它。",
        "Ollama 自带兼容端点（默认 11434 端口的 /v1），把 base_url 指过去即可；vLLM 用 `vllm serve` 启动后同理。",
        "验证顺序很有用：**先 curl 通** → 再用 SDK 调通 → 最后接进项目，失败时能快速定位是服务、参数还是代码问题。",
        "常见失败点：端口不对、模型名没拉取、请求体 JSON 写错、把 API Key 当必填（本地通常随便填即可）。",
        "自建服务要盯三件事：**并发与显存、上下文上限、不要裸奔到公网**（加鉴权与访问控制）。",
        "接口统一后本地与云端可平滑互切——这是「兼容接口」这个抽象最实际的收益。"
      ],
      summary_en: [
        "Running locally is step one: expose an OpenAI-compatible endpoint so code, plugins and agents can call it like a cloud API.",
        "Ollama ships one (port 11434, /v1); vLLM serves one after `vllm serve`.",
        "Verify in order: **curl first** → SDK next → project last, so failures point at service, parameters or code.",
        "Typical failures: wrong port, model not pulled, malformed JSON, treating the key as meaningful.",
        "For self-hosting watch three things: concurrency vs VRAM, context limits, and never expose it raw publicly.",
        "A unified interface lets local and cloud switch smoothly — the real payoff of compatibility."
      ],
      code: "# 1) 命令行验证\ncurl http://localhost:11434/v1/models\n# 2) 代码\nfrom openai import OpenAI\nc=OpenAI(base_url=\"http://localhost:11434/v1\", api_key=\"local\")\nprint(c.chat.completions.create(model=\"qwen2.5:7b\", messages=[{\"role\":\"user\",\"content\":\"你好\"}]).choices[0].message.content)",
      pit: "跳过命令行验证直接写代码——一旦失败分不清是服务没起、端口错还是代码错，排查时间成倍增加。",
      pit_en: "Skipping the curl check makes failures ambiguous between service, port and code.",
      ex: {
        q: "接入本地服务时为什么建议先命令行验证？",
        a: "命令行能独立确认服务与参数是否正常，把「服务问题」和「代码问题」分开，失败时定位极快。",
        q_en: "Why verify with curl first?",
        a_en: "It isolates service and parameter issues from code issues."
      }
    }
  }
};
