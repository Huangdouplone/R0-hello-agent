/* ================================================================
 * R0:hello agent · 课程深化层 ⑥（R4 三批：c6 MCP 双轨 + D29 前段章节测评英文）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 覆盖策略说明（重要）：双轨不是"每节都得凑两条"。剩下 57 节里，c6（MCP）是
 * api / local 差别最实的一章（宿主、传输、权限边界、数据出域四处都不同），本层先做它；
 * c1 概念章与 c3 之外的章节要一节一节判断有没有真差异，凑数会违反「只写真差异」。
 *
 * 两件事：
 *   A3  c6 全部 8 节补 path.api / path.local（含 path_en）
 *   D29 用 quizEn 通路补 c1 / c2 / c3 共 18 道题的英文题干、选项、解析与英文可接受答案
 * ================================================================ */

const DEEPEN_AGENT_F = {

  stages: ["c6"],

  lessons: {
    "c6l1": {
      path: {
        api: "接法：云端模型的「工具调用格式」由厂商定，你能选的是支持 MCP 的宿主（桌面客户端 / 云端助手）\n验证：挂一个只读 Server（如文件系统），让模型列目录，看工具是否被发现、参数是否被正确填写",
        local: "接法：本地模型 + 本地宿主自己拼装，工具清单要塞进上下文 —— 工具越多、schema 越长，小模型越容易选错\n验证同样先挂只读 Server，但要额外记录：加了几个工具之后首字延迟与准确率各掉多少"
      },
      path_en: {
        api: "Wiring: the vendor fixes the hosted model's tool-call format; what you choose is an MCP-capable host (desktop client or cloud assistant)\nSmoke test: attach a read-only server (e.g. filesystem), ask the model to list a directory, and check that the tool is discovered and its arguments filled correctly",
        local: "Wiring: a local model plus a local host do the assembly, and the tool list must fit the context - more tools and longer schemas make small models pick wrong more often\nSame read-only smoke test, plus record how much time-to-first-token and accuracy drop per tool added"
      }
    },
    "c6l2": {
      path: {
        api: "分工：Host 常在你的桌面或云端助手内，Server 可以是你订阅的远程服务；你只填 URL 与鉴权\n要留心：远程 Server 能看到你转过去的上下文，服务商侧留存要问清",
        local: "分工：Host 与 Server 往往同机 —— Server 是宿主拉起的子进程，你要自己管依赖、启动命令与退出清理\n要留心：给这个子进程的权限就是你本机的权限，默认按最小授权来"
      },
      path_en: {
        api: "Split: the host lives in your desktop or cloud assistant; the server can be a remote service you subscribe to - you only supply URL and credentials\nWatch: a remote server sees the context you forward; ask about provider-side retention",
        local: "Split: host and server usually share one machine - the server is a child process the host launches, so dependency, command and cleanup are yours\nWatch: whatever rights you grant that child process are your own machine's rights; start from the minimum"
      }
    },
    "c6l3": {
      path: {
        api: "Resources 经云端宿主进入上下文 → 体积直接变成账单与出域范围，敏感资料不要挂成远程镜像\nPrompts 原语适合集中管理：团队共享一套模板，改一处所有宿主生效",
        local: "Resources 在本机读取，可以整库挂载，但小模型的窗口会立刻见顶 → 用范围过滤、按需读取\n工具与资源的可见性由宿主控制：本地宿主通常能按原语关掉，避免模型误执行只读内容"
      },
      path_en: {
        api: "Resources travel through the cloud host into context - size becomes both bill and data-egress scope, so never mirror sensitive folders remotely\nPrompt primitives suit central management: one shared template for the team, one edit reaches every host",
        local: "Resources are read locally, so you can mount a whole library - but a small model's window caps out immediately, so filter the scope and load on demand\nPrimitive visibility is host-controlled: local hosts can usually disable a primitive per server, which stops the model from 'executing' read-only content"
      }
    },
    "c6l4": {
      path: {
        api: "FC 能力在云端：是否支持并行工具调用、参数严格模式，都取决于模型与接口版本，换模型要重测\n分工：MCP 负责把工具清单送进来，FC 负责决定调哪个 —— 两层分别记录失败原因",
        local: "FC 稳定性是短板：部分本地小模型会把 schema 写错（漏必填项、类型混用），需要宿主侧做校验与一次重试\n好处正是这里：换模型时工具层不用重写，MCP Server 原样复用，只需重测 FC 表现"
      },
      path_en: {
        api: "Function calling lives upstream: parallel calls, strict parameter mode and the rest depend on the model and API version, so re-test on every model swap\nDivision of labour: MCP delivers the tool list, FC decides which to call - record the two failure kinds separately",
        local: "FC reliability is the weak link: some local models mis-write schemas (missing required fields, wrong types), so validate host-side and retry once\nThe upside is exactly here: swapping models never rewrites the tool layer, the MCP server is reused as-is and only FC behaviour needs re-testing"
      }
    },
    "c6l5": {
      path: {
        api: "开发期用 stdio 本地调试，验证完再发布为远程 HTTP Server：加鉴权、限流与调用日志\n发布后要盯：工具错误率的返回格式统一，否则模型会把异常当结果继续编",
        local: "最省事路径：把 Server 当本地脚本挂进宿主配置，零网络暴露，改一行重启即生效\n代价是环境漂移：Python / Node 版本一变就「我这能跑」→ 锁版本与依赖，把启动命令写进 README"
      },
      path_en: {
        api: "Develop over stdio locally, publish as a remote HTTP server once verified: add auth, rate limiting and call logs\nAfter publishing: return tool errors in a uniform shape, or the model will treat the exception as a result and keep writing",
        local: "Cheapest path: mount the server as a local script in the host config - no network exposure, edit and restart to take effect\nThe cost is environment drift: a Python / Node version bump recreates 'works on my machine' → pin versions and put the launch command in the README"
      }
    },
    "c6l6": {
      path: {
        api: "资源读取由云端宿主转发 → 每一次读取都在计费与留存范围内，先给资源列表做敏感级标记\n远程 Server 的资源要限域：只暴露项目目录，别把整个 home 挂出去",
        local: "资源在本机读取，成本是窗口占用而不是账单 → 可以放心挂多，但要配范围过滤与按需读取\n配合本地检索更好：先把资料切块索引，再用 Resource 只取相关片段，窗口压力立刻下降"
      },
      path_en: {
        api: "Resource reads are forwarded by the cloud host, so every read is inside your billing and retention scope - label sensitivity on the resource list first\nScope a remote server's resources: expose the project folder, never the whole home directory",
        local: "Local reads cost context window rather than money, so you can mount more freely - but pair it with scope filters and on-demand loading\nEven better with local retrieval: chunk and index first, then let Resources return only the relevant fragments, which takes the window pressure off"
      }
    },
    "c6l7": {
      path: {
        api: "跨机协作必走 HTTP/SSE：鉴权（OAuth 或 Bearer）、来源白名单、TLS，缺一不可\nSSE 断线要能重连并续传会话标识，否则长任务半途丢状态",
        local: "同机优先 stdio：宿主拉起子进程，没有网络面、没有端口暴露，配置最短\n但权限即本机权限：给这个进程单独的系统用户或只读挂载，比任何传输层加固都管用"
      },
      path_en: {
        api: "Cross-machine work must use HTTP/SSE: authentication (OAuth or bearer), an origin allowlist and TLS are all mandatory\nSSE reconnection must carry the session id, or long jobs lose state mid-flight",
        local: "Prefer stdio on one machine: the host spawns the child process, so there is no port and no network surface at all - the shortest config there is\nBut its rights are your machine's rights: a dedicated OS user or read-only mounts beat any transport-layer hardening"
      }
    },
    "c6l8": {
      path: {
        api: "第三方远程 Server 拿到的上下文会经对方处理：先问留存与再训练条款，再决定挂不挂\n云端执行的工具写操作要人审：把它当「有手有脚的模型」，审批点放在写与发这两类动作上",
        local: "破坏半径就是本机：文件系统、已登录的浏览器会话、shell 环境变量里的凭据\n控制手段按性价比排：只读挂载与目录白名单 > 独立系统用户 > 命令审批 > 事后看日志"
      },
      path_en: {
        api: "A third-party remote server processes the context you send it - ask about retention and re-training terms before mounting it\nHuman-review any write the cloud-executed tool can do: treat it as a model with hands, and gate the write-and-send actions",
        local: "The blast radius is your own box: the filesystem, logged-in browser sessions and credentials sitting in environment variables\nOrder the controls by payoff: read-only mounts and directory allowlists > a separate OS user > command approval > reading the logs afterwards"
      }
    }
  },

  /* ==================== D29：c1 / c2 / c3 共 18 题的英文（字段级合并，已有 q/o 不动） ==================== */
  quizEn: {
    "LLM 生成文本的核心机制是？": { q: "What is the core mechanism by which an LLM generates text?", o: ["Retrieves the original from a database", "Predicts the next token by probability and continues", "Runs a pre-written script", "Searches the internet"], why: "An LLM is a probabilistic continuation engine - it generates the next token from statistical regularities." },
    "上下文窗口越大，模型就一定“记得”开头内容越牢。": { q: "A bigger context window means the model definitely 'remembers' the beginning better.", o: ["True", "False"], why: "A larger window only fits more tokens; the influence of early content is diluted during generation - it is not real memory." },
    "“参数“通常用哪个单位表示规模？": { q: "Which unit usually expresses a model's parameter count?", o: ["MB", "B (billion)", "GHz", "KB"], why: "Parameter scale is quoted in B (billion), e.g. 7B or 70B." },
    "普通使用者日常调用模型，属于___（填：训练 / 推理）。": { q: "An ordinary person calling a model day to day is doing ___ (training / inference).", a: "inference", why: "Asking an existing model to produce answers is inference." },
    "同一个模型、同样的提示，两次回答却不一样，最可能的原因是？": { why: "Generation samples probabilistically, so with temperature above 0 each run can draw different tokens." },
    "模型「知道」的只是训练数据里的统计规律，不会自动获取今天的最新消息。": { why: "Weights freeze after training; current information has to come from retrieval or tools." },
    "API Key 应该放在哪里最安全？": { q: "Where is an API Key safest?", o: ["In the frontend page", "In a public GitHub repo", "Only in backend environment variables", "Sent to a colleague over chat"], why: "A key is a credential - it belongs only in a controlled backend environment." },
    "想让模型输出更稳定、可复现，应调低 temperature。": { q: "To make output more stable and reproducible, lower the temperature.", o: ["True", "False"], why: "The lower the temperature, the more deterministic the sampling." },
    "多轮对话时，若只发送最新一句话而丢弃历史，模型会___。": { q: "In a multi-turn chat, sending only the latest message and dropping the history makes the model ___.", a: "lose the earlier context", why: "The model is stateless; the history must be resent for the conversation to continue." },
    "“OpenAI 兼容”接口意味着什么？": { q: "What does an OpenAI-compatible interface mean?", o: ["Only GPT works", "Swap the base URL and key to reuse the same code", "The frontend must be rewritten", "It is free"], why: "A compatible protocol lets the same logic drive different models." },
    "把一批请求一次性全部并发发出，最可能遇到什么？": { why: "Bursting concurrency triggers platform rate limits; cap concurrency and retry with backoff." },
    "messages 数组中对话的顺序会影响模型的理解。": { why: "Turns are concatenated in order, so scrambling them breaks the meaning." },
    "想在自己笔记本上快速体验本地模型，首选？": { q: "To try a local model quickly on your laptop, what is the first choice?", o: ["vLLM", "Ollama", "Train from scratch", "Buy a supercomputer"], why: "Ollama is the friendliest for personal local trials - one command." },
    "量化（如 4-bit）的主要目的是让模型更“准”。": { q: "Quantisation (e.g. 4-bit) mainly makes the model more accurate.", o: ["True", "False"], why: "Quantisation shrinks size and VRAM; it slightly reduces accuracy rather than improving it." },
    "llama.cpp 使用的模型文件格式叫___。": { q: "The model file format used by llama.cpp is ___.", a: "GGUF", why: "llama.cpp stores quantised models in GGUF format." },
    "团队共享、高并发调用模型，更适合？": { q: "For a team sharing one model under high concurrency, what fits better?", o: ["Ollama", "vLLM"], why: "vLLM has high throughput and suits served, concurrent scenarios." },
    "显存不够跑不动更大的模型时，最直接的办法是？": { why: "4-bit quantisation cuts VRAM demand the fastest." },
    "本地模型的输出质量一定不如云端大模型。": { q: "A local model's output quality is necessarily worse than a hosted large model's.", o: ["False", "True"], why: "The gap comes from model scale, not deployment location; at equal scale the quality can match." }
  }
};
