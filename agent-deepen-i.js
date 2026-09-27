/* ================================================================
 * R0:hello agent · 课程深化层 ⑨（R4 六批：c4 提示词工程双轨 + c14l3，D29 这两章测评英文）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 *
 * 覆盖策略（延续「一节一节问两轨做的事是否真的不一样」）：
 *   c4 写 5 节 —— 差异来自 chat template 是否支持 system 角色、JSON 模式与语法约束有无、
 *        窗口大小决定少样本与思考链的预算、第二次调用是双倍账单还是双倍机时；
 *   c4l4「提示词的常见坑」不写 —— 六个坑（指令与数据混杂、一次要太多、约束矛盾、
 *        负面指令、中段忽略、示例与真数据混）两轨完全同形，属于模型能力问题而非路线差异，
 *        硬写两条就是 D5「字节级相同路径」复发；
 *   c14 只写 l3 Plugin —— 插件读到的数据出不出机器、凭据对谁可见，是真差异；
 *        其余五节讲的是宿主无关的概念（谁触发、扩展什么），不写。
 *
 * 两件事：
 *   A3  c4l1 / c4l2 / c4l3 / c4l5 / c4l6 + c14l3 补 path.api / path.local（含 path_en）
 *   D29 收尾：c4 / c14 / c5 / c6 / c9 共 45 题补齐英文题干 / 选项 / 解析，填空另给英文可接受答案
 *        —— 这三章的课节双语早已完成，欠的一直是测评解析，本批之后 D29 关闭。
 * ================================================================ */
