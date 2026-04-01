<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


use App\Http\Controllers\ProviderController;
Route::apiResource('providers', ProviderController::class);
use App\Http\Controllers\LaundryController;
Route::apiResource('laundries', LaundryController::class);
use App\Http\Controllers\CategoryController;
Route::apiResource('categories', CategoryController::class);
use App\Http\Controllers\ProductController;
Route::apiResource('products', ProductController::class);
use App\Http\Controllers\ServiceController;
Route::apiResource('services', ServiceController::class);
use App\Http\Controllers\DeliveryController;
Route::apiResource('deliveries', DeliveryController::class);
