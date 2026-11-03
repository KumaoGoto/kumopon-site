// 後片づけの Service Worker（Web/tools/retire_play.py が書いた）。ブラウザ版は https://kumopon.kumao.app/ にうつった。
// 前の版を手元に置いた人のブラウザがこれに入れ替わったら、手元の置き場を消して自分を外し、開いているページを読み直す
// （読み直すと、この場所の案内のページから新しい場所へ移る）
// （fetch を受けないので、読み直しはサイトへ直接行く）
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('kumopon-')).map((k) => caches.delete(k)));
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window' });
    await Promise.all(windows.map((w) => w.navigate(w.url).catch(() => null)));
    await self.registration.unregister();
  })());
});
