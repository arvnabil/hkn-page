import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '../lib/whatsapp';
import { bubbleOffset, showWhatsAppBubble } from '../lib/whatsappBubble';

export default function WhatsAppBubble() {
  const { props } = usePage();
  const settings = props?.whatsapp_bubble;
  const path = typeof window === 'undefined' ? '/' : window.location.pathname;
  const [iconFailed, setIconFailed] = useState(false);
  if (!showWhatsAppBubble(settings, path)) return null;
  const left = settings.position === 'bottom-left';
  const color = /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(settings.button_color || '') ? settings.button_color : '#25D366';
  const label = settings.tooltip || 'Chat melalui WhatsApp';
  const product = props.product;
  const article = props.article;
  const entity = product || article;
  const href = whatsappLink({ text: settings.message, position: 'floating_bubble', label,
    campaign: 'floating_contact', entityType: product ? 'product' : article ? 'article' : undefined,
    entityId: entity?.databaseId, entitySlug: entity?.slug });
  const icon = settings.icon ? `/storage/${settings.icon.replace(/^\/?storage\//, '').replace(/^\/+/, '')}` : null;

  return (
    <a href={href} className="whatsapp-bubble group inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      style={{ backgroundColor: color, '--wa-bottom': bubbleOffset(settings.offset_bottom, '24px'),
        '--wa-side': bubbleOffset(settings.offset_side, '24px'), [left ? 'left' : 'right']: 'var(--wa-side)' }}
      target={settings.open_in_new_tab ? '_blank' : undefined} rel="noopener noreferrer" aria-label={label} title={label}>
      {settings.show_pulse_animation && <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full opacity-20 motion-safe:animate-ping" style={{ backgroundColor: color }} />}
      {icon && !iconFailed ? <img src={icon} alt="" className="relative h-8 w-8 object-contain" onError={() => setIconFailed(true)} />
        : <MessageCircle aria-hidden="true" size={28} className="relative" />}
      {settings.show_online_badge && <span aria-hidden="true" className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />}
      <span aria-hidden="true" className={`pointer-events-none absolute whitespace-nowrap rounded-lg bg-on-surface px-3 py-2 text-xs text-surface opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${left ? 'left-16' : 'right-16'}`}>{label}</span>
    </a>
  );
}
