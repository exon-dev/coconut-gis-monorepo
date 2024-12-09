<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Land;

class LandController extends Controller
{
    //
    public function create_land(Request $request)
    {
        try {
            $request->validate([
                'is_affected' => 'required|boolean',
                'land_location' => 'required|string',
                'farmer_id' => 'required|integer',
                'barangay_id' => 'required|integer',
            ]);

            $land = new Land();
            $land->is_affected = $request->is_affected;
            $land->land_location = $request->land_location;
            $land->farmer_id = $request->farmer_id;
            $land->barangay_id = $request->barangay_id;

            $land->save();

            return response()->json(
                [
                    'message' => 'Land created successfully',
                ],
                201
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Error: ' . $e->getMessage(),
                ],
                500
            );
        }
    }
}
