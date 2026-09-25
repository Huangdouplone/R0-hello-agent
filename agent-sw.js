/* R0:hello agent Service Worker —— 提供离线缓存
 * 制作者 / Creator:    Bilibili 黄豆666 (huangdouplone)
 * 版权所有 / Copyright: (c) 2026 黄豆666 / huangdouplone. All rights reserved.
 * 隶属 / Series:        隶属于拾色造梦企划 EDU 系列
 * 通过 http(s) 托管本目录时自动生效；file:// 直接打开时浏览器会拒绝注册，属正常现象。
 */
const CACHE = "r0-hello-agent-v26";
/* ASSETS 必须与 index.html 里 <script src> 的 URL 逐字符一致（含 ?v=N 查询串）：
   缓存以「完整请求 URL」为键，裸文件名匹配不上带查询串的请求，会导致离线时取不到这些资源。 */
const ASSETS = [
  "./", "index.html",
  "agent-extra-data.js?v=6", "lang-en.js?v=3", "lang-en-content.js?v=14", "agent-extra-data2.js?v=6", "agent-deepen-a.js?v=1", "agent-deepen-b.js?v=1", "agent-deepen-c.js?v=1",
  "agent-sw.js", "README.md", "LICENSE.md"
];
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (u) {
        return c.add(u).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (r) {
      return r || fetch(e.request).then(function (resp) {
        var cp = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, cp); });
        return resp;
      }).catch(function () { return caches.match("index.html"); });
    })
  );
});
