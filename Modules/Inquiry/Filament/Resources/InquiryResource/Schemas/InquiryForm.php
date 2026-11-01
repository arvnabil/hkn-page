<?php

namespace Modules\Inquiry\Filament\Resources\InquiryResource\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Modules\Inquiry\Models\Inquiry;

class InquiryForm
{
    public static function schema(): array
    {
        return [
            Section::make('Identitas Klien')
                ->icon('heroicon-o-user-circle')
                ->columns(2)
                ->schema([
                    TextInput::make('name')
                        ->label('Nama Lengkap')
                        ->readOnly()
                        ->columnSpan(1),

                    TextInput::make('email')
                        ->label('Email')
                        ->readOnly()
                        ->columnSpan(1),

                    TextInput::make('phone')
                        ->label('Nomor Telepon')
                        ->readOnly()
                        ->columnSpan(1),

                    TextInput::make('company')
                        ->label('Perusahaan / Institusi')
                        ->readOnly()
                        ->columnSpan(1),
                ]),

            Section::make('Detail Kebutuhan Ruang AVer')
                ->icon('heroicon-o-building-office-2')
                ->columns(2)
                ->schema([
                    Select::make('room_type')
                        ->label('Tipe Ruang')
                        ->options(Inquiry::roomTypeOptions())
                        ->disabled()
                        ->columnSpan(1),

                    TextInput::make('participant_count')
                        ->label('Jumlah Peserta')
                        ->numeric()
                        ->readOnly()
                        ->columnSpan(1),

                    Select::make('current_platform')
                        ->label('Platform Saat Ini')
                        ->options(Inquiry::platformOptions())
                        ->disabled()
                        ->columnSpan(1),

                    TextInput::make('budget_range')
                        ->label('Kisaran Anggaran')
                        ->readOnly()
                        ->columnSpan(1),
                ]),

            Section::make('Catatan Klien')
                ->icon('heroicon-o-chat-bubble-left-ellipsis')
                ->schema([
                    Textarea::make('notes')
                        ->label('Catatan / Kebutuhan Tambahan')
                        ->readOnly()
                        ->rows(4)
                        ->columnSpanFull(),
                ]),

            Section::make('Status & Tindak Lanjut (Internal Harry)')
                ->icon('heroicon-o-clipboard-document-check')
                ->columns(1)
                ->schema([
                    Select::make('status')
                        ->label('Status Penawaran')
                        ->options(Inquiry::statusOptions())
                        ->required()
                        ->native(false),

                    Textarea::make('admin_notes')
                        ->label('Catatan Internal')
                        ->placeholder('Tambahkan catatan tindak lanjut, hasil kontak, dll...')
                        ->rows(4)
                        ->columnSpanFull(),
                ]),
        ];
    }
}
