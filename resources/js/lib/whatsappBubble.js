export function showWhatsAppBubble(settings, path = '/') {
  if (!settings?.is_enabled) return false;
  const phone = String(settings.phone || '').replace(/\D/g, '').replace(/^0/, '62');
  if (!/^[1-9]\d{7,14}$/.test(phone)) return false;
  const pages = settings.active_pages ?? ['all'];
  if (pages.includes('all')) return true;
  if (pages.includes('homepage') && ['/', '/home', '/editorial'].includes(path)) return true;
  return pages.includes('products') && (/^\/(produk|products)(\/|$)/.test(path) || /^\/[^/]+\/products(\/|$)/.test(path));
}

export function bubbleOffset(value, fallback) {
  return /^(?:\d{1,3}(?:\.\d+)?)(px|rem|em)$/.test(String(value || '')) ? value : fallback;
}
