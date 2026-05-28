/* Clears a legacy service worker that caused reload loops when /sw.js was missing. */
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(self.registration.unregister());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
    })()
  );
});
