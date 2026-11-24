// Bei jeder neuen Version der App diese Zeile hochzählen, damit das Handy die neue Fassung lädt.
var VERSION = "innehalten-2";
var DATEIEN = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(DATEIEN); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (namen) {
    return Promise.all(namen.filter(function (n) { return n !== VERSION && n !== "innehalten-schrift"; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (treffer) {
    if (treffer) return treffer;
    return fetch(e.request).then(function (antwort) {
      var kopie = antwort.clone();
      caches.open(VERSION).then(function (c) { c.put(e.request, kopie); }).catch(function () {});
      return antwort;
    });
  }));
});
