/**
 * Analytics and Event Tracking for Cloudflare Analytics & Edge Logs
 * 
 * Sends lightweight beacon requests to /api/export/{format}
 * Every request is logged by Cloudflare edge proxy and appears in:
 * Cloudflare Dashboard -> Analytics & Logs -> Traffic -> Path filter (/api/export/*)
 * Cloudflare Pages -> Metrics -> Functions
 */

export function trackExport(format = 'unknown', meta = {}) {
  try {
    const endpoint = `/api/export/${encodeURIComponent(format)}`;
    const payload = JSON.stringify({
      format,
      timestamp: Date.now(),
      url: window.location.href,
      lang: document.documentElement.lang || 'ru',
      ...meta,
    });

    // 1. Send via navigator.sendBeacon (most reliable for downloads/unloads)
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (!sent) {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    // 2. Cloudflare Zaraz integration (if enabled in Cloudflare dashboard)
    if (typeof window !== 'undefined' && window.zaraz && typeof window.zaraz.track === 'function') {
      window.zaraz.track('export_download', { format, ...meta });
    }

    // 3. Google Analytics 4 (if gtag is present)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'file_download', {
        file_extension: format,
        event_category: 'Export',
        event_label: format,
        ...meta,
      });
    }

    // 4. Yandex Metrika (if ym is present)
    if (typeof window !== 'undefined' && typeof window.ym === 'function') {
      window.ym(window.__YM_ID || 0, 'reachGoal', `export_${format}`, meta);
    }
  } catch (e) {
    // Non-blocking: analytics should never fail the user experience
    console.debug('Analytics track error:', e);
  }
}
