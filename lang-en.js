/* R0:hello agent · 英文覆盖层（与 AGI 的 *_EN 表同构）
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 * 从 agent-extra-data.js 的 *_en 字段派生出按 id 索引的英文表，
 * 渲染层在 EN 模式下优先取这些表；缺字段则回退中文（正文中文，符合系列已知约定）。
 * 单一事实源 = 数据文件中的 *_en 字段，本文件只做“提取/索引”，不重复抄写文案。
 */
(function(){
"use strict";

/* 章节名 / 描述 */
window.AGENT_STAGE_EN = {};
(window.AGENT_CURRICULUM || []).forEach(function (s) {
  window.AGENT_STAGE_EN[s.id] = { name: s.name_en, desc: s.desc_en };
});

/* 课节标题（按课节 id 扁平索引） */
window.AGENT_LESSON_EN = {};
(window.AGENT_CURRICULUM || []).forEach(function (s) {
  (s.lessons || []).forEach(function (l) {
    window.AGENT_LESSON_EN[l.id] = { title: l.title_en };
  });
});

/* 动手实战标题 */
window.AGENT_LAB_EN = {};
(window.AGENT_LABS || []).forEach(function (x) {
  window.AGENT_LAB_EN[x.id] = { t: x.t_en };
});

/* 名词辨析 */
window.AGENT_TERM_EN = {};
(window.AGENT_TERMS || []).forEach(function (x) {
  window.AGENT_TERM_EN[x.term] = { term: x.term_en, short: x.short_en, vs: x.vs_en };
});

/* 工作流步骤标题 + 示例名 */
window.AGENT_WORKFLOW_EN = { steps: {}, example: {} };
(window.AGENT_WORKFLOW && window.AGENT_WORKFLOW.steps || []).forEach(function (x) {
  window.AGENT_WORKFLOW_EN.steps[x.n] = { title: x.title_en };
});
if (window.AGENT_WORKFLOW && window.AGENT_WORKFLOW.example) {
  window.AGENT_WORKFLOW_EN.example.name = window.AGENT_WORKFLOW.example.name_en;
}

})();
