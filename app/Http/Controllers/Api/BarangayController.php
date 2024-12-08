<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Barangay;

class BarangayController extends Controller
{
    //
    public function index()
    {
        //return all barangay and count the # of farmers and lands
        $barangays = Barangay::withCount(['farmers', 'lands'])->get();
        return response()->json($barangays);
    }
}
