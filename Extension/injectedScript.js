(function() {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('/web/')) {
      let body = args[1] && args[1].body;
      if (body) {
        window.postMessage({ type: 'INSTAGRAM_FETCH', url, body }, '*');
        console.log('Intercepted fetch:', url);
      }
    }
    return originalFetch.apply(this, args);
  };

  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return originalXHROpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {
    if (this._url && this._url.includes('/web/') && body) {
      window.postMessage({ type: 'INSTAGRAM_XHR', url: this._url, body }, '*');
      console.log('Intercepted XHR:', this._url);
    }
    return originalXHRSend.apply(this, arguments);
  };
})();
