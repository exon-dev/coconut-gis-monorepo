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

            $farmersDetails = Farmer::with(['barangay'])
                ->orderBy($sortOption)
                ->paginate($perPage, ['*'], 'page', $currentPage);

            if ($farmersDetails->isEmpty()) {
                return response()->json(['message' => 'No farmers found'], 404);
            }

            $lands = Land::select('*')
                ->join('farmers', 'lands.farmer_id', '=', 'farmers.farmer_id')
                ->get();

            // combine each farmer and their barangay and lands in a single object
            $farmers = $farmersDetails->map(function ($farmer) use ($lands) {
                $farmer->lands = $lands
                    ->where('farmer_id', $farmer->farmer_id)
                    ->values();
                return $farmer;
            });

            return response()->json($farmers);
        } catch (\Exception $e) {
            return response()->json(
                ['message' => 'Error: ' . $e->getMessage()],
                500
            );
        }
    }

    public function delete_farmer(int $farmer_id)
    {
        try {
            $farmer = Farmer::find($farmer_id);

            if (!$farmer) {
                return response()->json(['message' => 'Farmer not found'], 404);
            }

            //get all lands of the farmer
            $lands = Land::where('farmer_id', $farmer_id)->get();

            foreach ($lands as $land) {
                $land->delete();
            }

            $farmer->delete();

            return response()->json(
                ['message' => 'Farmer deleted successfully'],
                200
            );
        } catch (\Exception $e) {
            return response()->json(
                ['message' => 'Error: ' . $e->getMessage()],
                500
            );
        }
    }
}
