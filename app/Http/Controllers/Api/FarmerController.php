<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Farmer;

class FarmerController extends Controller
{
    //
    public function create_farmer(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'gender' => 'required|string',
                'number_of_coconut_trees' => 'required|integer',
                'barangay_id' => 'required|integer',
            ]);

            $farmer = new Farmer();
            $farmer->name = $request->name;
            $farmer->gender = $request->gender;
            $farmer->number_of_coconut_trees =
                $request->number_of_coconut_trees;
            $farmer->barangay_id = $request->barangay_id;

            $farmer->save();
            $farmer_id = $farmer->farmer_id;

            return response()->json(
                [
                    'farmer_id' => $farmer_id,
                    'message' => 'Farmer created successfully',
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
