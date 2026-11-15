<?php

use Illuminate\Support\Facades\Route;
use Modules\Inquiry\Http\Controllers\InquiryController;

Route::post('/penawaran', [InquiryController::class, 'store'])->name('inquiry.store')->middleware('throttle:10,1');
