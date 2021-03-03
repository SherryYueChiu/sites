const files = [
    './',
    './app.js',
    './style.css',
];

self.addEventListener('install', async e => {
    const cache = await caches.open('files');
    cache.addAll(files);
});

self.addEventListener('fetch', async e => {
    const req = e.request;
    const res = isApiCall(req) ? getFromNetwork(req) : getFromCache(req);
    await e.respondWith(res);
});