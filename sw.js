/* osarai.kr 루트 — 예전 웹 단어장의 service worker 를 «정리만» 하는 파일 (2026-11-09)
   예전 방문자의 브라우저에는 옛 sw.js 가 index.html 을 캐시해 두었다. 브라우저가 이 파일을 새로 받으면:
   ① 바로 활성화 ② 옛 단어장 캐시(jvocab-*) 지우기 ③ 스스로 등록 해제 ④ 열려 있던 탭을 새로 고쳐 소개 페이지를 보이게.
   ⚠ 단어(localStorage)는 건드리지 않는다 — osarai.kr/app/ 에서 그대로 보인다.
   ⚠ /app/ 의 단어장은 자기 sw.js(/app/sw.js · 범위 /app/)를 따로 쓴다. 여기서 지우는 캐시 이름과 겹치지 않게 /app/ 쪽 이름을 바꿔 두었다. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => /^jvocab-v/.test(k)).map(k => caches.delete(k)));
    await self.registration.unregister();
    const cs = await self.clients.matchAll({ type: 'window' });
    cs.forEach(c => { try { if (new URL(c.url).pathname === '/' || /\/index\.html$/.test(c.url)) c.navigate(c.url); } catch (e) {} });
  })());
});
