// Despues de configurar SW1
function actualizarCacheDinamico(dynamicCache, req, res) {
    if (res.ok) {
        // Verificar que el esquema de la solicitud sea http o https
        if (req.url.startsWith('http')) {
            return caches.open(dynamicCache).then(cache => {
                cache.put(req, res.clone());
                return res.clone();
            });
        }
    }
    return res;
}