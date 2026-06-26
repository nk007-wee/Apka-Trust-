// Minimal service worker — makes the app installable on phones.
// It caches the app shell so the page still opens (showing a basic UI)
// even with a flaky connection. Payments still need an active internet
// connection, since they talk to Razorpay's servers.

const CACHE_NAME = "donation-app-v1";
const FILES_TO_CACHE = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});
