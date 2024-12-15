<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Exception;

use App\Models\Farmer;
use App\Models\Land;

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

    public function get_farmers_with_number_of_lands()
    {
        try {
            $farmers = Farmer::withCount('lands')->get();

            if (!$farmers) {
                return response()->json(['message' => 'No farmers found'], 404);
            }

            return response()->json($farmers);
        } catch (Exception $e) {
            return response()->json(
                [
                    'message' => 'Error: ' . $e->getMessage(),
                ],
                500
            );
        }
    }

    public function get_farmers_with_details(Request $request)
    {
        try {
            $perPage = 10;
            $currentPage = intval($request->input('page', 1));
            $sortOption = $request->input('sort', 'name');

            $allowedSortOptions = ['name', 'created_at'];
            if (!in_array($sortOption, $allowedSortOptions)) {
                $sortOption = 'name';
            }

            $farmers = Farmer::with(['barangay'])
                ->orderBy($sortOption)
                ->paginate($perPage, ['*'], 'page', $currentPage);

            if ($farmers->isEmpty()) {
                return response()->json(['message' => 'No farmers found'], 404);
            }

            return response()->json($farmers);
        } catch (\Exception $e) {
            return response()->json(
                ['message' => 'Error: ' . $e->getMessage()],
                500
            );
        }
    }
}
