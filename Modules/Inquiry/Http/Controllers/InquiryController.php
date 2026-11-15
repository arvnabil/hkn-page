<?php

namespace Modules\Inquiry\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Inquiry\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Modules\FormBuilder\Models\FormSubmission;
use Modules\FormBuilder\Services\FormSecurity;
use Illuminate\Validation\ValidationException;

class InquiryController extends Controller
{
    /**
     * Handle the submission of a public AVer solution inquiry form.
     */
    public function store(Request $request, FormSecurity $security): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255'],
            'phone'            => ['required', 'string', 'max:50'],
            'company'          => ['required', 'string', 'max:255'],
            'room_type'        => ['required', 'in:huddle,medium,boardroom,auditorium'],
            'participant_count'=> ['nullable', 'integer', 'min:1'],
            'current_platform' => ['nullable', 'in:teams,zoom,meet,other'],
            'budget_range'     => ['nullable', 'string', 'max:100'],
            'notes'            => ['nullable', 'string', 'max:5000'],
            'website'          => ['nullable', 'string', 'max:500'],
            'page_slug'        => ['nullable', 'string', 'max:255', 'regex:~^/[^?#]*$~'],
            'recaptcha_token'  => ['nullable', 'string', 'max:4096'],
        ]);

        $pageSlug = $validated['page_slug'] ?? '/penawaran';
        $decision = $security->evaluate($request, 'inquiry');
        if ($decision['decision'] === 'block') {
            $security->log($request, 'inquiry', $pageSlug, $decision);
            throw ValidationException::withMessages(['security' => 'Verifikasi keamanan gagal. Silakan coba lagi atau hubungi kami melalui WhatsApp.']);
        }

        $fields = Arr::except($validated, ['website', 'page_slug', 'recaptcha_token']);
        $inquiry = DB::transaction(function () use ($fields, $request, $pageSlug, $security, $decision) {
            $inquiry = Inquiry::create($fields + ['ip_address' => $request->ip()]);
            FormSubmission::create([
                'inquiry_id' => $inquiry->id, 'form_key' => 'inquiry', 'page_slug' => $pageSlug,
                'payload' => $fields, 'ip_address' => $request->ip(),
                'user_agent' => mb_substr($request->userAgent() ?? '', 0, 255),
            ]);
            $security->log($request, 'inquiry', $pageSlug, $decision);

            return $inquiry;
        });

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Permintaan penawaran berhasil disimpan.', 'inquiry_id' => $inquiry->id], 201);
        }

        return redirect()->back()->with(
            'success',
            'Terima kasih! Penawaran Anda telah kami terima. Tim Harry AVer Solutions Advisor akan segera menghubungi Anda.'
        );
    }
}
