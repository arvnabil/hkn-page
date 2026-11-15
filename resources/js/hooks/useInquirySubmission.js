import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { sendInquiry } from '../lib/inquiry';

async function captchaToken(config) {
  if (!config.captcha_enabled) return null;
  if (!config.site_key || !window.grecaptcha) throw new Error('Verifikasi keamanan belum siap. Muat ulang halaman atau hubungi kami melalui WhatsApp.');
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Verifikasi keamanan belum berhasil. Silakan coba lagi.')), 10000);
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(config.site_key, { action: 'penawaran' })
        .then(resolve, reject).finally(() => clearTimeout(timer));
    });
  });
}

export default function useInquirySubmission() {
  const config = usePage().props?.inquiry_form || {};
  const formRef = useRef(null);
  const tracked = useRef(false);
  const pending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if (!document.getElementById('app') || !formRef.current) return;
    const track = () => {
      if (tracked.current) return;
      tracked.current = true;
      fetch('/form/view', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
        body: JSON.stringify({ form_key: 'inquiry', page_slug: window.location.pathname }),
      }).catch(() => {});
    };
    if (!window.IntersectionObserver) { track(); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { track(); observer.disconnect(); }
    });
    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  const submit = async payload => {
    if (pending.current) return false;
    pending.current = true;
    setLoading(true); setErrors({}); setErrorMessage('');
    try {
      const token = await captchaToken(config);
      await sendInquiry({ ...payload, website: honeypot, page_slug: window.location.pathname, recaptcha_token: token });
      setSubmitted(true);
      return true;
    } catch (error) {
      setErrors(error.errors || {});
      setErrorMessage(error.errors ? error.message : 'Koneksi atau verifikasi gagal. Penawaran belum terkonfirmasi; silakan coba lagi.');
      return false;
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

  return { formRef, loading, submitted, setSubmitted, errors, errorMessage, honeypot, setHoneypot, submit };
}
