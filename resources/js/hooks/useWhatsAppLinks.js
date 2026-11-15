import { useEffect, useRef } from 'react';
import { isWhatsAppLink, whatsappLink } from '../lib/whatsapp';

// Covers CMS rich text and older menu links as well as explicit React CTAs.
export default function useWhatsAppLinks() {
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const normalize = anchor => {
      const href = anchor.getAttribute('href');
      if (!isWhatsAppLink(href)) return false;
      const params = new URL(href, window.location.origin).searchParams;
      const area = anchor.closest('footer') ? 'footer' : anchor.closest('header,nav') ? 'navigation' : 'content';
      const position = params.get('cta_position') || `${area}_${[...root.querySelectorAll('a')].indexOf(anchor)}`;
      const labelNode = anchor.cloneNode(true);
      labelNode.querySelectorAll('svg, [aria-hidden="true"], .material-symbols-outlined').forEach(node => node.remove());
      const explicitLabel = params.get('cta_label');
      const label = (anchor.getAttribute('aria-label') || (explicitLabel !== 'Konsultasi WhatsApp' ? explicitLabel : '') || labelNode.textContent || 'WhatsApp').trim().replace(/\s+/g, ' ').slice(0, 180);
      const updated = whatsappLink({ sourceUrl: href, position, label });
      if (href !== updated) anchor.setAttribute('href', updated);
      return true;
    };
    const scan = () => root.querySelectorAll('a[href]').forEach(normalize);
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['href'] });
    const captureClick = event => {
      const anchor = event.target.closest?.('a[href]');
      // Let the browser follow the rewritten URL, including modifier/new-tab clicks.
      // This also prevents the standalone Link shim from following its old prop.
      if (anchor && root.contains(anchor) && normalize(anchor)) event.stopPropagation();
    };
    root.addEventListener('click', captureClick, true);
    return () => { observer.disconnect(); root.removeEventListener('click', captureClick, true); };
  }, []);
  return rootRef;
}
