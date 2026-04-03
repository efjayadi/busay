const CACHE_NAME = 'busaybook-cache-v2';
const ASSETS_TO_CACHE = [
    './motion_relief.html',
    './manifest.json'
];

// Install event: Cache the essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Force the waiting service worker to become the active service worker
});

// Activate event: Clean up old caches if the version updates
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control of all open pages immediately
});

// Fetch event: Serve from cache first, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if found
            if (response) {
                return response;
            }
            // Otherwise, fetch from the network
            return fetch(event.request).catch(() => {
                // If both cache and network fail (offline), you can return a fallback here
                console.log('Fetch failed; returning offline page instead.');
            });
        })
    );
});
