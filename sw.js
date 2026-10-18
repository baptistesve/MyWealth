/* MyWealth — service worker : application disponible hors ligne.
   Seuls les fichiers de l'application sont mis en cache ; les données (comptes, montants)
   restent dans le stockage local de l'appareil et dans votre cloud, jamais ici. */
const VERSION = "mywealth-v1";
const ASSETS = [
  "./", "./index.html", "./config.js", "./manifest.webmanifest", "./redirect.html",
  "./vendor/chart.umd.min.js", "./vendor/msal-browser.min.js", "./vendor/msal-redirect-bridge.min.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];
// Fichiers susceptibles de changer (page, configuration) : réseau d'abord, cache si hors ligne
const NETWORK_FIRST = /\/(index\.html|config\.js|manifest\.webmanifest|redirect\.html)?$/;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
function timeout(ms){ return new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)); }
async function networkFirst(req){
  const cache = await caches.open(VERSION);
  try{
    const res = await Promise.race([fetch(req), timeout(4000)]);
    if(res && res.ok && !new URL(req.url).search) cache.put(req, res.clone());
    return res;
  }catch(err){
    const hit = await cache.match(req, {ignoreSearch:true}) || (req.mode === "navigate" ? await cache.match("./index.html") : null);
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
