<?php

namespace Modules\WhatsApp\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use Modules\Analytics\Jobs\ResolveGeoLocation;
use Modules\Analytics\Models\AnalyticsClickEvent;
use Modules\WhatsApp\Models\WhatsAppSetting;

class WhatsAppController extends Controller
{
    public function redirect(Request $request)
    {
        $data = $request->validate([
            'text' => 'nullable|string|max:4000',
            'utm_source' => 'nullable|string|max:255', 'utm_medium' => 'nullable|string|max:255',
            'utm_campaign' => 'nullable|string|max:255', 'utm_content' => 'nullable|string|max:255',
            'utm_term' => 'nullable|string|max:255', 'cta_position' => 'nullable|string|max:255',
            'cta_label' => 'nullable|string|max:255', 'page_route' => 'nullable|string|max:2048',
            'entity_type' => 'nullable|string|max:255', 'entity_slug' => 'nullable|string|max:255',
            'entity_id' => 'nullable|integer|min:1',
        ]);

        // Every CTA uses this one setting; a URL cannot override the destination.
        $number = preg_replace('/[^0-9]/', '', (string) WhatsAppSetting::query()->value('phone'));
        if (str_starts_with($number, '0')) $number = '62'.substr($number, 1);
        if (!preg_match('/^[1-9][0-9]{7,14}$/', $number)) {
            return response('Nomor WhatsApp belum dikonfigurasi dengan benar.', 503);
        }

        $text = $data['text'] ?? 'Halo Harry, saya ingin bertanya mengenai solusi AVer.';
        $sessionId = $request->session()->get('analytics_session_id', (string) Str::uuid());
        $request->session()->put('analytics_session_id', $sessionId);
        $userAgent = (string) $request->userAgent();
        $isBot = (bool) preg_match('/bot|crawl|slurp|spider|mediapartners/i', $userAgent);
        $device = preg_match('/mobile|android|iphone|ipad|phone/i', $userAgent) ? 'mobile' : 'desktop';
        $referrer = $request->header('referer');
        $pagePath = parse_url($data['page_route'] ?? $referrer ?? '/', PHP_URL_PATH) ?: '/';
        if (!str_starts_with($pagePath, '/')) $pagePath = '/';

        // Resolve only known model types. Click Events eager-loads this morph relation.
        $models = [
            'product' => \Modules\ProductCatalog\Models\Product::class,
            'article' => \Modules\News\Models\News::class,
            'news' => \Modules\News\Models\News::class,
            'brand' => \Modules\ProductCatalog\Models\Brand::class,
            'page' => \Modules\CMS\Models\Page::class,
        ];
        $entity = null;
        $entityClass = $models[$data['entity_type'] ?? ''] ?? null;
        if ($entityClass && (!empty($data['entity_id']) || !empty($data['entity_slug']))) {
            $entity = $entityClass::query()
                ->when(!empty($data['entity_id']), fn ($query) => $query->whereKey($data['entity_id']))
                ->when(!empty($data['entity_slug']), fn ($query) => $query->where('slug', $data['entity_slug']))
                ->first();
        }

        $context = [
            'session_id' => $sessionId, 'event_type' => 'whatsapp', 'target_value' => $number,
            'utm_source' => $data['utm_source'] ?? 'website',
            'utm_medium' => $data['utm_medium'] ?? 'whatsapp',
            'utm_campaign' => $data['utm_campaign'] ?? 'website_contact',
            'utm_content' => $data['utm_content'] ?? $data['cta_position'] ?? 'direct',
            'utm_term' => $data['utm_term'] ?? null,
            'cta_position' => $data['cta_position'] ?? 'direct',
            'entity_type' => $entity?->getMorphClass(), 'entity_id' => $entity?->getKey(),
            'entity_slug' => $data['entity_slug'] ?? $entity?->slug,
            'page_url' => $pagePath, 'is_bot' => $isBot,
        ];
        $query = AnalyticsClickEvent::query()->where('created_at', '>=', now()->subHour());
        foreach ($context as $key => $value) $query->where($key, $value);
        $existing = !$isBot ? $query->first() : null;
        if ($existing) {
            $existing->increment('click_count');
            if (!$existing->referrer_url || str_contains($existing->referrer_url, '/activioncms')) {
                $existing->update(['referrer_url' => $referrer ?: $pagePath]);
            }
        } else {
            $event = AnalyticsClickEvent::create($context + [
                'event_label' => $data['cta_label'] ?? 'Konsultasi WhatsApp',
                'ip_address' => $request->ip(), 'user_agent' => $userAgent,
                'device' => $device, 'referrer_url' => $referrer ?: $pagePath,
                'meta' => ['message' => $text, 'entity_kind' => $data['entity_type'] ?? null],
            ]);
            if (!$isBot && filter_var($request->ip(), FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                ResolveGeoLocation::dispatch($event);
            }
        }

        return redirect()->away('https://wa.me/'.$number.'?'.http_build_query(['text' => $text], '', '&', PHP_QUERY_RFC3986));
    }
}
