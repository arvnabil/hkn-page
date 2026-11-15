import test from 'node:test';
import assert from 'node:assert/strict';
import { isWhatsAppLink, whatsappLink } from '../../resources/js/lib/whatsapp.js';
import { showWhatsAppBubble, bubbleOffset } from '../../resources/js/lib/whatsappBubble.js';

test.afterEach(() => { delete globalThis.window; });

test('contact links always use /wa and cannot carry destination numbers', () => {
  const url = new URL(whatsappLink({ sourceUrl: 'https://wa.me/629999?phone=629999&text=Halo%20AVer', position: 'footer', campaign: 'footer_contact' }), 'https://site.test');
  assert.equal(url.pathname, '/wa');
  assert.equal(url.searchParams.get('text'), 'Halo AVer');
  assert.equal(url.searchParams.get('utm_content'), 'footer');
  assert.equal(url.searchParams.get('utm_campaign'), 'footer_contact');
  assert.equal(url.searchParams.has('phone'), false);
  assert.equal(url.href.includes('629999'), false);
});

test('visitor campaign attribution survives while the button is identified separately', () => {
  globalThis.window = { location: { origin: 'https://site.test', pathname: '/produk/camera', search: '?utm_source=google&utm_medium=cpc&utm_campaign=launch&utm_term=camera' } };
  const url = new URL(whatsappLink({ position: 'product_detail', text: 'Kamera & Teams?' }), window.location.origin);
  assert.equal(url.searchParams.get('utm_source'), 'google');
  assert.equal(url.searchParams.get('utm_medium'), 'cpc');
  assert.equal(url.searchParams.get('utm_campaign'), 'launch');
  assert.equal(url.searchParams.get('utm_term'), 'camera');
  assert.equal(url.searchParams.get('utm_content'), 'product_detail');
  assert.equal(url.searchParams.get('page_route'), '/produk/camera');
  assert.equal(url.searchParams.get('text'), 'Kamera & Teams?');
});

test('entity slugs are not put into numeric entity_id', () => {
  const url = new URL(whatsappLink({ entityId: 'cam550', entitySlug: 'cam550' }), 'https://site.test');
  assert.equal(url.searchParams.has('entity_id'), false);
  assert.equal(url.searchParams.get('entity_slug'), 'cam550');
});

test('legacy WhatsApp links are detected without changing unrelated links', () => {
  assert.equal(isWhatsAppLink('https://api.whatsapp.com/send?phone=62123'), true);
  assert.equal(isWhatsAppLink('/wa?text=Halo'), true);
  assert.equal(isWhatsAppLink('mailto:test@example.com'), false);
  assert.equal(isWhatsAppLink('/produk'), false);
  assert.equal(isWhatsAppLink('https://unrelated.test/wa'), false);
  assert.equal(isWhatsAppLink('http://['), false);
});

const enabled = { is_enabled: true, phone: '6281234567890', active_pages: ['all'] };
test('bubble follows enabled flag and configured phone', () => {
  assert.equal(showWhatsAppBubble(enabled, '/'), true);
  assert.equal(showWhatsAppBubble({ ...enabled, is_enabled: false }, '/'), false);
  assert.equal(showWhatsAppBubble({ ...enabled, phone: null }, '/'), false);
});

test('bubble follows homepage and product visibility including brand catalogs', () => {
  const homepage = { ...enabled, active_pages: ['homepage'] };
  assert.equal(showWhatsAppBubble(homepage, '/'), true);
  assert.equal(showWhatsAppBubble(homepage, '/artikel'), false);
  const products = { ...enabled, active_pages: ['products'] };
  assert.equal(showWhatsAppBubble(products, '/produk/cam550'), true);
  assert.equal(showWhatsAppBubble(products, '/aver/products'), true);
  assert.equal(showWhatsAppBubble(products, '/tentang'), false);
  assert.equal(showWhatsAppBubble({ ...enabled, active_pages: [] }, '/'), false);
});

test('invalid offsets fall back to usable defaults', () => {
  assert.equal(bubbleOffset('110px', '24px'), '110px');
  assert.equal(bubbleOffset('2rem', '24px'), '2rem');
  assert.equal(bubbleOffset('invalid', '24px'), '24px');
});
