<?php

namespace Modules\FormBuilder\Http\Controllers;

use Modules\FormBuilder\Models\FormSubmission;
use Modules\FormBuilder\Jobs\SendFormNotificationJob;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class FormSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'form_key' => 'required|string|max:100|not_in:inquiry',
            'section_id' => 'nullable|integer',
            // ... (rest of validation)
            'page_slug' => 'nullable|string',
            'fields' => 'required|array',
            'recaptcha_token' => 'nullable|string',
            'company_name' => 'nullable|string', // Honeypot
        ]);

        $decision = 'allow';
        $reason = null;
        $captchaScore = null;

        // 1. Honeypot Check (Priority 1)
        if (!empty($request->input('company_name'))) {
            $decision = 'block';
            $reason = 'honeypot_triggered';
        }

        $shouldVerifyCaptcha = false;

        // Check Smart Security Settings (Auto-Pilot)
        $securitySettings = DB::table('form_security_settings')
            ->where('form_key', $validated['form_key'])
            ->first();

        $autoManaged = $securitySettings ? $securitySettings->auto_managed : false;

        if ($decision === 'allow') {
            if ($autoManaged) {
                // Trust the Auto-Decision Engine
                $shouldVerifyCaptcha = $securitySettings->captcha_enabled;
            } else {
                // Fallback to Manual Builder Config
                if (!empty($validated['section_id'])) {
                    $section = \Modules\CMS\Models\PageSection::find($validated['section_id']);
                    if ($section && isset($section->config['enable_recaptcha']) && $section->config['enable_recaptcha']) {
                        $shouldVerifyCaptcha = true;
                    }
                } elseif (config('services.recaptcha.secret')) {
                    $shouldVerifyCaptcha = true; // Default to secure if global secret exists and no specific config
                }
            }
        }

        // 2. reCAPTCHA v3 Verification (Priority 2)
        if ($decision === 'allow' && $shouldVerifyCaptcha && config('services.recaptcha.secret')) {
             if (empty($validated['recaptcha_token'])) {
                 $decision = 'block';
                 $reason = 'captcha_token_missing';
             } else {
                // ... (verify logic)
                $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => config('services.recaptcha.secret'),
                    'response' => $validated['recaptcha_token'],
                    'remoteip' => $request->ip(),
                ]);

                $json = $response->json();
                $captchaScore = $json['score'] ?? null;

                if (!($json['success'] ?? false) || ($json['score'] ?? 0) < 0.5) {
                    $decision = 'block';
                    $reason = 'captcha_score_low';
                }
             }
        }

        // 3. Log Decision
        \DB::table('form_security_logs')->insert([
            'form_key' => $validated['form_key'],
            'page_slug' => $validated['page_slug'],
            'captcha_score' => $captchaScore,
            'decision' => $decision,
            'reason' => $reason,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($decision === 'block') {
             return response()->json([
                'success' => false,
                'message' => 'Security check failed. Please try again.',
            ], 422);
        }

        $submission = FormSubmission::create([
            'form_key' => $validated['form_key'],
            'page_slug' => $validated['page_slug'],
            'payload' => $validated['fields'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        dispatch(new SendFormNotificationJob($submission));

        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully.',
        ]);
    }

    public function trackView(Request $request)
    {
        $validated = $request->validate([
            'form_key' => 'required|string|max:100',
            'page_slug' => 'nullable|string|max:255',
        ]);

        $sessionKey = 'form_views.'.hash('sha256', $validated['form_key'].'|'.($validated['page_slug'] ?? ''));
        if ($request->session()->get($sessionKey, 0) > now()->subMinutes(30)->timestamp) {
            return response()->json(['success' => true]);
        }

        \DB::table('form_analytics')->insert([
            'form_key' => $validated['form_key'],
            'page_slug' => $validated['page_slug'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $request->session()->put($sessionKey, now()->timestamp);

        return response()->json(['success' => true]);
    }
}