const DEEPEN_AGENT_I = {
  stages: ["c4", "c14"],

  lessons: {
    c4l1: {
      path: {
        api: "规则放 system、变化内容放 user：厂商的对话模板都稳定支持 system 角色，规则丢失通常来自你自己的历史裁剪逻辑\n调试靠完整打印实际发出的 messages，控制台还能按请求回看当时生效的那份提示",
        local: "同样放 system，但要先确认引擎的对话模板真的支持这个角色：不支持时它会被拼进 user 甚至直接丢弃，「规则写了没生效」多半就是这个原因\n换权重等于换模板：同一份提示在不同模型上的遵从度差别很大，所以角色设定的措辞要跟着评测集一起回归，不能假设通用"
      },
      path_en: {
        api: "Rules in system, per-request content in user: vendor chat templates support the system role reliably, so lost rules usually come from your own history trimming\nDebug by printing the exact messages you send; the console also lets you replay which prompt was in effect for a given request",
        local: "Still put rules in system, but first check that the engine's chat template actually supports that role — when it does not, the text is folded into user or dropped outright, which is the usual cause of a rule that seems to have no effect\nSwapping weights swaps templates: the same prompt is obeyed very differently across models, so role wording has to be regression-tested with the eval set rather than assumed portable"
      }
    },

    c4l2: {
      path: {
        api: "三层手段齐全：JSON 模式与函数调用在服务端约束解码，最稳；少样本示例每轮都重复计费，够用即可\n窗口大，五六个示例连同长规则与参考资料都塞得下",
        local: "有没有 JSON 模式取决于引擎是否支持语法约束解码：不支持就退回「schema + 少样本 + 宽容解析与重试」，代码侧的兜底要更厚\n窗口更小，示例是最先该砍的东西：两例一致胜过五例堆叠，长参考资料改走检索按需取回"
      },
      path_en: {
        api: "All three layers are available: JSON mode and function calling constrain decoding server-side, which is steadiest; few-shot examples are re-billed every turn, so use as few as suffice\nThe large window easily holds five or six examples plus long rules and reference material",
        local: "Whether JSON mode exists depends on whether the engine supports grammar-constrained decoding: if not, fall back to schema plus few-shot plus tolerant parsing and retry, and the code-side safety net has to be thicker\nWith a smaller window examples are the first thing to cut — two consistent examples beat five stacked ones, and bulky reference material should come back through retrieval instead"
      }
    },

    c4l3: {
      path: {
        api: "「先推理再作答」直接写进提示即可；推理型型号会自己展开思考链并按思考 token 计费，成本要按输出长度估\n窗口大，推理过程再长也装得下，最后用固定格式收住结论就行",
        local: "同样能加这句，但要盯两件事：思考链变长会挤占本就紧张的窗口，而较小的模型更容易在长推理里跑题或忘了收结论\n所以本地更倾向「任务分解」而不是一次想到底：拆成多次短调用，每轮只让模型想清楚一小步"
      },
      path_en: {
        api: "Just ask for reasoning before the answer; reasoning-tuned models expand a chain of thought on their own and bill those thinking tokens, so estimate cost from output length\nThe large window absorbs arbitrarily long reasoning, and you only need a fixed final line for the conclusion",
        local: "The same sentence works, but watch two things: a longer chain of thought eats into an already tight window, and smaller models drift or forget to conclude mid-reasoning\nSo locally, decomposing the task beats thinking it all at once — split into several short calls and let each round settle one small step"
      }
    },

    c4l5: {
      path: {
        api: "反思就是第二次调用，成本直接翻倍，所以只对高价值或易错的任务启用\n批评者可以换一个更强的型号：跨档位审查能避开「自己查自己」的盲区，代价是两档模型各付一次钱",
        local: "多一次调用不产生账单，但机时同样翻倍，批量任务要把这一轮次算进总时长\n批评者只能靠换型号或换提示制造差异：本机同一份权重自查的偏差最大，至少用不同提示或不同温度独立跑一遍"
      },
      path_en: {
        api: "Reflection is a second call, so the cost doubles outright — enable it only for high-value or error-prone tasks\nThe critic can be a stronger model: reviewing across capability tiers avoids the self-check blind spot, at the price of paying two models",
        local: "An extra call generates no bill but doubles machine time, and batch jobs must count that round in their wall-clock budget\nYou manufacture the critic's independence by switching model or prompt: one weight grading itself is the most biased setup, so at minimum run a separate pass with a different prompt or temperature"
      }
    },

    c4l6: {
      path: {
        api: "改一版就跑评测 = 再花一轮钱，所以评测集规模与跑批频率要按预算安排；A/B 各跑一半流量同样是双倍计费\n服务商侧日志与用量能按请求对齐，两组结果天然可追溯",
        local: "改一版就跑一次不心疼钱，代价是排队与机时：评测要能中断续跑，否则改一句话就得等一整晚\n同一台机器上的 A/B 多半是分时跑而不是真并发，两组必须用同一份权重与参数、只换提示，否则归因不干净"
      },
      path_en: {
        api: "Re-running the eval after every tweak costs another round of money, so set the sample size and run frequency by budget; an A/B split across live traffic doubles billing too\nProvider-side logs and usage line up per request, so the two arms are traceable for free",
        local: "Re-running costs no money but does cost queue time, so the eval must resume after interruption — otherwise a one-line edit means waiting overnight\nA/B on one machine is usually time-sliced rather than truly concurrent; keep weights and parameters identical between arms and change only the prompt, or the attribution is dirty"
      }
    },

    c14l3: {
      path: {
        api: "插件在你的应用侧执行，但它取回的数据会随提示出境：接内网数据库或私有文件系统的插件，等于把那些数据交给服务商处理\n插件凭据（数据库口令、SaaS token）与模型服务的 Key 是两回事，别把前者写进提示或让工具参数把它回显出来",
        local: "同一份插件不再涉及出境：内网库与本地文件可以直接读，这是本地轨最实际的收益之一\n但权限边界更贴近自己：插件与模型同机，它能读到的就是你机器上可读到的，凭据与可访问路径要按最小权限显式挂进去"
      },
      path_en: {
        api: "The plugin runs in your app, but whatever it fetches travels out with the prompt: a plugin wired to an internal database or private file share effectively hands that data to the provider\nPlugin credentials (DB passwords, SaaS tokens) are a different secret from the model key — never put them in the prompt or let tool arguments echo them back",
        local: "The same plugin involves no data egress: internal databases and local files can be read directly, which is one of the most concrete wins of the local track\nBut the permission boundary sits closer to home: the plugin shares your machine, so anything it can read is anything you can read — mount credentials and allowed paths explicitly, least privilege"
      }
    }
  },

  /* D29：c4 与 c14 共 18 题的英文侧表。合并语义「字段级、只补缺失」；
     judge / choice 的英文选项必须与中文同序，否则正确项下标错位。 */
  quizEn: {
    "想让模型稳定输出可解析的 JSON，最好？": {
      q: "To reliably get parseable JSON out of a model, what works best?",
      o: ["Just tell it to return JSON", "Spell out the field contract and require JSON mode", "Scold it", "Retry a few times and hope"],
      why: "An explicit field contract plus JSON mode is what makes the structure stable."
    },
    "思维链（CoT）通过让模型分步推理来提升复杂题准确率。": {
      q: "Chain of thought improves accuracy on hard problems by making the model reason step by step.",
      o: ["True", "False"],
      why: "Making the steps explicit reduces skipped-step errors."
    },
    "用户试图用“忽略前面所有规则”劫持模型，这叫___。": {
      q: "A user tries to hijack the model with 'ignore all previous rules'; this attack is called ___.",
      why: "Letting content override the system settings is prompt injection.",
      a: "prompt injection"
    },
    "系统提示应放在 messages 的哪个 role？": {
      q: "Which role of the messages array should the system prompt go into?",
      o: ["user", "assistant", "system", "tool"],
      why: "The system role carries identity and rules."
    },
    "想让模型「先推理再作答」，提示里通常怎么写？": { why: "Asking for step-by-step reasoning before the answer is exactly how chain of thought is triggered." },
    "提示词写得越长，效果一定越好。": { why: "Irrelevant material dilutes the important parts and wastes tokens; clarity beats length." },
    "规则类的指令应该放在 messages 的哪个位置？": {
      q: "Where in the messages array should rule-style instructions live?",
      o: ["In the user message", "In the system message", "In the assistant message", "Anywhere is fine"],
      why: "System sits at the head of the array and survives history trimming, so it constrains the whole conversation."
    },
    "少样本示例最需要保证的是？": {
      q: "What must few-shot examples guarantee above all?",
      o: ["As many as possible", "A consistent standard across examples", "Coverage of every case", "Longer examples"],
      why: "Inconsistent examples teach noise, and the output turns random."
    },
    "改了提示词之后，判断是否真的变好的依据是？": {
      q: "After editing a prompt, what justifies claiming it improved?",
      o: ["Reading it and feeling it is better", "Before-and-after numbers on the same eval set", "The model says it is better", "Someone else glances at it"],
      why: "Prompts change behaviour, so the evidence must be the same cases scored against the same criteria."
    },

    "把「一套流程 + 脚本 + 参考资料」打包成可复用能力，通常叫？": { why: "A Skill packages the procedure, scripts and references in a document loaded on demand." },
    "钩子（Hook）由事件触发自动执行，不需要人主动调用。": { why: "A hook is event-driven automatic execution, unlike a tool someone calls on purpose." },
    "把常用操作变成一条快捷指令的机制是___命令（填：斜杠 / 钩子）。": {
      why: "A slash command freezes a routine action into a single instruction.",
      a: "slash"
    },
    "「模型决定调用哪个工具」这个能力属于？": { why: "Function calling is the model emitting which function plus its arguments; MCP standardises how tools are attached." },
    "想让模型「每次保存后自动格式化」，应该用哪种机制？": { why: "Event-triggered automatic execution is a hook." },
    "Skill 相比一段长提示词，优势在于把流程、脚本与资料打包、按需读取。": { why: "Loading on demand saves context and makes the behaviour stable and reusable." },
    "「保存后自动格式化」这种需求应该用哪种扩展机制？": {
      q: "Which extension mechanism fits the need to format automatically every time a file is saved?",
      o: ["Skill", "Plugin", "Hook", "Slash Command"],
      why: "Event-triggered work belongs to a Hook; a Skill is invoked by a person and a Command is a shortcut."
    },
    "Skill 与一段好提示词的本质区别是？": {
      q: "What is the essential difference between a Skill and a good prompt?",
      o: ["A Skill is longer", "A Skill packages a whole workflow (steps, references, scripts) so execution stays consistent", "A Skill needs no model", "There is no difference"],
      why: "A Skill is a workflow package that loads scripts and references on demand, which is what guarantees consistency."
    },
    "选择扩展机制时，第一个要问的问题是「___」（填：谁触发 / 哪个流行）。": {
      q: "The first question when choosing an extension mechanism is ___ (fill: who triggers it / which one is popular).",
      why: "Event-triggered means Hook; when a person invokes it, pick Skill / Plugin / Command by what is being extended.",
      a: "who triggers it"
    },

    /* ---- 以下 c5 / c6 / c9 三章把 D29 收尾（这两章的课节双语早已完成，缺的只是测评解析）---- */
    "RAG 主要解决模型的哪类问题？": {
      q: "Which problem does RAG mainly solve?",
      o: ["Reasoning is too slow", "Hallucination and ignorance of private material", "Too many parameters", "Not enough VRAM"],
      why: "RAG retrieves evidence before generating, which suppresses fabrication and brings in private material."
    },
    "embedding 的作用是做“语义搜索”：语义相近的文字向量也相近。": {
      q: "Embeddings enable semantic search: text with similar meaning ends up with similar vectors.",
      o: ["True", "False"],
      why: "Embeddings encode meaning into a vector space, so semantic closeness becomes geometric closeness."
    },
    "标准 RAG 流程的三步是：检索 → ___ → 生成。": {
      q: "The three steps of a standard RAG pipeline are: retrieve → ___ → generate.",
      why: "The recalled passages have to be assembled into the prompt before the model can use them.",
      a: "assemble the prompt"
    },
    "文档很小、资料不常变时，优先？": {
      q: "When the material is small and rarely changes, what should you prefer?",
      o: ["Put everything straight into the context window", "Always add a vector store plus reranking", "Fine-tune immediately", "Buy a GPU cluster"],
      why: "Small material fits in context directly — simpler, and it avoids over-engineering."
    },
    "RAG 检索不到相关资料时，最稳妥的做法是？": { why: "Saying there is no basis avoids fabrication, which is exactly the point of grounding." },
    "文档切片（chunk）的切法会明显影响检索质量。": { why: "Chunk size and overlap directly determine how relevant the recalled content can be." },
    "RAG 检索质量最关键的环节是？": {
      q: "Which part matters most for RAG retrieval quality?",
      o: ["Swapping in a stronger generation model", "Chunking and retrieval strategy", "Raising the temperature", "Increasing the output length"],
      why: "What is never retrieved can never be used; chunking decides the smallest unit of knowledge the model ever sees."
    },
    "把检索到的片段直接拼进上下文而不做标注，主要问题是？": {
      q: "What is the main problem with pasting retrieved passages into the context without labelling them?",
      o: ["It costs more tokens", "The model cannot tell evidence from ordinary text and issues no citations", "The model refuses to answer", "It gets slower"],
      why: "Numbers and source labels make answers traceable and let you require the model to use only the supplied material."
    },
    "扫描件 PDF 不能直接检索，需要先做什么？": {
      q: "A scanned PDF cannot be searched directly. What has to happen first?",
      o: ["Compression", "OCR", "Merging", "Encryption"],
      why: "Scans have no text layer, so OCR is required before anything can be searched, copied or cited."
    },

    "MCP 的本质是？": {
      q: "What is MCP at its core?",
      o: ["A specific model", "An open standard connecting models to tools", "A database", "A programming language"],
      why: "MCP is the Model Context Protocol: it standardises how tools get attached."
    },
    "MCP 中真正”提供工具能力“的是 Server 角色。": {
      q: "In MCP, the role that actually provides tool capabilities is the Server.",
      o: ["True", "False"],
      why: "The Server exposes capabilities through the standard; the Host consumes them."
    },
    "MCP 三类原语中，会被模型执行、带副作用的是___。": {
      q: "Of the three MCP primitives, the one the model executes and that can have side effects is ___.",
      why: "Tools are model-triggered actions; Resources are read-only and Prompts are templates."
    },
    "MCP 与 Function Calling 的关系是？": {
      q: "What is the relationship between MCP and function calling?",
      o: ["They replace each other", "They are unrelated", "Complementary: function calling decides, MCP connects", "They are the same thing"],
      why: "Function calling is the model-side decision; MCP standardises the connection, and the two are usually combined."
    },
    "MCP 三类原语中，只读、用来提供上下文的是？": { why: "Resources are read-only context; Tools carry side effects, and Prompts are preset instruction templates." },
    "MCP 的 stdio 传输适合「把本地子进程当作 Server」的场景。": { why: "stdio has the host spawn a subprocess and talk over standard input/output, which is the usual local arrangement." },
    "「调用工具前向用户确认」是谁的职责？": {
      q: "Whose responsibility is it to confirm with the user before a tool is called?",
      o: ["Server", "Client", "Host", "The model"],
      why: "The Host owns the UI and the permission system and confirms before the call; the Server only declares and executes capability."
    },
    "把只读数据包装成 MCP Tools 暴露，主要问题是？": {
      q: "What goes wrong when read-only data is wrapped and exposed as MCP Tools?",
      o: ["The model cannot discover it", "The model calls it needlessly and you inherit extra parameters and side-effect worries", "It is too slow", "It is incompatible with stdio"],
      why: "Read-only data belongs in Resources; Tools are for actions with side effects."
    },
    "stdio 与远程 HTTP 传输之间切换，需要重写 Server 的能力实现吗？": {
      q: "Switching between stdio and a remote HTTP transport means rewriting the Server's capability code. True or false?",
      o: ["Yes, everything", "No — capabilities and transport are separate", "Only the Tools", "Only the Resources"],
      why: "MCP separates capability design from transport, so changing transport leaves capability semantics untouched."
    },

    "大模型 API 的费用通常由哪两部分构成？": { why: "Input and output tokens are priced separately, and output usually costs more per token." },
    "输出 token 的单价通常比输入 token 更高。": { why: "Producing a token one at a time costs more compute than reading it." },
    "改善首字延迟体感最直接的手段是开启___输出（填：流式 / 批量）。": {
      why: "Streaming surfaces the first token almost immediately, which sharply cuts perceived waiting.",
      a: "streaming"
    },
    "下列哪一项不属于省钱的四招？": { why: "Temperature has nothing to do with cost, and an extreme value only makes output less stable." },
    "同样的输出长度下，降低单次调用成本最直接的做法是？": { why: "Model tier and context length are the two main cost levers." },
    "模型越大，答案就一定越适合你的任务。": { why: "Selection follows task difficulty; a flagship model on a trivial job is both slow and expensive." },
    "多轮对话的费用增长比直觉快，原因是？": {
      q: "Multi-turn conversations get expensive faster than intuition suggests. Why?",
      o: ["The model remembers and double-bills", "Every turn resends the whole history, so input tokens grow roughly quadratically", "Outputs keep getting longer", "Vendors charge per turn"],
      why: "The model is stateless, so history is resent every turn; long conversations need summarising or trimming."
    },
    "给「创意写作」类任务上结果缓存，可能的问题是？": {
      q: "What is the likely problem with applying result caching to creative-writing tasks?",
      o: ["It saves even more money", "Identical inputs return identical output, killing variety", "It becomes slower", "The cache never hits"],
      why: "Caching suits idempotent tasks; work that is supposed to vary should not be cached."
    },
    "模型选型的核心原则是选「___的最便宜模型」，并用评测集验证。": {
      q: "The core rule of model selection is to choose the cheapest model that is ___, then verify with an eval set.",
      why: "Start with the cheap model and escalate only when it falls short; flagship-everywhere is the most expensive habit.",
      a: "good enough"
    }
  }
};
