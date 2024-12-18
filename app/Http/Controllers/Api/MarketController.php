<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\MarketUpdates;
use Illuminate\Support\Facades\Log;

class MarketController extends Controller
{
    //
    public function get_market_updates()
    {
        $marketUpdates = MarketUpdates::select('*')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($marketUpdates);
    }

    public function get_specific_market_update($id)
    {
        $marketUpdate = MarketUpdates::find($id);
        return response()->json($marketUpdate);
    }

    public function add_market_update(Request $request)
    {
        try {
            $request->validate([
                'price_per_coconut_kg' => 'string|required',
                'volume_of_coconut' => 'string|required',
                'top_market' => 'string|required',
            ]);

            $marketUpdate = new MarketUpdates();
            $marketUpdate->price_per_coconut_kg =
                $request->price_per_coconut_kg;
            $marketUpdate->volume_of_coconut = $request->volume_of_coconut;
            $marketUpdate->top_market = $request->top_market;
            $marketUpdate->save();

            return response()->json(
                [
                    'message' => 'Market update added successfully',
                    'data' => $marketUpdate,
                ],
                201
            );
        } catch (\Exception $e) {
            Log::error('Market update failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return response()->json(
                [
                    'message' => 'An error occurred while adding market update',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
