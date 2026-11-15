<?php

namespace Modules\ProductCatalog\Filament\Resources\ProductResource\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TagsInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Modules\SEO\Filament\Resources\SeoMetaResource\Schemas\SeoForm;
use Illuminate\Support\Str;

class ProductForm
{
    public static function schema(): array
    {
        return [
            Tabs::make('ProductTabs')
                ->tabs([
                    Tab::make('Product Details')
                        ->schema([
                            Group::make()
                                ->schema([
                                    Section::make('Basic Information')
                                        ->schema([
                                            TextInput::make('name')
                                                ->required()
                                                ->maxLength(255)
                                                ->live(onBlur: true)
                                                ->afterStateUpdated(function (Set $set, ?string $state, string $operation): void {
                                                    if ($operation === 'create') {
                                                        $set('slug', Str::slug($state));
                                                    }
                                                }),
                                            TextInput::make('slug')
                                                ->required()
                                                ->maxLength(255)
                                                ->unique(ignoreRecord: true),
                                            TextInput::make('sku')
                                                ->label('SKU'),
                                            Select::make('brand_id')
                                                ->relationship('brand', 'name')
                                                ->required()
                                                ->searchable()
                                                ->preload(),
                                            Select::make('categories')
                                                ->relationship('categories', 'name')
                                                ->label('Device Categories')
                                                ->multiple()
                                                ->searchable()
                                                ->preload()
                                                ->createOptionForm(\Modules\ProductCatalog\Filament\Resources\ProductCategoryResource\Schemas\ProductCategoryForm::schema()),
                                            TextInput::make('price')
                                                ->numeric()
                                                ->minValue(0)
                                                ->prefix('IDR'),
                                            TextInput::make('datasheet_url')
                                                ->url(),
                                            Textarea::make('short_description')
                                                ->label('Ringkasan produk')
                                                ->rows(3)
                                                ->maxLength(240)
                                                ->columnSpanFull()
                                                ->helperText('Dipakai pada kartu dan pembuka halaman detail. Deskripsi lengkap ditulis di bawah.'),
                                            Toggle::make('edit_description_html')
                                                ->label('⚡ Mode HTML / Code Editor')
                                                ->live()
                                                ->dehydrated(false)
                                                ->columnSpanFull()
                                                ->afterStateUpdated(function (Get $get, Set $set, $state) {
                                                    if ($state) {
                                                        $set('description_html', $get('description'));
                                                    } else {
                                                        $set('description', $get('description_html'));
                                                    }
                                                }),

                                            RichEditor::make('description')
                                                ->columnSpanFull()
                                                ->visible(fn (Get $get) => ! $get('edit_description_html'))
                                                ->fileAttachmentsAcceptedFileTypes(['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'])
                                                ->fileAttachmentsMaxSize(2048)
                                                ->fileAttachmentsDisk('public')
                                                ->fileAttachmentsDirectory(fn ($get) => 'products/' . ($get('slug') ?? 'default') . '/media-descriptions')
                                                ->fileAttachmentsVisibility('public'),

                                            Textarea::make('description_html')
                                                ->label('Description (HTML Code)')
                                                ->columnSpanFull()
                                                ->visible(fn (Get $get) => (bool) $get('edit_description_html'))
                                                ->rows(15)
                                                ->extraInputAttributes(['style' => 'font-family: monospace; font-size: 14px; line-height: 1.5;'])
                                                ->live(onBlur: true)
                                                ->afterStateUpdated(fn (Set $set, $state) => $set('description', $state))
                                                ->dehydrated(false),
                                               
                                        ])->columns(2),

                                    Section::make('Ringkasan spesifikasi')
                                        ->description('Field ini mengisi badge, kartu produk, perbandingan, dan ringkasan halaman detail.')
                                        ->schema([
                                            TextInput::make('specs.badge')->label('Badge produk')->maxLength(60),
                                            TextInput::make('specs.categoryLabel')->label('Label kategori (opsional)')->helperText('Jika kosong, mengikuti kategori produk.'),
                                            TextInput::make('specs.zoom')->label('Zoom'),
                                            TextInput::make('specs.resolution')->label('Resolusi'),
                                            TextInput::make('specs.fov')->label('Field of view / FOV'),
                                            TextInput::make('specs.roomSize')->label('Ukuran / kapasitas ruangan'),
                                            TextInput::make('specs.warranty')->label('Informasi garansi'),
                                            Textarea::make('specs.bestFor')->label('Rekomendasi penggunaan')->rows(2),
                                            TagsInput::make('specs.certifications')->label('Sertifikasi')->columnSpanFull(),
                                        ])->columns(2),

                                    Section::make('Specifications & Features')
                                        ->schema([
                                            TagsInput::make('tags'),
                                            \Filament\Forms\Components\Repeater::make('specs.technical')
                                                ->label('Specifications (Grouped)')
                                                ->schema([
                                                    TextInput::make('group_name')
                                                        ->label('Group Name')
                                                        ->required()
                                                        ->placeholder('e.g. Dimensions, Audio, etc.'),
                                                    \Filament\Forms\Components\Repeater::make('items')
                                                        ->label('Items')
                                                        ->schema([
                                                            TextInput::make('key')->required(),
                                                            TextInput::make('value')->required(),
                                                        ])
                                                        ->columns(2)
                                                        ->defaultItems(0)
                                                        ->cloneable()
                                                        ->collapsible()
                                                        ->required(),
                                                ])
                                                ->itemLabel(fn (array $state): ?string => $state['group_name'] ?? null)
                                                ->collapsible()
                                                ->cloneable()
                                                ->columns(2)
                                                ->columnSpanFull(),
                                            \Filament\Forms\Components\Repeater::make('features')
                                                ->schema([
                                                    TextInput::make('name')->required(),
                                                    TextInput::make('value')->label('Description'),
                                                    TextInput::make('additional')->label('Additional Info'),
                                                ])
                                                ->columns(3),
                                            RichEditor::make('specification_text')
                                                ->label('Catatan spesifikasi tambahan (opsional)')
                                                ->helperText('Untuk penjelasan di luar tabel spesifikasi; hindari mengulang isi ringkasan.')
                                                ->columnSpanFull()
                                                ->fileAttachmentsAcceptedFileTypes(['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'])
                                                ->fileAttachmentsMaxSize(2048)
                                                ->fileAttachmentsDisk('public')
                                                ->fileAttachmentsDirectory(fn ($get) => 'products/' . ($get('slug') ?? 'default') . '/media-specifications')
                                                ->fileAttachmentsVisibility('public'),
                                                
                                            RichEditor::make('features_text')
                                                ->label('Penjelasan fitur tambahan (opsional)')
                                                ->helperText('Untuk uraian panjang; fitur singkat cukup diisi pada daftar Features.')
                                                ->columnSpanFull()
                                                ->fileAttachmentsAcceptedFileTypes(['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'])
                                                ->fileAttachmentsMaxSize(2048)
                                                ->fileAttachmentsDisk('public')
                                                ->fileAttachmentsDirectory(fn ($get) => 'products/' . ($get('slug') ?? 'default') . '/media-features')
                                                ->fileAttachmentsVisibility('public'),
                                        ]),

                                    Section::make('Marketplace Links')
                                        ->schema([
                                            TextInput::make('link_accommerce')->label('Online Purchase Link (Acommerce)')->url(),
                                            Textarea::make('whatsapp_note')
                                                ->label('WhatsApp Message Note')
                                                ->rows(3)
                                                ->placeholder('e.g. Halo, saya tertarik dengan produk ini...')
                                                ->helperText('Pesan khusus tombol konsultasi produk. Nomor mengikuti pengaturan WhatsApp.'),
                                        ])->columns(1),
                                ])->columnSpan(['lg' => 2]),

                            Group::make()
                                ->schema([
                                    Section::make('Gambar produk')
                                        ->description('File disimpan otomatis ke storage lokal; database menyimpan path gambar.')
                                        ->schema([
                                            FileUpload::make('image_path')
                                                ->label('Product Main Image')
                                                ->image()
                                                ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                                                ->disk('public')
                                                ->visibility('public')
                                                ->maxSize(2048)
                                                ->downloadable()
                                                ->openable()
                                                ->helperText('Nama file akan otomatis disesuaikan (Contoh: nama-produk.png). Ukuran maks: 2MB.')
                                                ->getUploadedFileNameForStorageUsing(function (\Livewire\Features\SupportFileUploads\TemporaryUploadedFile $file, Get $get): string {
                                                    $slug = $get('slug') ?: 'temp';
                                                    return \App\Helpers\UploadHelper::getSluggedFilename($file, 'products/' . $slug);
                                                }),
                                            FileUpload::make('image_paths')
                                                ->label('Galeri tambahan')
                                                ->image()
                                                ->multiple()
                                                ->reorderable()
                                                ->appendFiles()
                                                ->maxFiles(10)
                                                ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                                                ->disk('public')
                                                ->directory(fn (Get $get) => 'products/' . (Str::slug($get('slug') ?: 'draft')) . '/gallery')
                                                ->visibility('public')
                                                ->maxSize(2048)
                                                ->downloadable()
                                                ->openable()
                                                ->helperText('Maksimal 10 gambar tambahan, 2 MB per file (JPG, PNG, WebP). Geser untuk mengubah urutan. Gambar utama selalu tampil pertama.'),
                                        ]),
                                            Section::make('Status')
                                         ->schema([
                                             Toggle::make('is_active')
                                                 ->required()
                                                 ->default(true),
                                             Toggle::make('is_featured')
                                                 ->label('Featured Product')
                                                 ->default(false),
                                             Toggle::make('is_new')
                                                 ->label('New Arrival')
                                                 ->default(false),
                                         ]),
                                ])->columnSpan(['lg' => 1]),
                        ])
                        ->columns(3),

                    Tab::make('SEO')
                        ->schema([
                             Group::make()
                                ->relationship('seo')
                                ->schema(SeoForm::schema())
                        ]),
                    Tab::make('Breadcrumb')
                        ->schema(\Modules\CMS\Filament\Schemas\BreadcrumbForm::schema('products')),
                ])
                ->columnSpanFull()
        ];
    }
}
