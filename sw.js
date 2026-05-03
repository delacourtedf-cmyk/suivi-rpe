// Service Worker — RPE Suivi
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', function(e) {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'RPE Suivi', {
      body: data.body || "N'oubliez pas de remplir votre questionnaire !",
      icon: 'https://delacourtedf-cmyk.github.io/suivi-rpe/icon.png',
      badge: 'https://delacourtedf-cmyk.github.io/suivi-rpe/icon.png',
      tag: data.tag || 'rpe',
      requireInteraction: true
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('https://delacourtedf-cmyk.github.io/suivi-rpe/'));
});
