<?php

namespace Modules\ProductCatalog\Support;

use App\Helpers\JsonHelper;
use Illuminate\Support\Arr;

class ProductContent
{
    public const SUMMARY_KEYS = ['roomSize', 'zoom', 'resolution', 'fov', 'bestFor', 'warranty', 'badge', 'categoryLabel', 'certifications'];

    public static function forForm(array $data): array
    {
        $specs = $data['specs'] ?? [];
        $technical = $specs['technical'] ?? Arr::except($specs, self::SUMMARY_KEYS);
        $data['specs'] = Arr::only($specs, self::SUMMARY_KEYS);
        $data['specs']['technical'] = JsonHelper::toRepeater($technical);
        $data['features'] = array_map(fn ($feature) => is_string($feature)
            ? ['name' => $feature, 'value' => '', 'additional' => '']
            : $feature, $data['features'] ?? []);

        return $data;
    }

    public static function forStorage(array $data): array
    {
        $data['specs']['technical'] = JsonHelper::fromRepeater($data['specs']['technical'] ?? []);

        return $data;
    }

    public static function featureText(mixed $feature): string
    {
        return is_array($feature)
            ? implode(' — ', array_filter(Arr::only($feature, ['name', 'value', 'additional']), fn ($value) => is_scalar($value) && (string) $value !== ''))
            : (is_scalar($feature) ? (string) $feature : '');
    }
}
