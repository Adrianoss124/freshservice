const CACHE_NAME = 'techservice-cache-v1';
const urlsToCache = [
    '/freshservice/index.html',
    '/freshservice/style.css',
    '/freshservice/script.js',
    '/freshservice/hamburger.js',
    '/freshservice/img/logo.webp',
    '/freshservice/onas/onas.html',
    '/freshservice/projekt/uslugi.html',
    '/freshservice/cennik/cennik.html',
    '/freshservice/zlec/zlec.html',
    '/freshservice/contact.html',
    '/freshservice/reviews.html',
    '/freshservice/faq.html',
    '/freshservice/terms.html',
    '/freshservice/privacy.html'
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

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});