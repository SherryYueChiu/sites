window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    //e.prompt();
});

// check for support
if ('serviceWorker' in navigator) {
    try {
        // calls navigator.serviceWorker.register('sw.js');
        registerServiceWorker();
    } catch (e) {
        console.error(e);
    }
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('./sw-generated.js');
        // do something with registration, e.g., registration.scope
    } catch (e) {
        console.error('ServiceWorker failed', e);
    }
}

self.addEventListener('install', e => {
    // Perform install steps
});

self.addEventListener('fetch', e => {
    // Empty for now
});

Notification.requestPermission(result => {
    if (result !== 'granted') {
        //handle permissions deny
    }
});

async function subscribeToPushNotifications(registration) {
    const options = {
        userVisibleOnly: true,
        applicationServerKey: btoa('...'),
    };
    const subscription = await registration.pushManager.subscribe(options);
    //Received subscription
}

async function getFromNetwork(req) {
    const cache = await caches.open('data');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (e) {
        const res = await cache.match(req);
        return res || getFallback(req);
    }
}