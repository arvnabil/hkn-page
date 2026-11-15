<?php

namespace Modules\ProductCatalog\Filament\Resources\ProductResource\Pages;

use Modules\ProductCatalog\Filament\Resources\ProductResource;
use Filament\Resources\Pages\EditRecord;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        return \Modules\ProductCatalog\Support\ProductContent::forForm($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return \Modules\ProductCatalog\Support\ProductContent::forStorage($data);
    }
}
