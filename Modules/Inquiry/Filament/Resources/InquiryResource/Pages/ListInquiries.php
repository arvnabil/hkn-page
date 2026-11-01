<?php

namespace Modules\Inquiry\Filament\Resources\InquiryResource\Pages;

use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Modules\Inquiry\Filament\Resources\InquiryResource;

class ListInquiries extends ListRecords
{
    protected static string $resource = InquiryResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
