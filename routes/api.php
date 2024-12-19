<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarangayController;
use App\Http\Controllers\Api\FarmerController;
use App\Http\Controllers\Api\LandController;
use App\Http\Controllers\Api\MarketController;
use App\Http\Controllers\Api\ProgramController;
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
    Route::get('/{barangay_id}/farmers', [
        BarangayController::class,
        'get_list_of_farmers',
    ])->middleware('auth:sanctum');
});

Route::group(['prefix' => 'farmer'], function () {
    Route::post('/create', [
        FarmerController::class,
        'create_farmer',
    ])->middleware('auth:sanctum');

    Route::get('/all', [
        FarmerController::class,
        'get_farmers_with_details',
    ])->middleware('auth:sanctum');

    Route::delete('/delete/{farmer_id}', [
        FarmerController::class,
        'delete_farmer',
    ])->middleware('auth:sanctum');
});

Route::group(['prefix' => 'land'], function () {
    Route::post('/create', [LandController::class, 'create_land'])->middleware(
        'auth:sanctum'
    );
});

Route::group(['prefix' => 'market'], function () {
    Route::get('/all', [MarketController::class, 'get_market_updates']);
    Route::get('/{id}', [
        MarketController::class,
        'get_specific_market_update',
    ])->middleware('auth:sanctum');
    Route::post('/add', [
        MarketController::class,
        'add_market_update',
    ])->middleware('auth:sanctum');
});

Route::group(['prefix' => 'program'], function () {
    Route::get('/all', [ProgramController::class, 'index'])->middleware(
        'auth:sanctum'
    );
    Route::post('/create', [
        ProgramController::class,
        'create_program',
    ])->middleware('auth:sanctum');
    Route::get('/specific_program/{admin_id}', [
        ProgramController::class,
        'get_programs_created_by_admin',
    ])->middleware('auth:sanctum');
    Route::delete('/delete/{program_id}', [
        ProgramController::class,
        'delete_program',
    ])->middleware('auth:sanctum');
});
