/* ================================================================
 * R0:hello agent · 课程深化层 ⑤（R4 续批：A2 补全上线闭环 + 双轨覆盖 c12/c13 + D29 英文解析）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 本层三件事（机制见 index.html 的 agMergeLesson / agApplyCompanion）：
 *   A2  c13 上线从 6 节扩到 8 节：新增「需求定义与可验收目标」（排在最前）与
 *       「上线后的反馈回环与数据回流」（收口），把产品化闭环补完整
 *   A3  c12 / c13 共 14 节课补 path.api / path.local 双轨路径（含 path_en）
 *   D29 用 quizEn 通路补 c12 / c13 全部 18 道既有题的英文题干、选项与解析
 * 口径不变：只写稳定行为差异，不写价格与版本断言；中英条数一致。
 * ================================================================ */

const DEEPEN_AGENT_E = {

  stages: ["c12", "c13"],

  /* 新节位置：需求定义放在章首（它是所有后续决策的前提），反馈回环放在章尾收口 */
  order: {
    c13: ["c13l7", "c13l1", "c13l2", "c13l3", "c13l4", "c13l5", "c13l6", "c13l8"]
  },

  lessons: {

    /* ==================== A3 · c12 五条课节的双轨路径 ==================== */
    "c12l1": {
      title: "三条路：提示 / RAG / 微调 怎么选", title_en: "Three Paths: Prompt vs RAG vs Fine-tuning",
      path: {
        api: "顺序不变：先把提示与上下文做好 → 再上 RAG（云端向量库 + 检索）→ 最后才考虑厂商微调接口\n判定条件：资料会变、要能溯源、要能引用 → 停在 RAG；要的是格式与风格稳定 → 才进微调\n注意：提交微调意味着数据出域，先过合规这一关",
        local: "同样三步，但每一步的约束换成显存：RAG 需要本地索引与小号 embedding 模型；微调需要能装下基座 + 梯度\n微调可行性看参数量与量化：4-bit 基座 + LoRA 才谈得上消费级显卡\n判定条件同上，差别是「微调要自己排任务、自己存 checkpoint」"
      },
      path_en: {
        api: "Same order: fix the prompt and context first → add RAG (managed vector store plus retrieval) → only then consider the vendor fine-tuning endpoint\nDecision rule: if the knowledge changes, must be traceable and citable, stop at RAG; what fine-tuning buys is stable format and style\nNote: submitting a fine-tune job means the data leaves your boundary - clear compliance first",
        local: "Same three steps, but each constraint becomes VRAM: RAG needs a local index and a small embedding model; fine-tuning needs base weights plus gradients to fit\nFeasibility is set by parameter count and quantisation: a 4-bit base plus LoRA is what makes consumer GPUs realistic\nSame decision rule; the difference is that you queue the training job and keep the checkpoints yourself"
      }
    },
    "c12l2": {
      path: {
        api: "不自己训：整理数据集 → 上传到厂商微调接口 → 按训练量计费 → 得到一个专属模型端点\n交付形态：新端点名 + 定价 + 速率限制；回滚 = 指回旧端点\n约束：数据格式按厂商 schema（messages 型 JSONL），字段不合会被整批拒收",
        local: "自己跑训练脚本：基座权重 + LoRA 适配器，QLoRA 把基座量化到 4-bit 才谈得上单卡\n要预留：训练显存、checkpoint 磁盘、验证集评估的机时；中断要能续训\n交付形态：适配器文件（几十 MB）+ 基座名 + 合并脚本，可挂载到任意推理引擎"
      },
      path_en: {
        api: "No training of your own: prepare the dataset → upload to the vendor fine-tune API → billed by training volume → you get a dedicated model endpoint\nDeliverable: a new endpoint name with its price and rate limits; rollback means pointing back to the old endpoint\nConstraint: the format follows the vendor schema (messages-style JSONL); a bad field rejects the whole batch",
        local: "You run the training script: base weights plus a LoRA adapter, with QLoRA quantising the base to 4-bit so a single card is plausible\nReserve for: training VRAM, checkpoint disk space and evaluation machine time; an interrupted run must be resumable\nDeliverable: an adapter file (tens of MB) plus the base model name and a merge script, mountable on any inference engine"
      }
    },
    "c12l3": {
      path: {
        api: "上传前必做：脱敏（姓名、账号、内部编号）与授权确认 —— 数据集一旦出域就收不回来\n格式：按厂商 schema 生成 JSONL，字段名与角色拼写严格一致\n校验：脚本先跑一遍格式与重复检查，再抽样 20 条人工看答案口径是否统一",
        local: "数据不出域，但工程责任回到你身上：版本、切分、校验集与去重都要自己管\n用脚本产出 train / val 切分并归档哈希，保证下次重跑用的是同一份数据\n校验集留 10~20% 且从不参与训练；一旦用它调过提示，它就成了训练集"
      },
      path_en: {
        api: "Before upload: scrub (names, accounts, internal IDs) and confirm rights - once a dataset leaves, you cannot recall it\nFormat: generate JSONL to the vendor schema; field names and role spellings must match exactly\nCheck: run a script pass for shape and duplicates, then eyeball 20 sampled rows for a consistent answer style",
        local: "Data stays in, but the engineering ownership is yours: versions, splits, validation set and dedupe all land on you\nProduce train / val splits with a script and archive their hashes, so a re-run uses the identical dataset\nKeep 10-20% as a validation set that never trains - prompt-tune on it and it silently becomes training data"
      }
    },
    "c12l4": {
      path: {
        api: "教师是云端模型：采它的输出要按 token 计费，采集量 × 单价先算清\n条款要读：部分服务条款限制「用输出训练竞品模型」，商用前确认\n学生部署：蒸馏完把小模型换成 API 端点或本地实例，比较每百万 token 成本",
        local: "教师与学生在同一台机器：夜间批量跑采集，显存分时复用（先推理采集、再释放去训练）\n好处是可以无限量采、可采中间推理链；代价是机时与磁盘\n学生常以量化形式部署到端侧，教师质量就是学生的天花板"
      },
      path_en: {
        api: "The teacher is a hosted model: collecting its output is billed per token, so compute volume x price before you start\nRead the terms: some licences restrict using outputs to train competing models - confirm before commercial use\nStudent deployment: after distillation, swap it in for the API endpoint or a local instance and compare cost per million tokens",
        local: "Teacher and student share one machine: batch the collection overnight, time-sharing VRAM (infer and collect, then free it for training)\nThe upside is unlimited sampling, including intermediate reasoning chains; the price is machine time and disk\nThe student usually ships quantised to the edge, and the teacher's quality is its ceiling"
      }
    },
    "c12l5": {
      path: {
        api: "多模态走云端接口：图片 / 音频按输入 token 计费，长图与多页文档要先切图与压缩\nembedding 用云端模型：索引维度一旦选定，换模型等于重建全库\n复核：关键数字（金额、日期）必须 OCR 或人工二次核对，识别错误不会报错",
        local: "视觉模型吃显存：单图分辨率与批次大小要按剩余显存预算定；离线也能整库重建索引\nembedding 换本地模型时重建是机时成本，不是账单，反而更适合频繁调参\n复核同样必要：本地跑 OCR 与视觉模型双通道交叉验证，比单次信任便宜得多"
      },
      path_en: {
        api: "Multimodal goes through a hosted endpoint: images and audio bill as input tokens, so crop and compress long documents first\nEmbeddings come from a hosted model: the vector dimension is a commitment - switching models means rebuilding the whole index\nVerify: critical figures (amounts, dates) must be cross-checked with OCR or a human; recognition errors fail silently",
        local: "Vision models eat VRAM: pick image resolution and batch size from the remaining memory budget; a full index rebuild runs offline\nSwapping to a local embedding model costs machine time rather than money, which actually invites more experimentation\nVerification is just as required: run local OCR and the vision model as two channels and cross-check them - far cheaper than trusting one pass"
      }
    },

    /* ==================== A3 · c13 既有六节的双轨路径 ==================== */
    "c13l1": {
      path: {
        api: "形态选择：脚本 → 定时任务 → 常驻小服务即可，无需为推理准备 GPU\n真正要设计的是密钥与出口：密钥放环境变量 / 密钥服务，前端绝不直连\n放大路径：先单机服务，再考虑托管平台；不要一上来就上集群",
        local: "形态由显存决定：要么常驻服务（模型一直占着显存、响应快），要么按需加载（省显存、首次慢）\n单机 GPU 就是全部预算：并发一超过显存就换页骤慢，先限并发再谈扩容\n没有 serverless GPU 的默认假设：弹性峰值要靠排队与降级，而不是加机器"
      },
      path_en: {
        api: "Shape: script → scheduled task → a small resident service is enough; no GPU provisioning on your side\nWhat actually needs designing is the key and the egress: keys live in env vars or a secrets service, the frontend never calls the vendor directly\nGrowth path: single-box service first, then a hosting platform - do not start with a cluster",
        local: "Shape is set by VRAM: either a warm resident service (model stays loaded, fast response) or load-on-demand (saves memory, slow first call)\nOne GPU box is the whole budget: past the memory ceiling you page and crawl, so cap concurrency before talking about scaling\nNo serverless-GPU default: absorb peaks with queuing and graceful degradation, not by adding machines"
      }
    },
    "c13l2": {
      path: {
        api: "四类处理：429 限流 → 指数退避 + 抖动 + 尊重 Retry-After；5xx → 有限次重试；4xx → 修输入不重试\n并发要设上限（信号量 / 队列），并给账户级配额做告警\n超时按「首字」和「总时长」分别设，流式输出下别用总超时误杀正常请求",
        local: "没有 429，但瓶颈换成显存与队列：并发一超上限就是 OOM 或骤慢，需要自己实现请求队列与最大并发\n重试对象是「引擎崩溃 / 加载失败」，重启动作要幂等且带退避\n超时表现为卡住而非报错：必须设看门狗（心跳或任务级超时），否则故障静默"
      },
      path_en: {
        api: "Four cases: 429 → exponential backoff with jitter, honour Retry-After; 5xx → bounded retries; 4xx → fix the input, do not retry\nCap concurrency (semaphore or queue) and alert on account-level quota usage\nSet timeouts separately for first token and total duration - with streaming, a single total timeout kills healthy requests",
        local: "There is no 429; the bottleneck is VRAM and queueing: exceed it and you get OOM or a crawl, so implement your own queue and max-concurrency cap\nWhat you retry is engine crashes and load failures; restart must be idempotent and backed off\nFailures look like hangs, not errors: you need a watchdog (heartbeat or task timeout) or they stay silent"
      }
    },
    "c13l3": {
      path: {
        api: "定时任务注意配额与批量接口：大批量放到低峰窗口，重试要有次数上限\n重跑要幂等：给每条记录一个外部键，处理前查是否已做过\n密钥不要写进脚本文件：放任务环境变量，并设用量上限与告警",
        local: "定时唤醒要防「机器睡了就错过」：加「上次成功时间」看门狗，超时未跑就告警而不是静默\nGPU 是独占资源：训练/批推任务与在线服务要错峰或用队列互斥\n模型升级要在任务里固定版本号，否则某天结果悄然变化"
      },
      path_en: {
        api: "Scheduled jobs should respect quota and batch endpoints: run bulk work off-peak and cap retries\nRe-runs must be idempotent: give each record an external key and check whether it was already processed\nNever put the key in the script file: inject it via task environment, and set a usage cap with alerts",
        local: "Guards against 'the machine was asleep so the job was missed': keep a last-success watchdog and alert on staleness rather than failing silently\nThe GPU is exclusive: schedule training and batch inference to interleave with online serving, or gate them with a mutex queue\nPin the model version inside the task, or one day the outputs change with no code change"
      }
    },
    "c13l4": {
      path: {
        api: "索引：文件变更 → 切块 → 调云端 embedding 批量写入 → 记录来源与页码\n查询：检索 top-k → 拼接 → 生成，按 token 计费，高频问答加结果缓存\n留痕：把命中片段 id 与模型参数一起存，便于事后复现坏例子",
        local: "索引：本地监听目录做增量索引，重跑整库只是机时成本\n查询：本地推理引擎一次并发有限，问答高峰要排队；长上下文按需开\n留痕同样要做，而且离线可完整重放 —— 这是本地轨调试的最大优势"
      },
      path_en: {
        api: "Indexing: file changes → chunk → batch the hosted embedding API → store source and page\nQuery: retrieve top-k → assemble → generate, billed per token, so cache frequent answers\nTrace: store the hit chunk ids with the model parameters so a bad answer can be replayed later",
        local: "Indexing: watch the folder locally and re-index incrementally; a full rebuild is just machine time\nQuery: the local engine serves limited concurrency, so peak Q&A queues; enable long context only when needed\nKeep the same traces - and offline you can replay the whole thing, which is the local track's biggest debugging advantage"
      }
    },
    "c13l5": {
      path: {
        api: "清单里必查：用量上限与告警、密钥轮换计划、数据出域与留存条款、供应商故障降级方案\n灰度：新版本先给少数场景，比对返工率与成本\n回滚：切回旧端点名即可，但要确认旧端点仍在配额内",
        local: "清单里必查：显存水位与并发上限、模型版本固定与哈希、量化等级记录、断电重启后自恢复\n灰度：先在一台机器或一个任务上试，比对吞吐与温度（降频即风险信号）\n回滚：保留上一版适配器与基座组合，回滚脚本要先在测试环境跑通"
      },
      path_en: {
        api: "Non-negotiable checklist items: usage caps and alerts, a key rotation plan, data-egress and retention terms, and a fallback when the vendor degrades\nCanary: ship the new version to a few flows first, comparing rework rate and cost\nRollback: point back to the old endpoint name - but confirm it still has quota",
        local: "Checklist becomes: VRAM headroom and concurrency cap, pinned model version plus hash, recorded quantisation level, self-recovery after reboot\nCanary: try it on one machine or one task first, comparing throughput and temperature (throttling is the warning)\nRollback: keep the previous adapter-plus-base pair, and rehearse the rollback script in a test environment first"
      }
    },
    "c13l6": {
      path: {
        api: "看三类：账单与每请求 token、429/5xx 比例与 P95 延迟、质量指标（拒答率、返工率）\n供应商侧故障要能识别：错误码分布突变 + 全量变慢 = 上游问题，不是你的代码\n告警要带请求 id 与提示版本，否则只能重新复现一遍才知道原因",
        local: "看硬件与服务：显存占用与峰值、GPU 利用率、队列长度与等待时间、温度与功耗\n「没挂但变慢」多半是换页或散热降频 —— 这两类在传统存活监控里完全看不见\n质量指标同样要采：本地跑评测集做回归，模型版本一变动就重跑"
      },
      path_en: {
        api: "Watch three groups: spend and tokens per request; 429/5xx rates with P95 latency; quality (refusal rate, rework rate)\nLearn to spot vendor incidents: a sudden shift in error codes plus uniform slowdown means upstream, not your code\nAlerts must carry the request id and prompt version, otherwise you re-create the failure before diagnosing it",
        local: "Watch hardware and service: VRAM used and peak, GPU utilisation, queue length and wait time, temperature and power\n'Still alive but slow' is usually paging or thermal throttling - invisible to classic liveness monitoring\nCollect quality metrics too: run the local eval set as a regression gate whenever the model version changes"
      }
    },

    /* ==================== A2 · c13l7 需求定义与可验收目标 ==================== */
    "c13l7": {
      title: "需求定义与可验收目标：先写清「怎样算成」",
      title_en: "Define the Need: Write Down What Counts as Success",
      summary: [
        "上线前最难的一步不是选型，而是把「我想做个东西」改写成能被验收的句子：谁、在什么场景、多久一次、现在花多少时间、做完能省到哪一步。",
        "可验收目标必须能回答「什么情况下算失败」。写成 指标 + 阈值 + 时间窗：例如 85% 的周报在三分钟内产出，且口径与人工版一致，连续两周达成。",
        "目标分三层一起定：结果指标（省下的时间、减少的错误）、过程指标（首次通过率、返工率）、护栏指标（成本上限、敏感信息零外发）。只定结果指标，等于默许拿成本和隐私换效果。",
        "拒绝「效果要好、要智能」这类目标：它们无法判失败，因此永远算成功。含糊的目标不是乐观，是给三个月后的争吵留种子。",
        "动手前先做手工对照：亲手完成 3~5 个真实样本，记下每步耗时与出错点。没有这一步，你并不知道自己要替代的到底是什么，也无从判断 AI 是否真的更快。",
        "把边界写下来：in-scope / out-of-scope，以及例外处理路径。模型遇到不该处理的材料时应当停下并转人工 —— 这比「它很少出错」要更早写进需求。",
        "把验收条件放在项目第一页，并注明判据来源。将来决定「还继续投吗」的时候，能对照的是当初的目标，不是最近的印象或某次演示的好看程度。"
      ],
      summary_en: [
        "The hardest step before shipping is not picking technology; it is rewriting 'I want to build something' into a sentence that can be accepted: who, in what situation, how often, what it costs in time today, and which step it removes.",
        "An acceptable goal must answer 'what would count as failure'. Write it as metric + threshold + window: for instance, 85% of weekly reports produced within three minutes with the same figures as the manual version, sustained for two weeks.",
        "Set three layers together: outcome metrics (hours saved, errors avoided), process metrics (first-pass rate, rework rate) and guardrail metrics (cost ceiling, zero leakage of sensitive data). Outcome metrics alone silently license buying results with cost and privacy.",
        "Refuse goals like 'it should work well and feel smart': they cannot fail, so they always succeed. Vagueness is not optimism - it is a seed planted for an argument three months from now.",
        "Do a manual baseline first: complete 3-5 real cases by hand and note the time and the failure points at each step. Without it you do not know what you are replacing, so you cannot tell whether AI is actually faster.",
        "Write the boundaries: in scope, out of scope, and the exception path. When the model meets material it should not handle, it must stop and hand off to a person - that belongs in the requirements long before 'it rarely makes mistakes'.",
        "Put the acceptance criteria on the first page of the project, with where they came from. When someone asks 'do we keep investing?', what gets compared is the original target - not the vividness of last week's demo."
      ],
      code: "一句话目标 → 可验收目标的改写：\n  ✗ 做一个智能周报助手\n  ✓ 指标：每周经营周报的产出耗时 从 180 分钟 → 20 分钟\n  ✓ 阈值：数字口径与人工版一致（抽样 10 份核对）\n  ✓ 时间窗：连续 2 周达成，且成本 ≤ 每份 1 元等值\n  护栏：不引用未脱敏的客户姓名；异常时停下转人工\n  边界：只做经营周报；项目周报与人事月报不在范围",
      code_en: "Rewriting a one-liner into an acceptable goal:\n  X  Build a smart weekly-report assistant\n  OK Metric: time to produce the business weekly report 180 min → 20 min\n  OK Threshold: figures match the manual version (spot-check 10 copies)\n  OK Window: achieved for 2 consecutive weeks, cost at or below the agreed ceiling per report\n  Guardrail: never cite unscrubbed customer names; stop and hand off on anomalies\n  Scope: business weekly reports only; project and HR reports are out of scope",
      pit: "需求停在「做一个智能助手」这种句子：上线后没人能判断它算不算成功，评价退化成「我觉着不太好用」，投入就在没有争论结果的情况下悄悄停摆。",
      pit_en: "Leaving the requirement at 'build a smart assistant': nobody can later judge whether it succeeded, feedback degrades into 'feels a bit useless', and the project quietly stalls without ever losing an explicit argument.",
      ex: {
        q: "为什么护栏指标必须与结果指标一起定？",
        a: "只定结果指标会默许拿成本、隐私或安全去换效果；护栏把不可让渡的约束固定下来，让权衡变成显式决策而不是临时妥协。",
        q_en: "Why must guardrail metrics be set alongside outcome metrics?",
        a_en: "Outcome metrics alone license buying results with cost, privacy or safety. Guardrails fix the non-negotiables, so the trade-off becomes an explicit decision instead of an ad-hoc compromise."
      },
      min: 13,
      path: {
        api: "手工对照阶段就要记成本：把 3~5 个样本的输入输出 token 记下来，作为 API 轨的成本基线\n目标里写进「供应商侧不可控项」：限流、模型下线与价格变化都要有降级路径\n验证用评测集：与 c11 的评测集共用一份，验收与后续回归用同一把尺",
        local: "手工对照阶段记的是机时与显存：同样的样本在本地跑一遍，写下耗时、并发上限与失败点\n目标要含容量边界：峰值请求量超过单机吞吐时怎么办（排队、降级还是回 API 轨）\n评测集离线可反复重放，把「回归成本」设得很低 —— 这允许更严格的验收阈值"
      },
      path_en: {
        api: "Record cost during the manual baseline: capture input and output tokens for your 3-5 samples as the API-track baseline\nWrite vendor-uncontrollable items into the goal: rate limits, model deprecations and price changes each need a fallback path\nValidate with the eval set: share one with chapter c11, so acceptance and later regressions use the same ruler",
        local: "The manual baseline records machine time and VRAM: run the same samples locally and note duration, concurrency ceiling and failure points\nGoals must include capacity limits: what happens when peak demand exceeds one box (queue, degrade, or fall back to the API track)\nOffline eval sets replay cheaply, so regression cost is near zero - which lets you hold a stricter acceptance threshold"
      }
    },

    /* ==================== A2 · c13l8 反馈回环与数据回流 ==================== */
    "c13l8": {
      title: "上线后的反馈回环与数据回流",
      title_en: "After Launch: Feedback Loop and Data Return",
      summary: [
        "上线不是终点而是数据采集的起点。没有反馈回环，你拥有的只是「它在跑」，而不是「它在变好」的证据。",
        "三类信号都要留：显式评分（赞/踩加一句话）、隐式行为（重问、改写提示、复制后又删、中途放弃）、以及人工抽检。只看显式评分，样本又稀疏又偏激。",
        "每条反馈都要能追溯到当时的输入版本：绑定提示版本、模型与参数、检索命中的片段 id。否则坏例子无法复现，也就无法修 —— 只能「再试一次」。",
        "建「坏例子队列」而不是「错误率统计」：每周固定处理 N 条真实失败样本，每修好一条就补一条进评测集，让评测集长在生产现实上，而不是长在你的想象上。",
        "回流先过合规这一道门：用户内容能否用于改进、是否需要脱敏、能保留多久 —— 规则先定下来再采集，反过来做就是给自己埋雷。",
        "变更走灰度，不走「整体切换」：新版本先接 5%~20% 的流量或少数用户，盯住返工率、成本、拒答率不回退再逐步放量。",
        "给回环定节奏和责任人：每周一次坏例子评审、每月一次评测集版本升级、每季度重审护栏指标。没有节奏的回环，两周内就会停摆 —— 工具留着，没人再看。"
      ],
      summary_en: [
        "Launch is where data collection starts, not where work ends. Without a feedback loop you have evidence that it runs, not that it improves.",
        "Keep all three signals: explicit ratings (thumb plus one line), implicit behaviour (re-asking, rewriting the prompt, copying then deleting, abandoning mid-way) and human spot checks. Explicit ratings alone are sparse and self-selecting toward extremes.",
        "Every piece of feedback must trace back to the input as it was: bind the prompt version, model and parameters, and the ids of the chunks that were retrieved. Otherwise a bad case cannot be replayed, so it cannot be fixed - only wished at.",
        "Build a bad-example queue, not an error-rate chart: process a fixed N of real failures every week, and for each one you fix, add one case to the eval set. The eval set then grows from production reality rather than from your imagination.",
        "Data return passes the compliance gate first: may user content improve the model, must it be scrubbed, how long may it be kept. Set the rules before you collect; the other order buries a landmine with your name on it.",
        "Ship changes as canaries, not flip-the-switch upgrades: 5-20% of traffic or a handful of users first, watching rework rate, cost and refusal rate for no regression, then widen.",
        "Give the loop a cadence and an owner: a weekly bad-example review, a monthly eval-set version bump, a quarterly guardrail re-check. A loop without a cadence stops within two weeks - the dashboards stay up, nobody looks."
      ],
      code: "反馈记录最小字段：\n  ts | user_flow | prompt_ver | model+params | hit_chunk_ids\n  explicit: up/down + note\n  implicit: reask / rewrite / abandoned / copied\n  disposition: fixed | known-limit | wont-fix (+ 是否已进评测集)\n周节奏：坏例子评审 30min → 修 1~3 条 → 补测试 → 记版本",
      code_en: "Minimal fields on a feedback record:\n  ts | user_flow | prompt_ver | model + params | hit_chunk_ids\n  explicit: up/down + note\n  implicit: reask / rewrite / abandoned / copied\n  disposition: fixed | known-limit | wont-fix (+ did it enter the eval set)\nWeekly cadence: 30-minute bad-example review → fix 1-3 → add tests → log the version",
      pit: "埋了一堆日志却没人回看，「数据回流」成了技术表演。真正的闭环是每周有人据此改掉一个具体失败模式 —— 没有这个动作，采集得再多也只是存储成本。",
      pit_en: "Logging everything and reviewing nothing, where 'data return' becomes a technical performance. A real loop is someone acting on it weekly to remove one concrete failure mode; without that, more collection is just more storage cost.",
      ex: {
        q: "为什么只看用户点赞率会误导迭代方向？",
        a: "点赞样本稀疏且偏向极端，回答漂亮但错误也可能获赞；必须叠加隐式行为信号与人工抽检，才能看见真实的失败。",
        q_en: "Why does tracking only the thumbs-up rate mislead the roadmap?",
        a_en: "Ratings are sparse, skewed toward extremes, and a fluent-but-wrong answer still earns praise. Implicit behaviour signals plus human spot checks are what make real failures visible."
      },
      min: 12,
      path: {
        api: "反馈落库要带供应商侧可回查的字段：request id、模型版本、用量数 —— 供应商改行为时这些是唯一线索\n灰度靠端点切换实现：新旧提示或新旧模型各挂一个端点，按比例分流\n留存与出域要写清：反馈数据含用户内容时，云端保留期与用途需在合规范围内",
        local: "反馈可完整重放：同一份输入 + 同一版本模型能在本机精确复现，坏例子修起来最快\n灰度用双实例：同一台机器上按队列比例分配新旧模型或提示，比对吞吐与质量\n数据不出域，但留存策略仍要定：谁有权访问反馈库、保留多久、用于改进是否需要单独同意"
      },
      path_en: {
        api: "Store vendor-referencable fields with feedback: request id, model version, usage numbers - the only trail you have when the vendor changes behaviour\nCanary by endpoint swap: point old and new prompts or models at separate endpoints and split traffic by share\nRetention and egress must be explicit: feedback contains user content, so cloud retention limits and permitted uses fall inside your compliance scope",
        local: "Feedback replays exactly: the same input on the same model version reproduces the case locally, which makes bad examples the fastest kind of bug to fix\nCanary with two instances: split old and new prompts or models by queue share on one box, comparing throughput and quality\nData stays in, but a retention policy is still required: who may read the feedback store, for how long, and whether improvement use needs separate consent"
      }
    }
  },

  /* ==================== D29 · 补 c12 / c13 全部既有题的英文（字段级合并，不动已有 q/o） ==================== */
  quizEn: {
    "要让模型掌握公司内部最新知识，首选方案是？": { why: "For knowledge needs, prefer RAG: updatable, traceable and cheaper." },
    "LoRA 只需训练极少量的适配器参数。": { why: "LoRA freezes the base and trains only low-rank adapters, cutting VRAM and cost sharply." },
    "微调效果七成取决于___（填：数据）。": { a: "data", why: "Data quality is the decisive factor in fine-tuning results." },
    "蒸馏的主要目的是？": { why: "Distillation has a small model imitate a large one to lower serving cost." },
    "知识更新频繁的场景，为什么优先 RAG 而不是微调？": { why: "RAG only updates the document store; fine-tuning must retrain - slow and costly." },
    "多模态模型可以直接接收图片作为输入。": { why: "Multimodal models accept images, e.g. reading a table screenshot or a receipt." },
    "公司资料频繁更新，要让模型用上最新资料应优先选择？": { q: "Company documents change constantly - what should you pick so the model uses the latest material?", o: ["Fine-tuning", "RAG", "Distillation", "A bigger model"], why: "RAG takes effect as soon as the material updates; fine-tuning needs retraining, which is too slow and costly for frequent changes." },
    "LoRA 能让消费级显卡微调大模型的关键是？": { q: "What lets LoRA fine-tune a large model on a consumer GPU?", o: ["Shortening the output", "Freezing the base and training only a tiny adapter matrix", "Using a larger batch", "Disabling safety alignment"], why: "Far fewer trainable parameters slash VRAM demand; QLoRA then quantises the base to 4-bit." },
    "微调数据要留出 10~20% 作为___，用于判断是否过拟合（填：验证集 / 训练集）。": { q: "Hold out 10-20% of fine-tuning data as the ___ to judge overfitting (validation set / training set).", a: "validation set", why: "Performance on the training set proves nothing about generalisation; the validation set is the yardstick." },
    "个人自用的大模型自动化任务，最简单合适的部署形态是？": { why: "For personal use, a script plus a scheduler is enough - avoid over-engineering." },
    "对 400（参数错误）也应该无脑重试直到成功。": { why: "4xx is a bad-input problem; retrying cannot fix it - correct the input instead." },
    "遇到 429 限流时应采用___重试（填：退避 / 立即）。": { why: "Backoff avoids hammering the rate-limit threshold.", a: "backoff" },
    "上线检查清单中，防止成本失控的关键一项是？": { why: "Usage caps plus alerts are the core protection against runaway spend." },
    "让长任务「可以安全重试」的关键是？": { why: "Only idempotent steps make retries safe - avoiding duplicate charges or duplicate sends." },
    "告警里应带上请求 ID 与错误类型，方便定位。": { why: "An alert without locating information only tells you 'it exploded'." },
    "自动化脚本最重要的安全属性是？": { q: "What is the most important safety property of an automation script?", o: ["Speed", "Idempotence (re-running causes no extra side effects)", "Fewer lines of code", "Using the latest framework"], why: "Unattended work can be triggered repeatedly; only idempotence makes retries and re-runs safe." },
    "定时任务失败却没有任何告警，最大的风险是？": { q: "A scheduled task fails silently with no alert. What is the biggest risk?", o: ["Resource usage", "It keeps failing quietly while output has long stopped", "Bigger logs", "Slower tasks"], why: "'Looks like it is running, produces nothing' is the most dangerous failure shape." },
    "知识库助手「答非所问」时应先排查___环节（填：检索 / 生成）。": { q: "When a knowledge assistant answers off-topic, check the ___ stage first (retrieval / generation).", a: "retrieval", why: "Look at whether the retrieved chunks are relevant; if retrieval is wrong, no model will answer well." }
  },

  /* ==================== 新节配套测评题（题内自带英文） ==================== */
  quizAdd: {
    c13: [
      {
        q: "下面哪一条才算「可验收目标」？",
        o: ["让周报变得更智能", "85% 的周报在 20 分钟内产出且口径与人工版一致，连续两周", "尽量节省大家的时间", "效果要好，用户满意为止"],
        a: 1,
        why: "可验收 = 指标 + 阈值 + 时间窗。其余三条都无法判失败，因此永远算成功。",
        q_en: "Which of these is an acceptable goal?",
        o_en: ["Make the weekly report smarter", "85% of weekly reports produced within 20 minutes with figures matching the manual version, for two consecutive weeks", "Try to save everyone some time", "It should work well and users should be satisfied"],
        why_en: "Acceptable means metric + threshold + time window. The others cannot fail, so they always count as success.",
        type: "choice"
      },
      {
        q: "反馈记录只要绑定了提示版本、模型参数与命中片段 id，坏例子就能被复现。",
        o: ["正确", "错误"],
        a: 0,
        why: "可追溯是修复的前提：没有这三样，你只能「再试一次」，无法确认修好了没有。",
        q_en: "A feedback record that binds the prompt version, model parameters and retrieved chunk ids lets a bad example be reproduced.",
        o_en: ["True", "False"],
        why_en: "Traceability is the precondition for fixing anything: without those three you can only try again, never confirm a fix.",
        type: "judge"
      }
    ]
  },

  /* ==================== 词条同步（新节要进名词库；概念图按 D28 容量结论暂不加节点） ==================== */
  terms: [
    {
      term: "可验收目标", term_en: "Acceptable Goal", cat: "工程与运维",
      short: "写成「指标 + 阈值 + 时间窗」的目标：能被判定失败，因此也能被判定完成。",
      short_en: "A goal written as metric + threshold + time window: it can be judged a failure, which is what lets it be judged done.",
      detail: [
        "判据：把这句话给一个不了解项目的人看，他能说出「下周算成功还是算失败」吗？说不出就不是可验收目标。",
        "必须与护栏指标一起定：只有结果指标时，成本和隐私会成为默认的代价项。"
      ],
      detail_en: [
        "Test: show the sentence to someone new to the project - can they say whether next week counts as success or failure? If not, it is not an acceptable goal.",
        "Set it together with guardrail metrics: with outcome metrics alone, cost and privacy become the default currency you pay in."
      ],
      vs: "它和愿景不是一回事：愿景指方向、可以宏大；可验收目标指这一版交付要跨过的那条线。",
      vs_en: "It is not the vision: a vision sets direction and may be grand. An acceptable goal is the specific line this version has to cross."
    },
    {
      term: "反馈回环", term_en: "Feedback Loop", cat: "工程与运维",
      short: "把真实使用中的失败样本，按固定节奏转成修复项与评测用例的机制。",
      short_en: "The mechanism that turns real failure cases from production use into fixes and eval cases on a fixed cadence.",
      detail: [
        "三类信号缺一不可：显式评分、隐式行为（重问 / 改写 / 放弃）、人工抽检 —— 单看点赞既稀疏又偏激。",
        "闭环的证据是「本周改掉了几条」，不是「采集了多少条」。"
      ],
      detail_en: [
        "All three signals are needed: explicit ratings, implicit behaviour (re-ask / rewrite / abandon) and human spot checks - thumbs-up alone is sparse and skews to extremes.",
        "The proof of a closed loop is how many cases were fixed this week, not how many were collected."
      ],
      vs: "它不同于日志与监控：监控回答「还活着吗」，回环回答「有没有在变好」。",
      vs_en: "It is not the same as logs and monitoring: monitoring asks 'is it alive', the loop asks 'is it getting better'."
    }
  ]
};
