    //Segundo bloque 
    importScripts('js/sw-utils.js');
    
    const CACHE_STATIC_NAME = 'static-v2';
    const CACHE_DYNAMIC_NAME = 'dynamic-v1';
    const CACHE_INMUTABLE_NAME = 'inmutable-v1';
    
    const APP_SHELL = [
        //'/',
        '/index.html',
        'img/favicon.ico',
        'img/avatars/hulk.jpg',
        'img/avatars/ironman.jpg',
        'img/avatars/spiderman.jpg',
        'img/avatars/thor.jpg',
        'img/avatars/wolverine.jpg',
        'js/app.js',
        'js/sw-utils.js'
    ];
    
    const APP_SHELL_INMUTABLE = [
        'https://fonts.googleapis.com/css?family=Quicksand:300,400',
        'https://fonts.googleapis.com/css?family=Lato:400,300',
        'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
        'css/animate.css',
        'js/libs/jquery.js'
    ];
    
    // Instalación del service worker con manejo de errores
    self.addEventListener('install', e => {
        const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache =>
            cache.addAll(APP_SHELL).catch(err => {
                console.error('Error al agregar al cache estático:', err);
            })
        );
        const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache =>
            cache.addAll(APP_SHELL_INMUTABLE).catch(err => {
                console.error('Error al agregar al cache inmutable:', err);
            })
        );
        e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
    });
    
    // Activación del service worker
    self.addEventListener('activate', e => {
        const respuesta = caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_STATIC_NAME && key.includes('static')) {
                        return caches.delete(key);
                    }
                })
            );
        });
        //e.waitUntil(respuesta);
    });
    //------------------------------------------- cache con network 2a parte
    self.addEventListener('fetch', e => {
        const respuesta = caches.match(e.request).then(res => {
            if(res){
                return res;
            }else{
                return fetch(e.request).then(newRes => {
                    return actualizarCacheDinamico(CACHE_DYNAMIC_NAME, e.request, newRes);
                });
            }
        });
        e.respondWith(respuesta);
    });