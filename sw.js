const CACHE_NAME = 'techservice-cache-v1';
const urlsToCache = [
    '/freshservice/index.html',
    '/freshservice/style.css',
    '/freshservice/script.js',
    '/freshservice/img/logo.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});