/* MyWealth — service worker : application disponible hors ligne.
   Seuls les fichiers de l'application sont mis en cache ; les données (comptes, montants)
   restent dans le stockage local de l'appareil et dans votre cloud, jamais ici.
   Only app files are cached here — never your data. */
const VERSION = "mywealth-v3";
const ASSETS = [
  "./", "./index.html", "./manifest.webmanifest", "./redirect.html", "./privacy.html",
  "chart.umd.min.js", "msal-browser.min.js", "msal-redirect-bridge.min.js",
  "icon-192.png", "icon-512.png", "maskable-512.png",
  "apple-touch-icon.png", "favicon-32.png"
];
// Pages et configuration : réseau d'abord (sans cache HTTP), copie locale si hors ligne
const NETWORK_FIRST = /\/(index\.html|config\.js|manifest\.webmanifest|redirect\.html|privacy\.html)?$/;

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    // cache:"reload" = contourne le cache HTTP du navigateur (GitHub Pages : max-age=600)
    await c.addAll(ASSETS.map(u => new Request(u, {cache:"reload"})));
    // config.js : facultatif (absent sur une copie non configurée) — ne bloque pas l'installation
    try{ const r = await fetch("./config.js", {cache:"no-store"}); if(r.ok) await c.put("./config.js", r); }catch(err){}
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
function timeout(ms){ return new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)); }
async function networkFirst(req){
  const cache = await caches.open(VERSION);
  const url = new URL(req.url);
  const key = url.origin + url.pathname;                    // clé sans « ?t=… » : retrouvée hors ligne
  // navigation : la requête d'origine doit être réutilisée telle quelle ; sinon : sans cache HTTP
  const netReq = req.mode === "navigate" ? req : new Request(key, {cache:"no-store", credentials:"same-origin"});
  try{
    const res = await Promise.race([fetch(netReq), timeout(4000)]);
    if(res && res.ok && (req.mode !== "navigate" || !url.search)) cache.put(key, res.clone());
    return res;
  }catch(err){
    const hit = await cache.match(key, {ignoreSearch:true}) || (req.mode === "navigate" ? await cache.match("./index.html") : null);
    if(hit) return hit;
    throw err;
  }
}
async function cacheFirst(req){
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req, {ignoreSearch:true});
  if(hit) return hit;
  const res = await fetch(req);
  if(res && res.ok) cache.put(req, res.clone());
  return res;
}
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;      // API (cours, taux, cloud) : jamais interceptées
  if(req.mode === "navigate" || NETWORK_FIRST.test(url.pathname)) e.respondWith(networkFirst(req));
  else e.respondWith(cacheFirst(req));
});
