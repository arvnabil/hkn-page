<?php

use Illuminate\Support\Facades\Route;
use Modules\News\Http\Controllers\Api\NewsApiController;

Route::group(['prefix' => 'news'], function () {
    // Public routes (Read-only)
    Route::get('/', [NewsApiController::class, 'index']);
    Route::get('/{slug}', [NewsApiController::class, 'show']);

    // Protected routes
    Route::group(['middleware' => 'auth:api'], function () {
        Route::post('/import', [NewsApiController::class, 'import']);
    });

    // Protected image downloader/uploader for mirroring news images locally.
    Route::post('/sync-image', \Modules\News\Http\Controllers\Api\NewsImageSyncController::class)
        ->middleware(\App\Http\Middleware\VerifyApiKey::class);
});
