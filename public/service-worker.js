/**
 * Service worker for offline capabilities
 * Implements caching strategies and background sync for EdPsych Connect
 */

// Cache names
const STATIC_CACHE = 'edpsych-static-v1';
const DYNAMIC_CACHE = 'edpsych-dynamic-v1';
const CONTENT_CACHE = 'edpsych-content-v1';
const ASSESSMENT_CACHE = 'edpsych-assessment-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, CONTENT_CACHE, ASSESSMENT_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // API requests - network first, fallback to cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before using it
          const responseToCache = response.clone();
          
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If it's an API request for content, return offline content
              if (event.request.url.includes('/api/content-management/')) {
                return caches.match('/api/offline-content');
              }
              
              // If it's an API request for assessment, return offline assessment
              if (event.request.url.includes('/api/assessment/')) {
                return caches.match('/api/offline-assessment');
              }
              
              return caches.match('/offline');
            });
        })
    );
    return;
  }
  
  // Content resources - cache first, fallback to network
  if (
    event.request.url.includes('/content/') || 
    event.request.destination === 'image' ||
    event.request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Update cache in the background
            fetch(event.request)
              .then((response) => {
                caches.open(CONTENT_CACHE)
                  .then((cache) => {
                    cache.put(event.request, response);
                  });
              })
              .catch(() => {
                console.log('Failed to update content cache');
              });
              
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache
          return fetch(event.request)
            .then((response) => {
              // Clone the response before using it
              const responseToCache = response.clone();
              
              caches.open(CONTENT_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch(() => {
              // For images, return a placeholder
              if (event.request.destination === 'image') {
                return caches.match('/images/placeholder.png');
              }
              
              return caches.match('/offline');
            });
        })
    );
    return;
  }
  
  // HTML pages - network first, fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before using it
          const responseToCache = response.clone();
          
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              return caches.match('/offline');
            });
        })
    );
    return;
  }
  
  // Default strategy - stale-while-revalidate
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response immediately if available
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Update cache with fresh response
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
              
            return networkResponse;
          })
          .catch(() => {
            console.log('Fetch failed; returning offline page instead.');
            
            // If we can't fetch the resource, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
            
            // Return nothing for other resources
            return null;
          });
          
        return cachedResponse || fetchPromise;
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-assessments') {
    event.waitUntil(syncAssessments());
  }
  
  if (event.tag === 'sync-learning-progress') {
    event.waitUntil(syncLearningProgress());
  }
});

// Sync assessment data
async function syncAssessments() {
  try {
    const db = await openDatabase();
    const offlineAssessments = await db.getAll('offlineAssessments');
    
    for (const assessment of offlineAssessments) {
      try {
        const response = await fetch('/api/assessment/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assessment),
        });
        
        if (response.ok) {
          await db.delete('offlineAssessments', assessment.id);
        }
      } catch (error) {
        console.error('Failed to sync assessment:', error);
      }
    }
  } catch (error) {
    console.error('Error syncing assessments:', error);
  }
}

// Sync learning progress data
async function syncLearningProgress() {
  try {
    const db = await openDatabase();
    const offlineProgress = await db.getAll('offlineLearningProgress');
    
    for (const progress of offlineProgress) {
      try {
        const response = await fetch('/api/learning-path/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(progress),
        });
        
        if (response.ok) {
          await db.delete('offlineLearningProgress', progress.id);
        }
      } catch (error) {
        console.error('Failed to sync learning progress:', error);
      }
    }
  } catch (error) {
    console.error('Error syncing learning progress:', error);
  }
}

// Helper function to open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EdPsychOfflineDB', 1);
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores for offline data
      if (!db.objectStoreNames.contains('offlineAssessments')) {
        db.createObjectStore('offlineAssessments', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('offlineLearningProgress')) {
        db.createObjectStore('offlineLearningProgress', { keyPath: 'id' });
      }
    };
  });
}

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/badge.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
