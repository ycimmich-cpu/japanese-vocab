/* 일본어 단어장 — service worker
   앱 껍데기를 캐시해 두어 인터넷이 없어도 실행되게 한다.
   앱을 새로 배포할 때는 CACHE 값을 올리면 이전 캐시가 정리된다. */
const CACHE = 'jvocab-v3.13.1';   /* 🔴 올려야 «약관이 든 옛 캐시»가 정리된다 (2026-10-13) */
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './kanji.json',          /* 한자 획순 (KanjiVG) — 오프라인에서도 쓰려면 미리 받아 둔다 */
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* 이 주소가 «앱 껍데기»인가. 끝이 / 이거나 /index.html 인 것만 그렇다.
   🔴 2026-10-13 — 종전에는 이 구분이 «없었다». 아래 주석 참고. */
function isShell(url) {
  return /(^|\/)$|\/index\.html$/.test(url.pathname);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* 화면 이동(HTML)은 네트워크 우선 — 새 버전을 바로 받아오고, 오프라인이면 캐시로

     🔴 2026-10-13 결함 수정 — 종전에는 «모든» 넘어가기 응답을 `./index.html` 로 저장했다.
        그래서 `terms.html` 이나 `privacy.html` 을 한 번 열면 그 문서가 «앱 자리»에 덮여 들어가고,
        그 뒤 오프라인에서 앱을 열면 **약관이 앱 대신 떴다.**
        오프라인 대체도 무엇을 요청했든 `./index.html` 을 돌려주어, 오프라인에서
        약관을 열면 **앱이 떴다.** 둘 다 「에러를 내지 않는 실패」다.

     ① 저장은 **그 주소 그대로** 한다 (`c.put(req, …)`).
     ② `./index.html` 은 **앱 껍데기를 받았을 때만** 갱신한다.
     ③ 오프라인 대체는 **그 주소를 먼저** 찾고, 없으면 앱 껍데기로 내린다.
     ④ 🔴 **성공 응답만 저장한다.** 종전에는 404·리다이렉트도 앱 자리에 들어갔다 —
        주소를 한 글자 틀리면 GitHub 의 404 쪽이 «앱»이 되는 길이었다. */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then(c => {
              c.put(req, copy);                                  /* ① 그 주소로 */
              if (isShell(url)) c.put('./index.html', res.clone());   /* ② 껍데기일 때만 */
            });
          }
          return res;
        })
        .catch(() =>                                             /* ③ 그 주소 먼저 */
          caches.match(req, { ignoreSearch: true })
            .then(r => r || caches.match('./index.html'))
            .then(r => r || caches.match('./'))
        )
    );
    return;
  }

  /* 아이콘 등 정적 파일은 캐시 우선 */
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
