export async function sendInquiry(payload) {
  const response = await fetch('/penawaran', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json', Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': globalThis.document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success !== true) {
    const errors = Object.fromEntries(Object.entries(data?.errors || {}).map(([key, messages]) => [key, Array.isArray(messages) ? messages[0] : String(messages)]));
    const fallback = response.status === 419 ? 'Sesi berakhir. Muat ulang halaman lalu coba lagi.'
      : response.status === 429 ? 'Terlalu banyak kiriman. Tunggu sebentar lalu coba lagi.'
      : 'Penawaran belum tersimpan. Silakan coba lagi.';
    const error = new Error(Object.values(errors)[0] || data?.message || fallback);
    error.errors = errors;
    throw error;
  }
  return data;
}
