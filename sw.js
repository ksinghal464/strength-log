// Network-first for everything, cache as offline fallback.
// Bump VERSION when the list of files changes.
const VERSION = "v19"; // keep in sync with APP_VERSION in app.js
const CACHE = "strength-log-" + VERSION;
const IMG_CACHE = "strength-log-img"; // kept across versions
const ASSETS = [
  "./", "./index.html", "./images.js", "./app.js", "./app.css", "./manifest.webmanifest",
  "./icon.svg", "./icon-192.png", "./icon-maskable-512.png", "./icon-512.png", "./apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  // cache: "reload" so install never copies a stale file from the browser's HTTP cache.
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== IMG_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  // Exercise photos never change: cache-first, stored on first view.
  if (url.pathname.includes("/img/")) {
    event.respondWith(
      caches.open(IMG_CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) c.put(req, res.clone());
        return res;
      })))
    );
    return;
  }
  // "no-cache": always revalidate with the server (GitHub Pages sends max-age=600, which would
  // otherwise serve an up-to-10-minute-old app.js after an update).
  const fresh = req.mode === "navigate" ? new Request(req.url, { cache: "no-cache" }) : new Request(req, { cache: "no-cache" });
  event.respondWith(
    fetch(fresh)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) =>
          hit || (req.mode === "navigate" ? caches.match("./index.html") : Response.error())
        )
      )
  );
});
