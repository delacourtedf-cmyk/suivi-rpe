// Service Worker — RPE Suivi v3 (Push Backend)
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// Réception d'une notification push du backend Firebase
self.addEventListener('push', function(e) {
  let data = {};
  try {
    data = e.data ? e.data.json() : {};
  } catch(err) {
    data = { title: 'RPE Suivi', body: e.data ? e.data.text() : "N'oubliez pas votre questionnaire !" };
  }

  const options = {
    body: data.body || "N'oubliez pas de remplir votre questionnaire !",
    icon: 'https://delacourtedf-cmyk.github.io/suivi-rpe/icon.png',
    badge: 'https://delacourtedf-cmyk.github.io/suivi-rpe/icon.png',
    tag: data.tag || 'rpe-default',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: {
      url: 'https://delacourtedf-cmyk.github.io/suivi-rpe/',
      timestamp: Date.now()
    }
  };

  e.waitUntil(
    self.registration.showNotification(data.title || 'RPE Suivi', options)
  );
});

// Clic sur une notification → ouvre l'app ou focus la fenêtre
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  const targetUrl = e.notification.data?.url || 'https://delacourtedf-cmyk.github.io/suivi-rpe/';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si l'app est déjà ouverte, la focus
      for (const client of windowClients) {
        if (client.url.includes('suivi-rpe') && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon ouvrir une nouvelle fenêtre
      return clients.openWindow(targetUrl);
    })
  );
});

// Gestion du pushsubscriptionchange (renouvellement auto)
self.addEventListener('pushsubscriptionchange', function(e) {
  e.waitUntil(
    self.registration.pushManager.subscribe(e.oldSubscription.options)
      .then(function(subscription) {
        // Notifie l'app pour re-sync avec le backend
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'PUSH_SUBSCRIPTION_CHANGED',
              subscription: subscription.toJSON()
            });
          });
        });
      })
  );
});
