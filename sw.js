const CACHE = "oes-fellowship-v1";
const FILES = ["./","index.html","manifest.webmanifest",
  "icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/apple-touch-icon.png",
  "fonts/newsreader-latin-400-normal.woff2","fonts/newsreader-latin-600-normal.woff2",
  "fonts/public-sans-latin-400-normal.woff2","fonts/public-sans-latin-500-normal.woff2","fonts/public-sans-latin-600-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Network first for the page (so updates arrive), cache first for everything else; always works offline.
self.addEventListener("fetch", e => {
  const req = e.request; if(req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if(req.mode === "navigate"){
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("index.html", c)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
