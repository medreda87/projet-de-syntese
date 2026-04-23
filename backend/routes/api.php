<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
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
Route::post('/send-verification-code', [AuthController::class, 'sendCode']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'user']);
    Route::put('/update-role', [AuthController::class, 'updateRole']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
});

Route::apiResource('providers', ProviderController::class);
use App\Http\Controllers\LaundryController;
Route::get('/laundries', [LaundryController::class, 'index']);
Route::get('/laundries/filters', [LaundryController::class, 'filters']);
Route::get('/laundries/{id}', [LaundryController::class, 'show']);
Route::post('/laundries', [LaundryController::class, 'store']);
Route::post('/laundries/{id}', [LaundryController::class, 'update']);

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;

Route::apiResource('categories', CategoryController::class);
use App\Http\Controllers\ProductController;
Route::get('/products/laundry/{id}', [ProductController::class, 'getByLaundry']);
Route::apiResource('products', ProductController::class);
use App\Http\Controllers\ServiceController;
Route::apiResource('services', ServiceController::class);
Route::get('/services/laundry/{id}', [ServiceController::class, 'getByLaundry']);
use App\Http\Controllers\DeliveryController;
Route::apiResource('deliveries', DeliveryController::class);


Route::middleware('auth:sanctum')->apiResource('comment', CommentController::class);
Route::get('/comments/laundry/{laundryId}', [CommentController::class, 'byLaundry']);

use App\Http\Controllers\RamassageController;
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ramassages', [RamassageController::class, 'index']);
    Route::get('/ramassages/check/{laundryId}', [RamassageController::class, 'checkForLaundry']);
    Route::get('/ramassages/laundry/{laundryId}', [RamassageController::class, 'getByLaundry']);
    Route::get('/ramassages/{id}', [RamassageController::class, 'show']);
    Route::put('/ramassages/{id}/status', [RamassageController::class, 'updateStatus']);
    Route::delete('/ramassages/{id}', [RamassageController::class, 'destroy']);
});
Route::post('/ramassages', [RamassageController::class, 'store']);

Route::get('/laundries/user/{userId}', [LaundryController::class, 'getLaundriesByUser']);

/* ─── ADMIN ─────────────────────────────────── */
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/stats',                   [AdminController::class, 'stats']);
    // Users
    Route::get('/users',                    [AdminController::class, 'users']);
    Route::get('/users/{id}',               [AdminController::class, 'showUser']);
    Route::put('/users/{id}',               [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}',            [AdminController::class, 'deleteUser']);
    // Laundries
    Route::get('/laundries',                [AdminController::class, 'laundries']);
    Route::post('/laundries/{id}/approve',  [AdminController::class, 'approveLaundry']);
    Route::post('/laundries/{id}/reject',   [AdminController::class, 'rejectLaundry']);
    Route::delete('/laundries/{id}',        [AdminController::class, 'deleteLaundry']);
    // Comments / messages
    Route::get('/comments',                 [AdminController::class, 'comments']);
    Route::delete('/comments/{id}',         [AdminController::class, 'deleteComment']);
});