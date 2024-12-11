<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarangayController;
use App\Http\Controllers\Api\FarmerController;
use App\Http\Controllers\Api\LandController;
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

Route::group(['prefix' => 'auth'], function () {
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware(
        'auth:sanctum'
    );
});

Route::group(['prefix' => 'barangay'], function () {
    Route::get('/all', [BarangayController::class, 'index'])->middleware(
        'auth:sanctum'
    );
});

Route::group(['prefix' => 'farmer'], function () {
    Route::post('/create', [
        FarmerController::class,
        'create_farmer',
    ])->middleware('auth:sanctum');
});

Route::group(['prefix' => 'land'], function () {
    Route::post('/create', [LandController::class, 'create_land'])->middleware(
        'auth:sanctum'
    );
});
