<?php

namespace Modules\Inquiry\Filament\Resources\InquiryResource\Pages;

use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Modules\Inquiry\Filament\Resources\InquiryResource;

class ViewInquiry extends ViewRecord
{
    protected static string $resource = InquiryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make()->label('Ubah Status'),
        ];
    }
}
