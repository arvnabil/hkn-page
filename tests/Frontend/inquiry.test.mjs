import test from 'node:test';
import assert from 'node:assert/strict';
import { sendInquiry } from '../../resources/js/lib/inquiry.js';

const originalFetch = globalThis.fetch;
test.afterEach(() => { globalThis.fetch = originalFetch; });

test('success requires server confirmation that the inquiry was saved', async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/penawaran');
    assert.equal(JSON.parse(options.body).name, 'QA');
    return { ok: true, status: 201, json: async () => ({ success: true, inquiry_id: 12 }) };
  };
  assert.equal((await sendInquiry({ name: 'QA' })).inquiry_id, 12);
});

test('validation errors are shown instead of a false success', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 422, json: async () => ({ errors: { email: ['Email tidak valid.'] } }) });
  await assert.rejects(sendInquiry({}), error => error.errors.email === 'Email tidak valid.');
});

test('a redirect to an HTML page does not count as successful submission', async () => {
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError('HTML response'); } });
  await assert.rejects(sendInquiry({}), /belum tersimpan/);
});

test('server failure is not masked even if its payload says success', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 503, json: async () => ({ success: true }) });
  await assert.rejects(sendInquiry({}), /belum tersimpan/);
});

test('network failures are rejected', async () => {
  globalThis.fetch = async () => { throw new TypeError('Network unavailable'); };
  await assert.rejects(sendInquiry({}), /Network unavailable/);
});

test('rate limiting has a clear retry message', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 429, json: async () => null });
  await assert.rejects(sendInquiry({}), /Terlalu banyak kiriman/);
});
