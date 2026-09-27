/* ================================================================
 * R0:hello agent · 课程深化层 ④（R4 第一批：把「会用」教透 + 双轨结构化）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 这一层做四件事（机制见 index.html 的 agMergeLesson / agApplyCompanion）：
 *   A1  c5 RAG 从 4 节扩到 6 节：补「重排与混合检索」「检索质量评测」
 *   A3  为 c5 / c9 全部课节写 path.api / path.local 双轨操作路径（含 path_en）
 *   A4  c14 扩展机制前移到 c7 之后（它只依赖 c6，排在上线之后是本末倒置）
 *   A5  自足性：新课就地讲清，不写「详见某站」
 * 规格式同前几层：每节 6~7 要点，中英条数一致；只写稳定行为差异，不写价格与版本断言。
 * ================================================================ */

const DEEPEN_AGENT_D = {

  stages: ["c5", "c9", "c12"],

  /* 章节顺序（A4）：id 一个不改，只重排数组 → 老用户进度键零迁移 */
  stageOrder: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c14", "c8", "c9", "c10", "c11", "c12", "c13"],

  order: {
    c5: ["c5l1", "c5l2", "c5l3", "c5l4", "c5l5", "c5l6"],
    c9: ["c9l1", "c9l2", "c9l3", "c9l4", "c9l5", "c9l6"]
  },

  lessons: {

    /* ========== A3 · c5 双轨路径（正文沿用前面的深化层，这里只加操作路径） ========== */
    "c5l1": {
      path: {
        api: "先验证幻觉是否存在：直接问私有资料里的问题 → 记录它「编」出来的字段\n再上检索：任一云端 embedding 服务把资料切成向量 → 存进托管向量库",
        local: "同样先问一次拿基线，但全程离线可复现：把资料放本地目录，用本地小模型跑同一问题\n好处是能把「编造」稳定重放；代价是要自己准备 embedding 模型与向量库"
      },
      path_en: {
        api: "First prove the hallucination exists: ask a question answered only in your private material and note what it invented\nThen add retrieval: embed the corpus with a hosted embedding service and store vectors in a managed vector DB",
        local: "Same baseline question, but reproducible fully offline: keep the corpus in a local folder and ask a local model\nYou gain a stable replay of the fabrication; you pay for running your own embedding model and vector store"
      }
    },
    "c5l2": {
      path: {
        api: "切块：固定长度 + 重叠（如 512 / 64），或按标题层级切\n向量化：调云端 embedding 接口批量写入，按 token 计费，注意批大小上限\n存储：托管向量库建集合 + metadata（来源、页码、更新时间）",
        local: "切块策略同上，但要按本地模型的上下文长度反推块大小（窗口小，块就得保守）\n向量化：bge / nomic 一类开源模型自跑，CPU 也能出结果，只是慢\n存储：chroma / qdrant 单机起一套，metadata 一样要存来源与页码"
      },
      path_en: {
        api: "Chunking: fixed length with overlap (e.g. 512 / 64), or split by heading level\nEmbedding: batch through the hosted embedding API, billed per token - mind the batch size limit\nStorage: create a collection in the managed vector DB with metadata (source, page, updated at)",
        local: "Same chunk strategy, but derive the size from your local model's context window - a small window forces conservative chunks\nEmbedding: run an open model (bge / nomic) yourself; CPU works, it is just slow\nStorage: a single-node chroma / qdrant, keeping the same source and page metadata"
      }
    },
    "c5l3": {
      path: {
        api: "检索：按相似度取 top-k → 拼成「仅依据以下资料回答」的提示 → 调生成接口\n控制：把引用来源随答案回传，温度调低；缺资料时要求回答「未知」",
        local: "检索与拼接完全同构，差别在生成端：本地推理引擎一次只服务有限并发，top-k 越大首字延迟越高\n控制项换成引擎参数（上下文长度、量化等级、并发数），引用与「未知」要求写进系统提示"
      },
      path_en: {
        api: "Retrieve: take top-k by similarity → assemble a 'answer only from the following' prompt → call the generation endpoint\nControls: return citations with the answer, lower the temperature, require 'unknown' when evidence is missing",
        local: "Retrieval and assembly are identical; the difference is on the generation side - a local engine serves limited concurrency, and larger top-k directly raises time-to-first-token\nControls become engine flags (context length, quantisation, concurrency); the citation and 'unknown' rules still live in the system prompt"
      }
    },
    "c5l4": {
      path: {
        api: "成本边界：每查询的 embedding + 生成 token 都要计进「每次问答成本」\n更新边界：资料频繁变动时，托管库的重新向量化就是持续支出",
        local: "成本边界：重新向量化消耗的是自己的机时，适合频繁更新的小语料\n能力边界：小模型的上下文窗口限制了能塞进去的资料量，边界比 API 轨来得更早"
      },
      path_en: {
        api: "Cost boundary: per-query embedding plus generation tokens both count into 'cost per answer'\nFreshness boundary: when the corpus changes often, re-embedding in the managed store is a recurring bill",
        local: "Cost boundary: re-embedding spends your own machine time, which suits frequently updated small corpora\nCapability boundary: a small model's context window caps how much material fits, so you hit it sooner than on the API track"
      }
    },

    /* ========== A1 · c5l5 重排与混合检索 ========== */
    "c5l5": {
      title: "重排与混合检索：把对的段落捞上来",
      title_en: "Reranking & Hybrid Search: Get the Right Chunk Back",
      summary: [
        "召回阶段追求「别漏」，精排阶段追求「别错」：向量检索一次给 20~50 段，重排（cross-encoder）只对这几十段逐对打分，最后取前 3~5 段进提示。",
        "向量相似度只看语义距离，读不懂否定、精确编号与稀有专名 —— 这些漏洞交给关键词检索（BM25）去补，这就是混合检索的由来。",
        "两路结果不能直接拼：先按 (文档, 片段) 去重，再统一到同一尺度上比较。倒数排名融合（RRF）最省心，因为它只用名次、不用两边的分数。",
        "重排的成本按「候选段数 × 每段长度」线性叠加：top-50 精排在 API 轨上比 top-10 明显更贵更慢，在本地轨还要额外占一份显存。",
        "该不该上重排有个很具体的信号：正确段落确实被召回了，但排在第 6~15 名。若压根没召回，问题在切片与 embedding，排序救不回来。",
        "切片仍是主旋钮：被切坏的语义单元（一句结论从中间断开）任何打分器都无解，先修切法再谈精排。",
        "一次只动一个变量：top-k、块大小、是否重排分开测，否则收益无法归因，调参就退化成许愿。下一节用评测集把这件事固化下来。"
      ],
      summary_en: [
        "Recall aims at 'miss nothing', reranking at 'be right': vector search returns 20-50 chunks, a cross-encoder scores only those pairs, and the top 3-5 go into the prompt.",
        "Cosine similarity sees semantic distance only - it misreads negation, exact IDs and rare proper nouns. Keyword search (BM25) covers those gaps, which is why hybrid retrieval exists.",
        "Do not staple the two result lists together: dedupe by (document, chunk) first, then compare on one scale. Reciprocal Rank Fusion is the painless choice because it uses ranks, not the two incomparable scores.",
        "Reranking cost grows linearly with candidates x length: reranking top-50 is clearly pricier and slower than top-10 on the API track, and on the local track it also eats VRAM.",
        "The signal for needing a reranker is concrete: the right chunk was retrieved but sits at rank 6-15. If it was never retrieved, the problem is chunking and embedding - ranking cannot save it.",
        "Chunking stays the main knob: a semantic unit cut in half (a sentence split mid-clause) defeats any scorer. Fix the splitter before talking about precision ranking.",
        "Change one variable at a time - top-k, chunk size and the reranker separately - otherwise gains cannot be attributed and tuning degenerates into wishful thinking. The next lesson pins this down with an eval set."
      ],
      code: "最小混合检索 + 重排：\n  1) 向量召回 top-40，BM25 召回 top-40\n  2) 按 (doc_id, chunk_id) 去重\n  3) RRF：score = Σ 1 / (60 + rank)\n  4) cross-encoder 给前 20 段重新打分\n  5) 取前 4 段进提示，其余丢弃\n  记录：每次改动只动一个变量，附 Recall@5 / 忠实度 / 首字延迟",
      code_en: "Minimal hybrid retrieval + reranking:\n  1) vector recall top-40, BM25 recall top-40\n  2) dedupe by (doc_id, chunk_id)\n  3) RRF: score = sum of 1 / (60 + rank)\n  4) cross-encoder re-scores the first 20\n  5) keep the top 4 chunks in the prompt, drop the rest\n  Log: change one variable at a time, record Recall@5 / faithfulness / time-to-first-token",
      pit: "把 top-k 从 4 调到 20 当成「多给点上下文」——噪音一起进去，模型抓错重点，成本与延迟同步上涨；看起来更全，实际更差。",
      pit_en: "Raising top-k from 4 to 20 as 'give it more context' - the noise arrives with the signal, the model grabs the wrong point, and cost and latency rise together. It looks more complete and performs worse.",
      ex: {
        q: "为什么工程上偏爱 RRF 融合，而不是把两边分数加权相加？",
        a: "向量相似度与 BM25 分数量级不可比，加权要先归一化还得反复调参；RRF 只用名次，天然可比、几乎零调参。",
        q_en: "Why do engineers prefer RRF over a weighted sum of the two scores?",
        a_en: "Cosine similarity and BM25 scores live on incomparable scales, so weighting needs normalisation and constant retuning. RRF uses ranks only - comparable by construction and nearly parameter-free."
      },
      min: 13,
      path: {
        api: "召回：托管向量库取 top-40 + 云端关键词检索取 top-40\n精排：调第三方重排接口，费用按候选段数计\n接线：去重与融合在自家代码里做，只把精排结果拼进提示",
        local: "召回：本地向量库（chroma / qdrant）+ 本地关键词索引（bm25s / whoosh），同一份语料建两套索引\n精排：跑开源小重排模型，预留 1~2GB 显存与每查询数十到两百毫秒\n接线：融合逻辑一样，但要盯内存——两套索引常驻会和模型抢显存"
      },
      path_en: {
        api: "Recall: top-40 from the managed vector DB plus top-40 from a hosted keyword search\nRerank: call a third-party rerank endpoint, billed by number of candidates\nWiring: dedupe and fusion happen in your own code; only the reranked chunks go into the prompt",
        local: "Recall: a local vector store (chroma / qdrant) plus a local keyword index (bm25s / whoosh) built over the same corpus\nRerank: run an open small reranker, budgeting 1-2 GB of VRAM and tens to hundreds of milliseconds per query\nWiring: the fusion code is the same, but watch memory - two resident indexes compete with the model for VRAM"
      }
    },

    /* ========== A1 · c5l6 检索质量评测 ========== */
    "c5l6": {
      title: "检索质量评测：让调参有据可依",
      title_en: "Retrieval Evaluation: Give Tuning Something to Stand On",
      summary: [
        "RAG 调优化成玄学，是因为端到端准确率把两种失败混在一起：检索没捞到，和捞到了却没用好。分开量，才定位得到问题。",
        "检索侧要有标注：给每道测试题标出「标准答案出自哪几段」（gold chunks）。有了它，Recall@k、MRR、nDCG 才算得出来 —— 这份标注才是评测集的核心资产。",
        "生成侧看三件事：忠实度（答案是否只依据给定段落）、相关性（是否答在点上）、引用命中率（答案里的引用能否指回原段）。",
        "最小可用评测集只要 30~50 题：覆盖高频问题、边界题（资料里没有答案，正确行为是拒答）和对抗题（两段互相矛盾时该指出冲突）。规模不重要，标注质量才重要。",
        "每次改动记一行三数：Recall@5、忠实度、平均首字延迟与每次查询成本。没有这行记录，一周后你解释不了哪次改动带来了提升。",
        "离线分数只做淘汰赛：明显变差的配置不上线；真正的验收仍靠线上抽样人评。两者打架时以人评为准，并回头补强评测集。",
        "评测集必须跟着知识库版本走：换资料版本、改切法、换 embedding 模型都要重跑，因为 gold chunks 的定义随切片方式改变而失效。"
      ],
      summary_en: [
        "RAG tuning turns mystic because end-to-end accuracy blends two failures: retrieval missed the chunk, and retrieval found it but generation misused it. Measure them apart and the fault locates itself.",
        "The retrieval side needs labels: for every test question, mark which chunks contain the answer (gold chunks). Only then do Recall@k, MRR and nDCG exist - those labels are the real asset of an eval set.",
        "The generation side needs three checks: faithfulness (answer only from the given chunks), relevance (does it address the question), citation hit rate (can each cited chunk be found).",
        "A usable minimum is 30-50 questions: frequent ones, boundary ones (the answer is not in the corpus - correct behaviour is refusing), and adversarial ones (two chunks contradict; it should flag the conflict). Volume is irrelevant; label quality is not.",
        "Log one line per change with three numbers: Recall@5, faithfulness, average time-to-first-token and cost per query. Without that line you cannot explain a month later which change bought the gain.",
        "Offline scores are for elimination only: configs that clearly regress never ship. Real acceptance is human review on sampled online traffic; when the two disagree, trust the humans and then repair the eval set.",
        "The eval set version-tracks the knowledge base: new corpus version, new chunking or a new embedding model all force a re-run, because gold chunks are defined by the splitter."
      ],
      code: "评测集最小结构（一行一题）：\n  qid | question | gold_chunk_ids | expect_refusal | notes\n指标算法：\n  Recall@5 = 命中 gold 的题数 / 总题数\n  引用命中率 = 正确引用数 / 全部引用数\n  忠实度 = 人工判定「只依据资料」的题数占比\n变更记录：日期 | 改了哪一个变量 | Recall@5 | 忠实度 | TTFT | 每次成本",
      code_en: "Minimal eval-set schema (one row per question):\n  qid | question | gold_chunk_ids | expect_refusal | notes\nComputing the metrics:\n  Recall@5 = questions whose gold chunks were retrieved / total\n  citation hit rate = valid citations / all citations\n  faithfulness = share of answers judged 'only from the given material'\nChange log: date | which single variable moved | Recall@5 | faithfulness | TTFT | cost per query",
      pit: "只调不测：换了 embedding 模型觉得「感觉变好了」，实际上召回率掉了 12 个点、只有拒答题看起来更客气。没有评测集的调参，改动方向本身就不存在。",
      pit_en: "Tuning without measuring: you swap the embedding model and 'feel' it got better, while recall actually drops 12 points and only the refusal cases look politeness. Without an eval set there is no direction to change in.",
      ex: {
        q: "为什么边界题（资料里没有答案）是评测集的必备项？",
        a: "它专门暴露最贵的失败：模型硬编一个答案。拒答能力没有被测过，就等于假设它一直存在。",
        q_en: "Why are boundary questions (answer not in the corpus) mandatory in the eval set?",
        a_en: "They target the most expensive failure - the model inventing an answer anyway. If refusal is never measured you are assuming it works."
      },
      min: 14,
      path: {
        api: "跑评测：脚本逐题调检索 + 生成接口，把三张指标写进表格；批量跑时注意限流与重试计费\n人工复核：忠实度需人判，导出成带引用链接的表格再逐条勾\n版本管理：评测集与提示词一起放进仓库，键 = 知识库快照版本",
        local: "跑评测：整条链路本地跑，可放心把 50 题全量重跑（成本是机时不是账单），适合每次改切法都跑一遍\n人工复核：同样需要人判；离线环境的优势是敏感问答不用出域也能评测\n版本管理：把评测集与向量库快照一起归档，换 embedding 模型时能重放同一份数据"
      },
      path_en: {
        api: "Run the eval: a script calls retrieval plus generation per question and writes the three metrics into a sheet; watch rate limits and pay for retries\nHuman check: faithfulness needs a human - export a table with clickable citations and tick each row\nVersioning: keep the eval set next to the prompts in the repo, keyed by corpus snapshot",
        local: "Run the eval: the whole chain is local, so re-running all 50 questions after every splitter change is cheap machine time rather than a bill\nHuman check: a human still judges faithfulness, and the upside is that sensitive Q&A can be evaluated without leaving the machine\nVersioning: archive the eval set together with the vector-store snapshot, so a new embedding model can be replayed on identical data"
      }
    },

    /* ========== A3 · c9 现有五节补双轨路径 ========== */
    "c9l1": {
      path: {
        api: "读数处：服务商控制台 → 用量 / 账单，按输入与输出 token 分开看\n控费处：系统提示固定化（可命中前缀缓存）、历史裁剪、单次上限设置",
        local: "账单变成三张表：显存占用、tokens/秒、机器功耗 —— 控制台没有，只能自己采\n控费处换成引擎参数：上下文长度、量化等级、并发数，改一项三项同时动"
      },
      path_en: {
        api: "Where to read: vendor console → usage / billing, viewed separately for input and output tokens\nWhere to control: a fixed system prompt (to hit prefix caching), history trimming, per-request caps",
        local: "The bill becomes three local series: VRAM in use, tokens/second, machine wattage - no console provides them, you sample them yourself\nControls turn into engine flags: context length, quantisation level, concurrency; move one and all three series shift"
      }
    },
    "c9l2": {
      path: {
        api: "估算口径：平均输入 + 输出 token × 单价 × (1 + 重试率)，再乘月请求量\n验证：跑一批真实样本，用账单页的实际数字回推校准",
        local: "估算口径换成：每百万 token 的机时 × 电单价 + 折旧分摊；重试不产生账单，但产生排队与延迟\n验证：同一批样本在本机压测，对比 tokens/秒 与功耗曲线，别用「我觉得挺快」"
      },
      path_en: {
        api: "Estimate: average input + output tokens x unit price x (1 + retry rate) x monthly volume\nValidate: run a real sample batch and calibrate back from the billing page numbers",
        local: "Estimate instead: machine-hours per million tokens x electricity price + depreciation share; retries cost no money but cost queueing and latency\nValidate: stress the same sample locally and compare tokens/second against the power curve - 'feels fast' is not data"
      }
    },
    "c9l3": {
      path: {
        api: "延迟构成：网络往返 + 排队 + 生成；首字延迟看前两项，吞吐看生成\n手段：流式输出、并发请求、缩短提示、必要时换更快的型号",
        local: "延迟构成：没有网络往返，但多了模型加载与显存搬运；批量并发时容易触到显存上限而骤降\n手段：量化降显存、限制并发、常驻服务避免重复加载，长上下文按需开"
      },
      path_en: {
        api: "Latency = network round-trip + server queue + generation; time-to-first-token lives in the first two, throughput in the last\nLevers: stream the output, parallelise requests, shorten the prompt, switch to a faster model when justified",
        local: "Latency has no network term but adds model load and VRAM shuffling; concurrency past the memory ceiling collapses throughput sharply\nLevers: quantise to free VRAM, cap concurrency, keep a warm resident service to avoid reloading, enable long context only when needed"
      }
    },
    "c9l4": {
      path: {
        api: "四招都落在服务商侧：前缀缓存（把固定段放最前）、批处理接口、按任务分层用小模型、历史截断与摘要\n观察点：账单分项与缓存命中率",
        local: "前缀缓存换成常驻会话与前缀复用；批处理 = 把夜间任务排进同一批次跑满显卡\n小模型即小权重，截断省的是显存与 KV cache；观察点是功耗、显存峰值与 tokens/秒"
      },
      path_en: {
        api: "All four levers sit on the vendor side: prefix caching (fixed text first), batch endpoints, a smaller model per task tier, history truncation and summaries\nWhat to watch: billing breakdown and cache hit rate",
        local: "Prefix caching becomes a warm session with reused prefixes; batching means queueing overnight work so the GPU stays saturated\nA smaller model is literally smaller weights, and truncation now saves VRAM and KV cache; watch wattage, VRAM peaks and tokens/second"
      }
    },
    "c9l5": {
      path: {
        api: "选型维度：能力档位、上下文长度、结构化输出与函数调用支持、单价与限流、数据能否出域\n动作：先定「不可让渡项」（隐私、延迟下限），再在可让渡项里比价",
        local: "选型维度换成：权重大小与显存是否装得下、量化后的质量损失、许可证能否商用、工具调用支持程度\n动作：先看能否装下与跑多快，再谈质量；显存不够时「换小模型 + RAG」优先于「硬堆显卡」"
      },
      path_en: {
        api: "Selection axes: capability tier, context length, structured output and tool-calling support, price plus rate limits, whether data may leave the machine\nMove: fix the non-negotiables (privacy, latency floor) first, then compare price only on what is negotiable",
        local: "Selection axes become: weight size versus available VRAM, quality loss after quantisation, licence terms for commercial use, how well tool calling works\nMove: check that it fits and how fast it runs before discussing quality; when VRAM falls short, 'smaller model plus RAG' beats 'buy more GPU'"
      }
    },

    /* ========== A3 前置 · c9l6 本地轨的真实成本 ========== */
    "c9l6": {
      title: "本地轨的真实成本：显存、电与折旧",
      title_en: "What the Local Track Really Costs: VRAM, Power, Depreciation",
      summary: [
        "本地轨不是免费，只是把「按 token 付费」换成「按显存与电费付费」。先会把这三笔账算出来，再谈它到底省不省。",
        "权重显存粗算：参数量 × 每参数字节。7B 在 fp16 约 14GB、int8 约 7GB、int4 约 3.5~4GB；13B / 32B 同比例放大。",
        "真正常卡人的是 KV cache：长上下文时它的量级能与权重相当。每千 token 每层几十 MB 级，4k~32k 上下文的增量必须留进预算，否则表现为频繁换页或直接 OOM。",
        "电费与吞吐绑定：同一台机器满负荷几十到数百瓦。把「每小时能出多少 token」换算成每百万 token 的电钱，才与 API 报价可比。",
        "折旧与闲置也是成本：显卡按 2~3 年摊，没人用时它照样在响。本地轨赢在高频、隐私与可控，输在峰值弹性与运维人力。",
        "别用 API 思维估本地：模型更新、评测重跑、并发排队、故障重启都要人管。隐性工时常常超过电费本身，这是新手最常漏的一项。",
        "结论写成选型表的一行：在什么量级、什么延迟、什么隐私约束下本地更优 —— 把边界条件写清，「本地更便宜」这种一句话结论一定是错的。"
      ],
      summary_en: [
        "The local track is not free; it swaps 'pay per token' for 'pay per VRAM and per kilowatt-hour'. Compute those bills before arguing about whether it saves money.",
        "Weight VRAM, roughly: parameters x bytes per parameter. A 7B model is about 14 GB in fp16, 7 GB in int8, 3.5-4 GB in int4; scale 13B / 32B the same way.",
        "What actually bites is the KV cache: under long context it can reach the same order as the weights. Tens of MB per thousand tokens per layer, so a 4k-32k window must be budgeted - otherwise you see paging stalls or straight OOM.",
        "Electricity is tied to throughput: the same box draws tens to hundreds of watts at load. Convert 'tokens per hour' into cost per million tokens before comparing it with an API price.",
        "Depreciation and idle time are costs too: the card amortises over 2-3 years and hums away with nobody using it. Local wins on volume, privacy and control; it loses on burst headroom and the human time to run it.",
        "Do not size local with API thinking: model updates, re-running evals, queueing for concurrency, crash restarts all need a person. The hidden labour usually exceeds the electricity bill - the item beginners most often omit.",
        "Land the conclusion as one row in the selection table: at what volume, latency and privacy constraint local is better. Write the boundary conditions; 'local is cheaper' as a blanket sentence is always wrong."
      ],
      code: "本地成本粗算模板（每百万输出 token）：\n  显存：权重 GB + KV cache GB ≤ 显卡可用显存 - 安全余量(10~15%)\n  吞吐：tokens/秒 × 3600 = 每小时产量\n  电：满载功率 W ÷ 1000 × 电价 = 每小时电钱；每百万 token 电钱 = 每小时电钱 ÷ 每小时产量 × 1e6\n  折旧：显卡价 ÷ 使用年限 ÷ 年可用小时 → 每百万 token 折旧\n  运维：每次模型更新 / 评测重跑的工时 × 时薪",
      code_en: "Local cost template (per million output tokens):\n  VRAM: weights GB + KV cache GB <= usable VRAM - 10-15% safety headroom\n  Throughput: tokens/second x 3600 = output per hour\n  Power: full-load watts / 1000 x tariff = cost per hour; per million tokens = that / output per hour x 1e6\n  Depreciation: card price / years / usable hours per year -> depreciation per million tokens\n  Operations: person-hours per model update and eval re-run x hourly rate",
      pit: "只算权重不算 KV cache：14GB 的量化模型塞进 16GB 卡，一开长上下文就换页，吞吐断崖下跌，最后归因成「本地模型就是慢」。",
      pit_en: "Budgeting weights but not the KV cache: a 14 GB quantised model fits a 16 GB card until you open a long context, then paging craters throughput and you blame 'local models are just slow'.",
      ex: {
        q: "什么情况下本地轨即使「更慢更贵」也仍然该选？",
        a: "数据不能出域（医疗、法务、内部代码）、需要无限重跑评测、或量大到 API 账单已超过设备折旧与电费时 —— 判据是约束与量级，不是单价。",
        q_en: "When should you still pick the local track even though it is slower and dearer?",
        a_en: "When data may not leave the building (medical, legal, internal code), when you need to re-run evals without limit, or when volume has grown past the point where the API bill exceeds depreciation plus power. The test is constraints and volume, not unit price."
      },
      min: 15,
      path: {
        api: "对照基线：先按 c9l1 / c9l2 算出 API 轨的每百万 token 成本与 P95 延迟，写成一行\n再问三个「能不能」：数据能否出域、峰值能否被限流、口径能否接受云端留存\n三问有一个「不能」，本地轨就从「省钱选项」变成「必选」",
        local: "量显存：跑推理引擎的显存面板，分别记录权重、KV cache、空闲；再按 0.8 上限定并发\n量吞吐：固定提示跑 5 分钟，记 tokens/秒 与温度/功耗；换量化等级重测一次\n量电费：功率计或系统功耗读数 × 当地电价，换算到每百万 token 并入选型表"
      },
      path_en: {
        api: "Set the baseline first: compute cost per million tokens and P95 latency for the API track (lessons c9l1 / c9l2) and write it as one row\nThen ask three 'can it': may the data leave, can the peak survive rate limits, is cloud retention acceptable under your definitions\nIf any one answer is no, the local track stops being a saving and becomes mandatory",
        local: "Measure VRAM: read the engine's memory panel, logging weights, KV cache and free space separately, then cap concurrency at about 0.8 of the ceiling\nMeasure throughput: run a fixed prompt for five minutes, record tokens/second plus power and temperature, and repeat per quantisation level\nMeasure power: a watt-meter or OS power reading x local tariff, converted to cost per million tokens and folded into the selection table"
      }
    }
  },

  /* ========== 新节配套：题库（题内自带 *_en） ========== */
  quizAdd: {
    c5: [
      {
        q: "正确段落已被召回，但排在第 8 名，答案仍出错。最对症的改动是什么？",
        o: ["把 top-k 提高到 50", "加一层重排（cross-encoder）", "换更大的生成模型", "把提示改成英文"],
        a: 1,
        why: "「召回了但排得靠后」正是精排的适用信号。加大 top-k 会把噪音一起送进上下文，换模型解决不了「没看到重点」。",
        q_en: "The right chunk was retrieved but ranked 8th, and the answer is still wrong. What is the targeted fix?",
        o_en: ["Raise top-k to 50", "Add a reranking stage (cross-encoder)", "Switch to a bigger generation model", "Rewrite the prompt in English"],
        why_en: "'Retrieved but ranked low' is exactly what reranking is for. Pushing top-k higher feeds in noise with the signal, and a bigger model cannot attend to what it never prioritised.",
        type: "choice"
      },
      {
        q: "混合检索的价值在于向量与关键词互补，但两路结果仍需去重与融合后才能进提示。",
        o: ["正确", "错误"],
        a: 0,
        why: "两路分数不可直接比较，也常召回同一片段的相邻块；不去重不融合，等于把重复内容当成多份证据。",
        q_en: "Hybrid retrieval works because vector and keyword search complement each other, but the two lists still need deduping and fusion before entering the prompt.",
        o_en: ["True", "False"],
        why_en: "The two score scales are not comparable, and both lists often return neighbouring chunks of the same passage; without dedupe and fusion you are counting duplicate text as extra evidence.",
        type: "judge"
      }
    ],
    c9: [
      {
        q: "本地部署时，只按参数量估算显存、忽略 ____ cache，长上下文下吞吐会断崖下跌。",
        o: [],
        a: "KV",
        why: "KV cache 随上下文长度线性增长，量级能与权重相当；预算里必须一起留，否则表现为换页或 OOM。",
        q_en: "When deploying locally, sizing VRAM from parameter count alone and ignoring the ____ cache makes throughput collapse under long context.",
        o_en: [],
        a_en: "KV",
        why_en: "The KV cache grows linearly with context length and can match the weights in magnitude; budget it too, or you get paging stalls or OOM.",
        type: "fill"
      }
    ]
  },

  /* ========== 知识层同步（D27 教训：新内容必须进名词库与概念地图） ========== */
  terms: [
    {
      term: "重排", term_en: "Reranking", cat: "工程与运维",
      short: "对召回出的少量候选段逐对重新打分，取最相关的几段进提示；召回靠广，精排靠准。",
      short_en: "Re-scoring a small candidate set pair by pair and keeping the most relevant chunks for the prompt: recall casts wide, ranking decides.",
      detail: [
        "只在已召回的候选里排序，所以永远救不回没被召回的段落 —— 那是切片与 embedding 的责任。",
        "成本按候选段数线性增长，重排自身也要计费或占显存，top-50 精排不是「免费的准」。"
      ],
      detail_en: [
        "It only reorders what recall returned, so it can never rescue a chunk that was never retrieved - that is the job of chunking and embeddings.",
        "Cost scales linearly with candidate count, and the reranker itself is billed or takes VRAM; reranking top-50 is not precision for free."
      ],
      vs: "召回阶段像捞鱼（别漏），重排像挑鱼（别错）：两段分开量指标，才知道该调哪一个。",
      vs_en: "Retrieval casts the net wide; reranking picks the fish. Measure the two separately or you will not know which one to fix."
    },
    {
      term: "混合检索", term_en: "Hybrid Search", cat: "工程与运维",
      short: "向量检索与关键词检索并行，再去重与融合；用它补语义相似看不见的否定、编号与稀有词。",
      short_en: "Running vector and keyword search in parallel, then deduping and fusing: it covers the negations, IDs and rare terms that semantic similarity misses.",
      detail: [
        "两路分数不可比，融合常用倒数排名（RRF）：只用名次，几乎无需调参。",
        "索引要建两套，更新与清理也得做两遍；只更新一套会让两路结果长期不一致。"
      ],
      detail_en: [
        "Because the two score scales are incomparable, fusion usually uses reciprocal rank (RRF): ranks only, almost no tuning.",
        "You maintain two indexes, so updates and deletions happen twice; refreshing only one leaves the two lists silently out of sync."
      ],
      vs: "它解决的是「召不回来」，重排解决的是「回来了但排后面」：两者针对不同的失败模式。",
      vs_en: "Hybrid search fixes 'we never got it back'; reranking fixes 'we got it back too late'. Different failure modes, different tool."
    },
    {
      term: "显存预算", term_en: "VRAM Budget", cat: "工程与运维",
      short: "本地轨的容量账：权重 + KV cache + 安全余量 ≤ 可用显存；缺一项估算就会在长上下文时爆。",
      short_en: "The local track's capacity maths: weights + KV cache + safety headroom <= usable VRAM. Miss one term and it blows up under long context.",
      detail: [
        "量化省的是权重那一项，上下文长度决定 KV cache 那一项，两者不是同一笔钱。",
        "显存不足的表现常常不是崩溃，而是换页导致的骤慢 —— 会被误判成「模型太慢」。"
      ],
      detail_en: [
        "Quantisation shrinks the weights term; context length drives the KV cache term. They are two different bills.",
        "Running short usually shows up as paging-induced slowdown rather than a crash, which gets misread as 'this model is slow'."
      ],
      vs: "它对标的是 API 轨的「每百万 token 单价」：一个是容量约束，一个是账单约束。",
      vs_en: "Its counterpart on the API track is cost per million tokens: one is a capacity constraint, the other a billing constraint."
    }
  ],

  /* 概念地图只加 1 个节点：agent 站的地图在 28 节点时实测零相碰、零出框，
     加满 3 个（→31）就出现 4 处胶囊重叠（既有节点之间的角度被重排挤到一起）。
     按「不劣于基线」的规矩收窄规模，只把最中心的「重排」接进图里；
     其余两个概念保留在名词库（术语 3 条），地图容量问题统一挂在 D28。 */
  mapAdd: {
    nodes: [
      { id: "重排", tier: 2 }
    ],
    edges: [
      { a: "重排", b: "RAG", zh: "二段精排", en: "second-stage ranking" }
    ]
  }
};
