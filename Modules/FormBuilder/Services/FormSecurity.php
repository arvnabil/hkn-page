<?php

namespace Modules\FormBuilder\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Modules\Settings\Models\Setting;
use Throwable;

class FormSecurity
{
    public function configuration(string $formKey): array
    {
        $settings = DB::table('form_security_settings')->where('form_key', $formKey)->first();
        $siteKey = Setting::getValue('recaptcha_site_key') ?: config('services.recaptcha.key');
        $secret = config('services.recaptcha.secret') ?: Setting::getValue('recaptcha_secret_key');

        return [
            'captcha_enabled' => $settings ? (bool) $settings->captcha_enabled : (bool) ($siteKey || $secret),
            'configured' => filled($siteKey) && filled($secret),
            'auto_managed' => (bool) ($settings?->auto_managed ?? false),
            'site_key' => $siteKey,
            'secret' => $secret,
        ];
    }

    public function publicConfiguration(string $formKey): array
    {
        $config = $this->configuration($formKey);

        return [
            'captcha_enabled' => $config['captcha_enabled'],
            'site_key' => $config['site_key'],
        ];
    }

    public function evaluate(Request $request, string $formKey): array
    {
        $result = ['decision' => 'allow', 'reason' => null, 'captcha_score' => null];
        if (filled($request->input('website'))) {
            return array_replace($result, ['decision' => 'block', 'reason' => 'honeypot_triggered']);
        }

        $config = $this->configuration($formKey);
        if (! $config['captcha_enabled']) return $result;
        if (! $config['configured']) {
            return array_replace($result, ['decision' => 'block', 'reason' => 'captcha_not_configured']);
        }
        if (! $request->filled('recaptcha_token')) {
            return array_replace($result, ['decision' => 'block', 'reason' => 'captcha_token_missing']);
        }

        try {
            $response = Http::connectTimeout(3)->timeout(8)->asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $config['secret'],
                'response' => $request->input('recaptcha_token'),
                'remoteip' => $request->ip(),
            ])->throw();
            $data = $response->json();
            $result['captcha_score'] = isset($data['score']) ? (float) $data['score'] : null;
            if (! ($data['success'] ?? false) || ($data['score'] ?? 0) < 0.5
                || ($data['action'] ?? '') !== 'penawaran' || ($data['hostname'] ?? '') !== $request->getHost()) {
                return array_replace($result, ['decision' => 'block', 'reason' => 'captcha_verification_failed']);
            }
        } catch (Throwable) {
            return array_replace($result, ['decision' => 'block', 'reason' => 'captcha_unavailable']);
        }

        return $result;
    }

    public function log(Request $request, string $formKey, string $pageSlug, array $result): void
    {
        DB::table('form_security_logs')->insert($result + [
            'form_key' => $formKey, 'page_slug' => $pageSlug,
            'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }
}
