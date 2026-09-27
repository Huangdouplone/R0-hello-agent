/* ================================================================
 * R0:hello agent · 课程深化层 ⑦（R4 四批：c8 环境工具 + c10 安全护栏 双轨，D29 这两章测评英文）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 覆盖策略（延续上一批的裁定）：双轨不追求满覆盖，逐节问「api / local 在这节真有差异吗」。
 * 本批两章是剩余章节里差异最密的：c8（装什么、.env 里放什么、瓶颈是限流还是显存）与
 * c10（数据出不出机器、护栏有没有服务端那一层、责任主体是谁）。
 * c1（概念章）、c3（整章就是本地轨）里多数节没有对侧差异，硬凑就回到 D5「字节级相同路径」；
 * c2 的差异（base_url / 鉴权 / 参数支持面）已在 c8l3 一节里讲透，逐节重复没有教学价值。
 *
 * 两件事：
 *   A3  c8 全 5 节 + c10 全 5 节补 path.api / path.local（含 path_en，行数与中文一一对应）
 *   D29 这两章共 18 题补齐英文题干 / 选项 / 解析，填空另给英文可接受答案
 * ================================================================ */
const DEEPEN_AGENT_G = {
  stages: ["c8", "c10"],

  lessons: {
    c8l1: {
      path: {
        api: "环境里只多两样：pip install openai（或对应 SDK）+ 一个 Key\n验证点在远端：对本机端点之外打一次 /v1/models，能列出模型才算 Key、网络、代理三件事都通",
        local: "多出一整层硬件依赖：推理引擎（Ollama / vLLM）+ 显卡驱动或 Apple Silicon 的 Metal + 权重目录（默认落在数据盘，几 GB 到几十 GB）\n验证点在近端且分两步：先确认引擎里能看到已拉取的权重，再对本机端点打一次 /v1/models —— 两步分开查，别把「没装引擎」当成「网络问题」"
      },
      path_en: {
        api: "Only two additions: pip install openai (or the matching SDK) plus one key\nVerify against the remote: hit /v1/models once — a model list proves key, network and proxy are all fine",
        local: "A whole hardware layer is added: an engine (Ollama / vLLM) + GPU drivers or Metal on Apple Silicon + a weights directory (several GB to tens of GB on the data disk)\nVerify locally in two steps: first confirm the engine lists the pulled weights, then hit the local endpoint's /v1/models — keeping the steps apart stops you blaming the network for a missing engine"
      }
    },

    c8l2: {
      path: {
        api: ".env 里放的是凭证：OPENAI_API_KEY=sk-...，泄露等于别人花你的钱；.gitignore 必含 .env，进过历史只能吊销重发\n多环境分 Key（开发 / 生产），便于单独吊销与限额",
        local: "没有云端 Key 可泄露，要管的是端点的暴露范围：引擎默认只听本机地址，改成监听所有网卡就等于把「用你的显卡、读你传进去的文件」开放给整个局域网\n.env 里放 OLLAMA_BASE_URL=http://127.0.0.1:11434/v1 与模型名；换机器只改这一处，鉴权字段留空是正常状态而不是遗漏"
      },
      path_en: {
        api: "The .env holds credentials: OPENAI_API_KEY=sk-..., and a leak means someone spends your money; .gitignore must list .env, and once it reached history the key can only be revoked\nUse separate keys per environment (dev / prod) so you can revoke and cap each one alone",
        local: "There is no cloud key to leak; what you manage is how far the endpoint is exposed: engines listen on loopback by default, and binding to all interfaces hands out your GPU and every file you send in to the whole LAN\nPut OLLAMA_BASE_URL=http://127.0.0.1:11434/v1 and the model name in .env; changing machine means changing one line, and an empty auth field is correct here, not an oversight"
      }
    },

    c8l3: {
      path: {
        api: "base_url 指向厂商域名、model 用厂商型号名；结构化输出、函数调用、前缀缓存这些高级参数以厂商文档为准，SDK 大版本要跟得上\n封装点：base_url / model / key 收进一个模块，换供应商只改配置",
        local: "同一份客户端代码只改两处：base_url 换成本机端点、model 换成本地权重名 —— 兼容协议带来的最大便利\n差别在参数支持面：本地引擎对 response_format、tools、缓存的支持程度不一，封装时要留降级分支（探测不过就退回纯文本加提示词约束）"
      },
      path_en: {
        api: "base_url points at the vendor domain and model uses the vendor's SKU name; advanced knobs (structured output, function calling, prefix caching) follow vendor docs, and major SDK versions matter\nWrap it: base_url / model / key live in one module, so switching vendors is a config change",
        local: "The same client code changes in exactly two places: base_url becomes the local endpoint, model becomes the local weight name — the biggest convenience of the compatible protocol\nWhat differs is parameter coverage: engines support response_format, tools and caching to varying degrees, so keep a fallback branch (probe fails, degrade to plain text plus prompt constraints)"
      }
    },

    c8l4: {
      path: {
        api: "并发上限来自限流：429 与退避是常态，边跑边看账单；重试会重复计费，所以「重试次数」实际是「预算倍数」\n观察点：成功率、token 总消耗、单条平均耗时",
        local: "没有 429，瓶颈换成显存与吞吐：并发开高会把 KV cache 撑爆、整体反而骤降，批量要排队跑满而不是同时开\n重试不产生账单但产生机时；观察点换成 tokens/秒、显存峰值与总耗时，长批排到夜间跑更划算"
      },
      path_en: {
        api: "Concurrency is capped by rate limits: 429s and backoff are routine, and you watch the bill while running; retries bill again, so the retry count is really a budget multiplier\nWatch: success rate, total tokens, average latency per item",
        local: "No 429s; the ceiling is VRAM and throughput: raising concurrency blows out the KV cache and total speed drops, so queue the batch to saturate the GPU rather than firing everything at once\nRetries cost machine time instead of money; watch tokens/sec, peak VRAM and wall-clock total, and schedule long batches overnight"
      }
    },

    c8l5: {
      path: {
        api: "接入即把代码片段发出去：企业敏感代码要先确认数据出境与留存政策；插件里的 Key 与 base_url 与脚本共用同一套 .env\n收益是能力上限（长上下文、强推理），代价是每次补全都有网络往返与费用",
        local: "代码不出本机、零边际成本，适合敏感仓库；代价是补全质量与延迟受本机显卡限制，长上下文更容易吃紧\n接入前先确认插件能自定义 base_url 与模型名 —— 改不了这两项的插件等于把本地轨关掉"
      },
      path_en: {
        api: "Plugging in means shipping your code out: for sensitive company code, settle cross-border transfer and retention first; the plugin's key and base_url come from the same .env as your scripts\nYou gain a capability ceiling (long context, strong reasoning) and pay a network round trip plus a fee per completion",
        local: "Code never leaves the machine and the marginal cost is zero, which suits sensitive repos; the price is completion quality and latency bounded by your own GPU, with long context tightening first\nBefore wiring it up, check the plugin lets you set base_url and model name — one that won't has effectively switched the local track off"
      }
    },

    c10l1: {
      path: {
        api: "注入后的越权动作发生在你的应用侧（工具是你给的），防护层也就在应用侧：外部内容用分隔符标成数据、工具只给必需权限、输出做指令性检查\n云端日志会留下被注入的完整对话，事后取证看控制台；服务商的内容审核只覆盖违规内容，不覆盖「它替你执行了攻击者的指令」",
        local: "同样的注入链，破坏半径换成本机：工具能读你的文件、发你的邮件、跑你的 shell，一次越权直接命中自己的机器\n取证靠本机日志与引擎自己的记录，可控性更高但也没人替你兜底；较小的模型更容易被「忽略以上规则」带偏，隔离标注与输出校验要更严"
      },
      path_en: {
        api: "The hijacked action happens on your application side (you supplied the tools), so the defences sit there too: wrap external content as data with delimiters, give tools only what they need, and check output for instruction-shaped content\nThe vendor console keeps the injected conversation for forensics, but provider moderation covers policy-violating content, not the case where it ran an attacker's instructions on your behalf",
        local: "Same injection chain, but the blast radius is your own machine: the tools can read your files, send your mail and run your shell, so one bypass lands directly on the box\nForensics rely on local logs plus whatever the engine records — more control, and nobody catching what you miss; smaller models are more easily led astray by an 'ignore the rules above' line, so isolation and output checks must be stricter"
      }
    },

    c10l2: {
      path: {
        api: "脱敏是必做步骤：出境前把姓名 / 手机号 / 内部地址换成占位符，映射表只留本地；确认供应商的留存与是否用于训练，必要时签数据处理协议\n泄露面有三处：提示、日志、供应商侧留存，三条各自设防",
        local: "数据不出机器，提示与供应商留存这两条泄露面直接消失；剩下的风险在权重与配置：来路不明的模型文件可能带恶意模板或工具声明，把引擎端口共享出去等于让别人读你传进去的文件\n脱敏从「合规必需」降级为「日志卫生」：本机日志同样不该留全量敏感字段，映射表也照样不进日志"
      },
      path_en: {
        api: "Redaction is mandatory: replace names, phone numbers and internal addresses with placeholders before anything leaves the machine, keep the mapping table local, and confirm the vendor's retention and training policy — sign a DPA where needed\nThree leak surfaces: the prompt, your logs, and vendor-side retention — each needs its own defence",
        local: "Nothing leaves the machine, so the prompt and vendor-retention surfaces simply disappear; the risk moves to weights and configuration: a model file of unknown origin may ship a malicious template or tool manifest, and sharing the engine port lets others read what you send in\nRedaction drops from a compliance requirement to simple log hygiene: local logs still should not keep full sensitive fields, and the mapping table still never goes into them"
      }
    },

    c10l3: {
      path: {
        api: "护栏可以叠两层：应用侧自己写，加上服务商的服务端审核与内容策略，后者能挡掉一部分明显违规；但口径由对方定，误杀与放行都不向你解释\n集中部署时一套护栏覆盖所有功能，改动即时全局生效",
        local: "服务端审核这一层不存在，所有护栏都得自己实现：输入过滤、schema 校验、取值范围、敏感信息扫描一个都不能少\n小模型自身的拒答能力更弱，护栏负担更重；好处是规则完全自主，误杀可以自己调，还能随应用一起打包分发"
      },
      path_en: {
        api: "You can stack two layers: your own application-side guardrails plus the provider's server-side review and content policy, which catches some obvious abuse — but they set the thresholds and explain neither false positives nor misses\nWith central deployment one guardrail set covers every feature and a rule change takes effect everywhere at once",
        local: "There is no server-side review layer, so every guardrail is yours to write: input filtering, schema validation, range checks and secret scanning, none optional\nSmaller models refuse less on their own, so the guardrails carry more weight; in exchange the rules are entirely yours — you tune the false positives and ship them with the app"
      }
    },

    c10l4: {
      path: {
        api: "工具与凭证在你的应用侧，最小权限就是按功能发凭证（只读、单库、单邮箱），并给量级上限（例如最多查 100 条）与单位时间次数上限\n把「模型能调什么」写进审计日志：出事后要能区分是被注入还是设计本来就没设限",
        local: "模型与工具同机，误操作直接命中本机文件系统 —— 高危功能要在沙箱、容器或只读挂载里跑，工作目录显式限定\n确认分级不变（低危静默、中危汇总、高危逐条加二次校验），但「谁批准了什么」的留痕完全由你自己实现和保存"
      },
      path_en: {
        api: "Tools and credentials live on your side, so least privilege means issuing them per feature (read-only, one database, one mailbox) plus a volume cap (say 100 rows) and a rate cap\nLog what the model is allowed to call: after an incident you must be able to tell injection from a design that never had a limit",
        local: "Model and tools share one machine, so a slip lands on your own filesystem — run high-risk features in a sandbox, container or read-only mount with an explicitly bounded working directory\nThe confirmation tiers stay the same (silent for low risk, batched for medium, per-item plus a second check for high), but the audit trail of who approved what is entirely yours to build and keep"
      }
    },

    c10l5: {
      path: {
        api: "重点是数据出境与处理者角色：供应商是受托处理者，用途、留存期、跨境传输要写清；行业红线（医疗 / 法律 / 投资不给确定性结论）与生成内容标识同样适用\n免责声明放在用户看得见的位置，拿不准先问专业意见",
        local: "责任主体变成你自己：没有「服务商数据处理条款」可依赖，模型许可证（可否商用、是否要求附带同名条款、使用政策）与权重来源要逐条核对\n自托管给他人用时你同时是服务提供者与内容管理者，日志、投诉入口与删除机制都得自己提供"
      },
      path_en: {
        api: "The focus is cross-border transfer and processor roles: the vendor acts on your behalf, so purpose, retention and transfers must be spelled out; sector red lines (no definitive medical / legal / investment advice) and generated-content labelling still apply\nPut disclaimers where users actually see them, and get professional advice when unsure",
        local: "You become the responsible party: there is no vendor data-processing clause to lean on, so check the model licence (commercial use, whether it must be reproduced, acceptable-use policy) and where the weights came from\nSelf-hosting for others makes you both service provider and content manager — logging, a complaint route and a deletion mechanism are all yours to supply"
      }
    }
  },

  /* D29：这两章 18 题的英文侧表。合并语义是「字段级、只补缺失」，
     所以已有 q/o 的题只填 why；填空题的 a 是「英文态另可接受的答案」，必须填英文。 */
  quizEn: {
    "调用大模型 SDK 时，切换供应商最常改的两个参数是？": { why: "Under an OpenAI-compatible protocol, pointing base_url at the new host and renaming the model is all it takes." },
    "API Key 泄露后，第一件应该做的事是立即吊销并重新生成。": { why: "Stop the bleeding first (revoke), investigate afterwards — a live key keeps spending your money." },
    "批量调用脚本中，遇到偶发网络错误应使用___重试（填：指数退避 / 无限循环）。": { why: "Exponential backoff recovers from transient errors without hammering the service harder.", a: "exponential backoff" },
    "把 API Key 放到 .env 并加入 .gitignore，主要为了？": { why: "The goal is keeping credentials out of the repository, not speed or token savings." },
    "给批量脚本里的每次请求加超时，主要作用是？": { why: "A timeout stops one hung request from stalling the entire batch." },
    "密钥写进代码，只要 Git 仓库是私有的就没有风险。": { why: "Private repos still get shared, flipped public or cloned; keep keys in .env and ignore the file." },
    "依赖应该固化到哪个文件里，方便他人一键还原环境？": {
      q: "Which file should dependencies be pinned in so others can restore the environment in one command?",
      o: [".env", "requirements.txt", "README.md", ".gitignore"],
      why: "requirements.txt pins packages and versions, and pip install -r restores them."
    },
    "密钥曾提交进 git 历史后再删除文件，旧版本里仍能找到密钥。": {
      q: "If a key was once committed to git history, deleting the file later still leaves it recoverable from old commits.",
      o: ["True", "False"],
      why: "History keeps the old blobs; revoke the key and rewrite history if necessary."
    },
    "批量任务应该把结果___（填：边跑边落盘 / 跑完后一次性写入）。": {
      q: "A batch job should write its results ___ (fill: as you go / only once the whole run finishes).",
      why: "Appending per item keeps finished work; if the run dies halfway you only redo the failures.",
      a: "as you go"
    },

    "提示注入最本质的原因是？": { why: "The model treats instructions and data as one token stream, so it cannot tell them apart by nature." },
    "把用户上传的文档直接拼进 system 提示是安全的做法。": { why: "Instructions inside an uploaded document get executed — the classic prompt-injection path." },
    "护栏的两层是输入过滤与___校验（填：输出）。": { why: "Input filtering guards the request; output validation guards what the model produced.", a: "output" },
    "下列哪种做法最符合最小权限原则？": { why: "Least privilege grants only what the task needs, which caps the damage of any single mistake." },
    "把模型输出直接变成实际操作之前，最该做的是？": { why: "Model output is untrusted input: validate format and ranges first, and confirm dangerous actions by hand." },
    "敏感数据发给第三方模型前，应先脱敏或改用本地模型。": { why: "Minimisation and redaction (or a local model) are the baseline for privacy compliance." },
    "提示注入难以彻底根治的根本原因是？": {
      q: "Why is prompt injection so hard to eliminate completely?",
      o: ["Models lack compute", "Instructions and data are the same token stream to the model, with no natural boundary", "Vendors ship no defences", "Prompts are too short"],
      why: "You can only layer defences — isolation, least privilege, output validation — to lower the risk, never remove it."
    },
    "脱敏后把「占位符→真实值」的映射表写进日志，脱敏仍然有效。": {
      q: "Redaction still works if the placeholder-to-real-value mapping table is written into the logs.",
      o: ["True", "False"],
      why: "A log holding the mapping undoes the redaction; keep the table in local memory or a local file."
    },
    "危险操作（删除/转账）的确认机制应该___，且确认信息要具体到会发生什么。": {
      q: "Confirmation for dangerous actions (delete / transfer) should be ___, and the prompt must state exactly what will happen.",
      why: "A blanket confirm dialog gets clicked blindly; high-risk actions need per-item confirmation plus a second check.",
      a: "case by case"
    }
  }
};
