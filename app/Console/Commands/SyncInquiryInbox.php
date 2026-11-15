<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Modules\FormBuilder\Models\FormSubmission;
use Modules\Inquiry\Models\Inquiry;

class SyncInquiryInbox extends Command
{
    protected $signature = 'forms:sync-inquiries';
    protected $description = 'Hubungkan penawaran lama ke Form Inbox tanpa membuat ulang lead atau statistik';

    public function handle(): int
    {
        $added = 0;
        foreach (Inquiry::query()->orderBy('id')->cursor() as $inquiry) {
            if (FormSubmission::where('inquiry_id', $inquiry->id)->exists()) continue;
            $submission = new FormSubmission([
                'inquiry_id' => $inquiry->id, 'form_key' => 'inquiry', 'page_slug' => '/penawaran',
                'payload' => Arr::only($inquiry->toArray(), ['name', 'email', 'phone', 'company', 'room_type', 'participant_count', 'current_platform', 'budget_range', 'notes']),
                'ip_address' => $inquiry->ip_address,
            ]);
            $submission->created_at = $inquiry->created_at;
            $submission->updated_at = $inquiry->updated_at;
            $submission->save();
            $added++;
        }
        $this->info($added.' penawaran lama dihubungkan ke Form Inbox.');

        return self::SUCCESS;
    }
}
