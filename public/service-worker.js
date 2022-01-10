"use strict";
// Cache Name
const CACHE_NAME = "reciply-cache-v1";
// Cache Files
const FILES_TO_CACHE = ["/offline.html"];

// Install service worker
self.addEventListener("install", (evt) => {
    console.log("[ServiceWorker] Install");
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[ServiceWorker] Pre-caching offline page");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});
