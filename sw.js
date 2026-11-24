// Meldingen voor de AutoClipper-app op het beginscherm (vast adres op GitHub).
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function(e){
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = {body: e.data ? e.data.text() : ''}; }
  e.waitUntil(self.registration.showNotification(d.title || 'AutoClipper',
    {body: d.body || '', tag: d.tag || undefined, data: {url: d.url || self.registration.scope}, icon: 'icoon180.png'}));
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = (e.notification.data || {}).url || self.registration.scope;
  // Het overzicht zelf opent binnen de app (de app zoekt zelf de actuele link).
  if (url.indexOf(self.location.origin) !== 0 && /trycloudflare\.com/.test(url)) url = self.registration.scope;
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(lijst){
    for (var i = 0; i < lijst.length; i++) {
      if ('focus' in lijst[i]) {
        if (url.indexOf(self.location.origin) === 0) lijst[i].navigate(url);
        else return self.clients.openWindow(url);
        return lijst[i].focus();
      }
    }
    return self.clients.openWindow(url);
  }));
});
