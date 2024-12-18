<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Barangay;
use App\Models\Land;
use App\Models\Farmer;

class BarangayController extends Controller
{
    //
    public function index()
    {
        //return all barangay and count the # of farmers and lands
        $barangays = Barangay::withCount(['farmers', 'lands'])->get();

        //get the lands of each barangay from the lands table
        foreach ($barangays as $barangay) {
            $lands = Land::where('barangay_id', $barangay->barangay_id)->get([
                'is_affected',
                'land_location',
            ]);
            $coconut_trees_planted = Farmer::where(
                'barangay_id',
                $barangay->barangay_id
            )->sum('number_of_coconut_trees');
            $barangay->lands = $lands;
            $barangay->coconut_trees_planted = $coconut_trees_planted;
        }

        return response()->json($barangays);
    }

    public function get_list_of_farmers(int $barangay_id)
    {
        $farmers = Barangay::find($barangay_id)->farmers;
        return response()->json($farmers);
    }
}
