<?php

namespace Modules\Inquiry\Filament\Resources;

use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Modules\Inquiry\Filament\Resources\InquiryResource\Pages\EditInquiry;
use Modules\Inquiry\Filament\Resources\InquiryResource\Pages\ListInquiries;
use Modules\Inquiry\Filament\Resources\InquiryResource\Pages\ViewInquiry;
use Modules\Inquiry\Filament\Resources\InquiryResource\Schemas\InquiryForm;
use Modules\Inquiry\Filament\Resources\InquiryResource\Tables\InquiryTable;
use Modules\Inquiry\Models\Inquiry;
use Filament\Tables\Table;

class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-inbox-arrow-down';

    protected static ?string $navigationLabel = 'Penawaran Masuk';

    protected static string | \UnitEnum | null $navigationGroup = 'Leads & Inquiries';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Penawaran';

    protected static ?string $pluralModelLabel = 'Penawaran Masuk';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canAccess(): bool
    {
        $user = auth()->user();

        if (! $user) {
            return false;
        }

        if (method_exists($user, 'hasRole') && $user->hasRole('administrator')) {
            return true;
        }

        if (method_exists($user, 'can') && $user->can('view_any_inquiry')) {
            return true;
        }

        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components(InquiryForm::schema());
    }

    public static function table(Table $table): Table
    {
        return InquiryTable::table($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListInquiries::route('/'),
            'view'   => ViewInquiry::route('/{record}'),
            'edit'   => EditInquiry::route('/{record}/edit'),
        ];
    }
}
