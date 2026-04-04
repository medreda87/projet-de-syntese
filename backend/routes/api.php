<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProviderController;


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

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'user']);
    Route::put('/update-role', [AuthController::class, 'updateRole']);
});

Route::apiResource('providers', ProviderController::class);
use App\Http\Controllers\LaundryController;
Route::get('/laundries', [LaundryController::class, 'index']);
Route::post('/laundries', [LaundryController::class, 'store']);

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;

Route::apiResource('categories', CategoryController::class);
use App\Http\Controllers\ProductController;
Route::apiResource('products', ProductController::class);
use App\Http\Controllers\ServiceController;
Route::apiResource('services', ServiceController::class);
use App\Http\Controllers\DeliveryController;
Route::apiResource('deliveries', DeliveryController::class);


Route::middleware('auth:sanctum')->apiResource('comment', CommentController::class);

use App\Http\Controllers\RamassageController;
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ramassages', [RamassageController::class, 'index']);
    Route::post('/ramassages', [RamassageController::class, 'store']);
    Route::get('/ramassages/{id}', [RamassageController::class, 'show']);
});
 