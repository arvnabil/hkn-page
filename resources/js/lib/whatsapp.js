const BASE = 'http://localhost';

function parseLink(value) {
  try { return new URL(value || '/wa', globalThis.window?.location?.origin || BASE); }
  catch { return null; }
}

export function isWhatsAppLink(value) {
  if (!value) return false;
  const url = parseLink(value);
  if (!url) return false;
  const origin = globalThis.window?.location?.origin || BASE;
  return ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname.toLowerCase())
    || (url.pathname === '/wa' && url.origin === origin)
    || url.protocol === 'whatsapp:';
}

export function whatsappLink({ sourceUrl, text, position, label, campaign = 'website_contact', entityType, entityId, entitySlug, pagePath } = {}) {
  const original = parseLink(sourceUrl) || new URL('/wa', BASE);
  const incoming = new URLSearchParams(globalThis.window?.location?.search || '');
  const cta = position || original.searchParams.get('cta_position') || 'contact_link';
  const values = {
    text: text || original.searchParams.get('text') || 'Halo Harry, saya ingin konsultasi solusi AVer.',
    utm_source: incoming.get('utm_source') || original.searchParams.get('utm_source') || 'website',
    utm_medium: incoming.get('utm_medium') || original.searchParams.get('utm_medium') || 'whatsapp',
    utm_campaign: incoming.get('utm_campaign') || original.searchParams.get('utm_campaign') || campaign,
    utm_content: cta,
    utm_term: incoming.get('utm_term') || original.searchParams.get('utm_term') || '',
    cta_position: cta,
    cta_label: label || original.searchParams.get('cta_label') || 'Konsultasi WhatsApp',
    page_route: pagePath || globalThis.window?.location?.pathname || '/',
    entity_type: entityType || original.searchParams.get('entity_type') || '',
    entity_slug: entitySlug || original.searchParams.get('entity_slug') || '',
  };
  const numericId = entityId ?? original.searchParams.get('entity_id');
  if (/^[1-9]\d*$/.test(String(numericId || ''))) values.entity_id = String(numericId);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, String(value).slice(0, ['text', 'page_route'].includes(key) ? 2000 : 180));
  }
  return `/wa?${params}`;
}
