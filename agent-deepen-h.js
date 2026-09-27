/* ================================================================
 * R0:hello agent · 课程深化层 ⑧（R4 五批：c7 Agent + c11 输出质量 双轨，D29 这两章测评英文）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 覆盖策略（延续前一批的裁定，一节一节问「两轨做的事真的不一样吗」）：
 *   c7 六节全有差异 —— 工具怎么表达、循环每步的代价是钱还是机时、并发受什么约束；
 *   c11 五节全有差异 —— JSON 靠服务端约束还是自己解析修复、重试按次计费还是占队列、
 *        judge 用更强的云端模型评本机输出（跨轨是常态）、日志面板谁提供；
 *   c14（扩展机制）判下来只有 l3 Plugin 一条有真差异（数据出不出机器），
 *        其余五节讲的是宿主无关的概念，硬写两条就是凑数 —— 本批不做，理由记进规划。
 *
 * 两件事：
 *   A3  c7 全 6 节 + c11 全 5 节补 path.api / path.local（含 path_en，行数与中文一一对应）
 *   D29 这两章共 18 题补齐英文题干 / 选项 / 解析，填空另给英文可接受答案
 * ================================================================ */
const DEEPEN_AGENT_H = {
  stages: ["c7", "c11"],

  lessons: {
    c7l1: {
      path: {
        api: "循环由你的代码驱动，工具用厂商的 tools / function-calling 随请求声明，模型直接返回结构化的调用意图\n每一步都在计费：一个任务走 10 步就是 10 次请求，而且每步都要重发不断变长的上下文",
        local: "循环同样在你的代码里，差别在工具怎么表达：引擎不支持 tools 时，要在提示里自己写「Thought / Action / Observation」文本协议并自己解析\n没有按次账单，但每一步都占本机时间：总耗时约等于单步延迟 × 步数，再叠加上下文重算，慢会被用户直接感知"
      },
      path_en: {
        api: "The loop lives in your code; tools are declared with the vendor's tools / function-calling API, so the model returns a structured call intent\nEvery step bills: a 10-step task is 10 requests, and each one resends a context that keeps growing",
        local: "The loop is still yours; what changes is how tools are expressed — when the engine has no tools support you write a Thought / Action / Observation text protocol in the prompt and parse it yourself\nNo per-call bill, but every step takes machine time: total wall clock is roughly step latency × steps plus context re-prefill, and users feel the slowness directly"
      }
    },

    c7l2: {
      path: {
        api: "用 function-calling 就不必自己解析文本：模型返回结构化 tool_calls，Observation 用 tool 角色回填，格式错误率大幅下降\n代价是与能力档位绑定：并非所有型号都支持并行工具调用与流式增量，换型号要重跑循环测试",
        local: "多数情况要自己搭协议：提示里给严格的输出格式，代码解析 Action 与参数，解析失败就带上错误信息重试一次\n较小的模型在 Observation 之后更容易忘记原始目标，所以「每轮重申目标与已完成步骤」在本地的收益比云端更大"
      },
      path_en: {
        api: "With function-calling you skip text parsing: the model returns structured tool_calls and you feed the Observation back as a tool message, which cuts format errors sharply\nThe price is coupling to a capability tier: not every model supports parallel tool calls or streamed deltas, so changing SKU means re-running the loop tests",
        local: "Usually you build the protocol yourself: a strict output format in the prompt, code parses Action and its arguments, and a parse failure gets one retry with the error attached\nSmaller models more easily lose the original goal after an Observation, so restating the goal and finished steps each round pays off more here than on the hosted track"
      }
    },

    c7l3: {
      path: {
        api: "工具定义每一轮都随请求发出：二十个工具的 schema 就是二十份输入 token，工具越多越贵也越慢\n模型能力强时，工具多带来的选择准确率下降得慢，可以先铺大清单再按需裁剪",
        local: "工具定义同样占上下文，但本地窗口更小，所以「按任务分组、每轮只启用一组」几乎是必须的\n较小的模型选错工具的概率明显更高：宁可给三个工具并写清各自边界，也不要给二十个让它猜"
      },
      path_en: {
        api: "Tool definitions ship with every request: twenty tools mean twenty copies of schema as input tokens, so more tools cost more and answer slower\nStrong models degrade slowly as the list grows, so you can start wide and trim later",
        local: "Definitions consume context here too, and the local window is smaller, so grouping tools and enabling one group per round is close to mandatory\nSmaller models pick wrong tools far more often: three tools with crisp boundaries beat twenty tools left to guess"
      }
    },

    c7l4: {
      path: {
        api: "并发等于成本与配额：三个 Agent 同时跑就是三份账单和三份限流额度，429 偏偏在最忙的时候出现\nAgent 之间传的每条消息都计费，所以传结构化摘要而不是传全文",
        local: "并发受显存硬约束：多 Agent 要么排队跑（总时间线性增长），要么各加载一份权重（显存成倍）\n没有按次费用，设计目标就从「少传 token 省钱」换成「少占机时」：长批排到夜间跑更划算"
      },
      path_en: {
        api: "Concurrency equals cost and quota: three agents mean three bills and three rate limit buckets, and 429s arrive exactly when you are busiest\nEvery inter-agent message is billed, so pass structured summaries rather than whole transcripts",
        local: "Concurrency is capped by VRAM: either agents queue (wall clock grows linearly) or each loads its own copy of the weights (VRAM multiplies)\nWith no per-call fee the design goal shifts from spending fewer tokens to spending less machine time: long batches belong in the overnight slot"
      }
    },

    c7l5: {
      path: {
        api: "失败按次算钱：空转十步就是白付十步的费用，所以终止条件同时也是成本控制\n典型故障来自服务侧：限流、超时、长上下文尾部信息丢失，退避重试是第一道防线",
        local: "失败不产生账单但产生机时，终止条件照样要有，只是止损的度量从钱换成时间\n典型故障来自模型与资源侧：不遵守输出格式、超出上下文被截断、显存不足直接崩，解法是裁剪工具集与降并发"
      },
      path_en: {
        api: "Failures bill per call: ten wasted steps are ten paid steps, so the termination condition doubles as cost control\nTypical faults come from the service side: rate limits, timeouts, information lost at the tail of a long context — backoff and retry are the first line",
        local: "Failures cost machine time instead of money, so you still need a stop rule, just measured in minutes rather than currency\nTypical faults come from the model and the hardware: ignored output formats, truncation past the context limit, crashes on out-of-memory — the fixes are a smaller tool set and lower concurrency"
      }
    },

    c7l6: {
      path: {
        api: "检索发生在你的应用侧，但取回的内容会随提示出境：记忆库里不要存未脱敏的敏感字段\n向量库用云端托管还是本机部署是另一层选择 —— 托管省事，但要按「数据出境」评估",
        local: "记忆天然不出机器，脱敏压力最小，但嵌入模型与向量库也得在本地跑（嵌入同样吃显存与时间）\n写入取舍不变：只存关键结论与偏好；差别是存储、检索、备份与删除全部由你自己运维"
      },
      path_en: {
        api: "Retrieval happens in your app, but whatever comes back travels out with the prompt: never keep un-redacted sensitive fields in the memory store\nWhether the vector store is a managed cloud service or runs on your box is a second decision — managed is easier but must be judged as data leaving the premises",
        local: "Memory never leaves the machine, so redaction pressure is lowest, but the embedding model and vector store must run locally too (embeddings also eat VRAM and time)\nThe write policy is unchanged — key conclusions and preferences only; what differs is that storage, retrieval, backup and deletion are all yours to operate"
      }
    },

    c11l1: {
      path: {
        api: "优先用平台能力：JSON 模式 / response_format 在服务端约束解码，比在提示里念三遍「只输出 JSON」稳得多\nschema 校验仍在本地做：服务端模式保证「是合法 JSON」，不保证「字段名与取值符合你的定义」",
        local: "引擎对 response_format 与语法约束解码支持不一：能开就开，不能开就退回「严格格式提示 + 宽容解析」（剥代码块标记、截取花括号区间）\n较小的模型更爱在 JSON 前后加解释文字，解析与修复逻辑要按「输出一定会脏」来写，而不是当异常处理"
      },
      path_en: {
        api: "Use the platform first: JSON mode / response_format constrains decoding server-side, far steadier than repeating the instruction to output JSON three times in the prompt\nSchema validation still happens locally: the provider's mode guarantees valid JSON, not that your field names and value ranges are respected",
        local: "Engines vary in response_format and grammar-constrained decoding support: enable it when present, otherwise fall back to a strict-format prompt plus tolerant parsing (strip code fences, slice out the braces)\nSmaller models love to narrate around the JSON, so write parsing and repair assuming dirty output rather than treating it as an exception"
      }
    },

    c11l2: {
      path: {
        api: "重试按次计费：上限设成 2~3 次，并把上一次的错误与原输出一起发回，成功率明显高于重掷\n要区分错误类型：限流与超时用退避重试，内容不合规带错误重试，参数错误重试无意义、直接报错",
        local: "重试不花钱但占机时，上限同样要有，只是止损看的是时间预算；批量评估时一轮全量重试能把队列拉长数倍\n较小的模型「带错误纠正」的成功率更低：能程序化修的（大小写、多余引号、字段名映射）先自己修，修不动再回喂模型"
      },
      path_en: {
        api: "Retries bill per call: cap them at two or three, and send the previous error plus the original output back for a much higher hit rate than rolling the dice again\nSeparate error classes: rate limits and timeouts get backoff, content violations get a retry with the error, parameter mistakes should fail fast",
        local: "Retries cost machine time rather than money, so keep a cap measured in your time budget; one full re-run of a batch eval can multiply the queue length\nSmaller models profit less from error-in-hand correction: fix mechanically what you can (case, stray quotes, field-name mapping) and only feed the rest back"
      }
    },

    c11l3: {
      path: {
        api: "跑一轮评测 = 条数 × 单价：50 条与 200 条的差别直接体现在账单上，所以先定预算再定规模\n评测集常含真实用户数据，发出去之前按脱敏处理，或者改用本地模型跑评测",
        local: "成本换成机时：两百条乘以每条几秒可能就是一整晚，所以评测要能中断续跑、结果边跑边落盘\n优势是随便跑：改一版提示就跑一次不心疼，迭代频率可以远高于云端，正好支撑「每次改动都跑一遍」"
      },
      path_en: {
        api: "One eval run costs rows × unit price, so the gap between 50 and 200 cases shows up directly on the bill — set the budget, then the size\nEval sets often contain real user data: redact before sending, or run the eval against a local model",
        local: "The cost becomes machine time: two hundred cases at a few seconds each can fill a night, so the eval must resume after interruption and append results as it goes\nThe upside is running without regret — re-scoring after every prompt tweak costs nothing extra, which is exactly what the 'run it on every change' habit needs"
      }
    },

    c11l4: {
      path: {
        api: "judge 通常用更强的型号评被试输出：跨档位打分更稳，但每次打分都是账单，全量评改用抽样加分批\n并发打分会撞限流，评分任务优先级低，适合排到夜间或空闲配额里跑",
        local: "本机也能跑 judge，但要警惕同源偏差：同一个模型既生成又打分，偏向自己风格的偏差最大，至少要换一个型号或加人工抽检\njudge 常驻之后打分不再额外花钱，因此更适合做「每次改动全量重跑」的回归门禁"
      },
      path_en: {
        api: "Judges usually sit a tier above the model under test, which stabilises scoring but bills for every verdict — so sample and batch instead of grading everything\nParallel grading runs into rate limits, and eval work is low priority, so it belongs in the overnight or spare-quota window",
        local: "You can judge locally, but watch for same-source bias: one model both generating and grading maximises self-preference, so at minimum use a different model or add human sampling\nA resident judge costs nothing extra per score, which makes full re-grading on every change practical as a regression gate"
      }
    },

    c11l5: {
      path: {
        api: "控制台自带用量、延迟与错误率，起步就有数据；但字段粒度由对方定，自定义维度要自己埋点上报\n日志里的输入输出会留在服务商侧，脱敏规则与留存期要在写日志之前定好",
        local: "没有任何现成面板：tokens/秒、显存峰值、队列长度、功耗都得自己采，起步一份 JSONL 加一个统计脚本就够用\n好处是日志想记什么记什么、全在本机；代价是 OOM 与宕机这类事件没人替你告警，监控要自己拉起来"
      },
      path_en: {
        api: "The vendor console ships usage, latency and error rates, so you have data from day one — but granularity is theirs, and custom dimensions need your own instrumentation\nPrompt and completion copies sit on the provider's side, so redaction rules and retention must be decided before the first log line",
        local: "There is no ready-made dashboard: tokens/sec, peak VRAM, queue depth and power draw are all yours to collect; one JSONL file plus a summary script is enough to start\nThe upside is logging whatever you like, entirely on your own machine; the downside is that nobody pages you when it OOMs, so alerting is also on you"
      }
    }
  },

  /* D29：这两章 18 题的英文侧表。合并语义是「字段级、只补缺失」，
     已有 q/o 的题只填 why；judge 题的英文选项必须与中文选项同序，否则正确项下标会错位。 */
  quizEn: {
    "Agent 区别于普通对话模型的关键是？": {
      q: "What distinguishes an Agent from an ordinary chat model?",
      o: ["More parameters", "An autonomous loop that calls tools until the goal is met", "It only runs in the cloud", "More expensive hardware"],
      why: "An agent is model + autonomous loop + tool use."
    },
    "ReAct 中的 Observation 这一步可以省略，不影响结果。": {
      q: "The Observation step in ReAct can be skipped without affecting the outcome.",
      o: ["True", "False"],
      why: "Without the tool's return value the model improvises, which leads to loops or fabrication."
    },
    "Agent 的”长期记忆“通常把信息存到___，需要时再取回。": {
      q: "An agent's long-term memory usually stores information in ___, retrieving it when needed.",
      why: "External memory gets past the context-window limit.",
      a: "external storage"
    },
    "让 Agent 自动执行“删库/转账”等高风险动作而不审批，主要风险是？": {
      q: "What is the main risk of letting an agent perform high-risk actions such as wiping a database or transferring money, with no approval step?",
      o: ["It runs faster", "It is a recipe for incidents", "It saves tokens", "It becomes more accurate"],
      why: "Unreviewed high-risk execution invites incidents; require human confirmation for these."
    },
    "给 Agent 循环设置最大步数，主要目的是？": { why: "Without a termination condition the agent can keep calling tools in circles." },
    "Agent 的每一步都必须调用工具才能推进。": { why: "A step may simply produce a conclusion; calling a tool depends on what the task needs." },
    "Agent 循环中绝对不能省略的环节是？": {
      q: "Which step in the agent loop must never be skipped?",
      o: ["Thought", "Action", "Observation", "Summary"],
      why: "Observation is what the next thought is based on; skipping it means operating blind."
    },
    "Agent 的长期记忆通常怎么实现？": {
      q: "How is an agent's long-term memory usually implemented?",
      o: ["Keep every transcript verbatim", "Write key points to external storage and retrieve them into context on demand", "Tell the model again each time", "Store it inside the model weights"],
      why: "It is essentially RAG: extract the key points before storing, so retrieval has a usable signal-to-noise ratio."
    },
    "Agent 最危险的失败模式是？": {
      q: "Which agent failure mode is the most dangerous?",
      o: ["Infinite loop", "Tool misuse", "Silent failure — a plausible but wrong result", "Context overflow"],
      why: "Silent failure never interrupts the flow, poisons everything downstream, and is the hardest to notice."
    },

    "让模型稳定输出 JSON 最可靠的做法是？": { why: "An explicit field schema plus the platform's JSON mode is what actually constrains the structure." },
    "模型输出解析失败时，重试应该设置上限。": { why: "With no cap an abnormal case loops forever and keeps billing you." },
    "把主观质量变成可比较分数的工具是___（填：评测集 / 温度）。": {
      why: "An eval set turns subjective quality into comparable scores using cases with reference answers.",
      a: "eval set"
    },
    "LLM-as-Judge 需要 rubric 的主要原因？": { why: "Without explicit criteria the scores are arbitrary and cannot be reproduced." },
    "评测集应该怎么准备？": { why: "Scores only mean something if the cases represent real usage." },
    "在同一批样例上反复调提示词直到分数变高，就说明效果真的变好了。": { why: "That is overfitting the eval set; hold out cases that never took part in tuning." },
    "校验失败后，成功率最高的重试方式是？": {
      q: "After validation fails, which retry approach has the highest success rate?",
      o: ["Resend it unchanged", "Send the error message back together with the original output and ask for a fix", "Switch to a different model", "Raise the temperature"],
      why: "Correcting with the error in hand is a proofread-against-the-answer task, far better than guessing again."
    },
    "「解析成功」就等于「数据正确」。": {
      q: "Successful parsing means the data is correct.",
      o: ["True", "False"],
      why: "Field names, types and value ranges still have to match the schema; parsing only proves it is valid JSON."
    },
    "开放式任务（如写作）没有标准答案，常用的折中评估方案是___（填：LLM-as-Judge / 单元测试）。": {
      q: "Open-ended tasks such as writing have no reference answer; the usual compromise evaluation is ___ (fill: LLM-as-Judge / unit tests).",
      why: "A model scores against a rubric for relative comparison, with periodic human sampling to keep it honest."
    }
  }
};
