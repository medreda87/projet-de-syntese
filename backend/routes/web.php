<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LaundryController;

Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);

Route::get('/laundry', [LaundryController::class, 'index']);
Route::post('/laundry', [LaundryController::class, 'store']);