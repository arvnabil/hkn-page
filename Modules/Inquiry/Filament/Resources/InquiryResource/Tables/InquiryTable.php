<?php

namespace Modules\Inquiry\Filament\Resources\InquiryResource\Tables;

use Filament\Actions;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Modules\Inquiry\Models\Inquiry;

class InquiryTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nama Klien')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('company')
                    ->label('Perusahaan')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('room_type')
                    ->label('Tipe Ruang')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => Inquiry::roomTypeOptions()[$state] ?? $state)
                    ->color(fn (string $state): string => match ($state) {
                        'huddle'     => 'info',
                        'medium'     => 'warning',
                        'boardroom'  => 'success',
                        'auditorium' => 'primary',
                        default      => 'gray',
                    }),

                TextColumn::make('participant_count')
                    ->label('Peserta')
                    ->numeric()
                    ->sortable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => Inquiry::statusOptions()[$state] ?? $state)
                    ->color(fn (string $state): string => match ($state) {
                        'new'       => 'danger',
                        'in_review' => 'warning',
                        'contacted' => 'info',
                        'follow_up' => 'warning',
                        'closed'    => 'success',
                        default     => 'gray',
                    }),

                TextColumn::make('created_at')
                    ->label('Masuk')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options(Inquiry::statusOptions()),
            ])
            ->recordActions([
                Actions\ViewAction::make(),
                Actions\EditAction::make()->label('Ubah Status'),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
