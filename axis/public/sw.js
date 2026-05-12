const CACHE_NAME = 'axis-v2';
const urls = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => { 
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urls))); 
});

self.addEventListener('fetch', e => { 
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); 
});

self.addEventListener('activate', e => {
  // Delete old caches
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('push', e => { 
  const data = e.data?.json() || {}; 
  self.registration.showNotification('AXIS', { body: data.content || 'New message' }); 
});