async function cacheFirst(req) {
  const cache = await caches.open(cacheName); 
  const cachedResponse = await cache.match(req); 
  return cachedResponse || fetch(req); 
}

self.addEventListener('install', async event => {
  console.log('install event')
});

self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(cacheFirst(req));
});

const cacheName = 'pwa-conf-v1';
const staticAssets = [
  './',
  './index.html',
  './js/app.js',
  './js/jquery.min.js',
  './js/JsBarcode.all.min.js',
  './js/qrjs2.min.js',
  './js/showdown.min.js',
  './js/index.js',
  './js/data.js',
  './js/global.js',
  './css/index.css',
  './css/global.css',
  './css/bootstrap.min.css'
];