<?php

namespace Modules\Inquiry\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Inquiry\Models\Inquiry;

class InquiryController extends Controller
{
    /**
     * Handle the submission of a public AVer solution inquiry form.
     */
    public function store(Request $request): RedirectResponse
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
        ]);

        Inquiry::create($validated);

        return redirect()->back()->with(
            'success',
            'Terima kasih! Penawaran Anda telah kami terima. Tim Harry AVer Solutions Advisor akan segera menghubungi Anda.'
        );
    }
}
