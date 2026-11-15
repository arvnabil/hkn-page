<?php

namespace Modules\FormBuilder\Filament\Resources\FormSubmissionResource\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FormSubmissionTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Submitted At'),
                TextColumn::make('form_key')
                    ->formatStateUsing(fn (string $state) => $state === 'inquiry' ? 'Penawaran' : $state)
                    ->searchable()
                    ->sortable(),
                TextColumn::make('page_slug')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('payload.name')->label('Nama'),
                TextColumn::make('payload.company')->label('Perusahaan'),
                TextColumn::make('inquiry.status')->label('Status penawaran')->badge(),
                TextColumn::make('ip_address')
                    ->label('IP')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                \Filament\Actions\Action::make('inquiry')
                    ->label('Buka penawaran')
                    ->visible(fn ($record) => filled($record->inquiry_id))
                    ->url(fn ($record) => \Modules\Inquiry\Filament\Resources\InquiryResource::getUrl('view', ['record' => $record->inquiry_id], panel: 'activioncms')),
                ViewAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
