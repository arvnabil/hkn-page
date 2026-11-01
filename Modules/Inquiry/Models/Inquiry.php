<?php

namespace Modules\Inquiry\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $table = 'inquiries';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'room_type',
        'participant_count',
        'current_platform',
        'budget_range',
        'notes',
        'status',
        'admin_notes',
        'ip_address',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'new',
    ];

    /**
     * Room type options.
     */
    public static function roomTypeOptions(): array
    {
        return [
            'huddle'     => 'Huddle Room',
            'medium'     => 'Medium Room',
            'boardroom'  => 'Boardroom',
            'auditorium' => 'Auditorium',
        ];
    }

    /**
     * Current platform options.
     */
    public static function platformOptions(): array
    {
        return [
            'teams' => 'Microsoft Teams',
            'zoom'  => 'Zoom',
            'meet'  => 'Google Meet',
            'other' => 'Other',
        ];
    }

    /**
     * Status options.
     */
    public static function statusOptions(): array
    {
        return [
            'new'        => 'New',
            'in_review'  => 'In Review',
            'contacted'  => 'Contacted',
            'follow_up'  => 'Follow Up',
            'closed'     => 'Closed',
        ];
    }
}
