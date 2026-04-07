<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\RamassageController;
use App\Http\Controllers\UserController;

Route::apiResource('categories', CategoryController::class);



Route::resource("/user" , UserController::class);
Route::post('/login', [AuthController::class, 'login']);

Route::resource("comment" , CommentController::class);

Route::post('/api/send-mail', [UserController::class, 'sendMail']);