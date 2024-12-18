<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Admin;

class AdminController extends Controller
{
    public function get_admins()
    {
        $admins = Admin::all();

        return response()->json(
            [
                'admins' => $admins,
            ],
            200
        );
    }

    public function get_specific_admin_details(int $admin_id)
    {
        if ($admin_id == null) {
            return response()->json(
                [
                    'message' => 'Admin ID is required',
                ],
                400
            );
        }

        $admin = Admin::find($admin_id);

        if (!$admin) {
            return response()->json(
                [
                    'message' => 'Admin not found!',
                ],
                404
            );
        } else {
            return response()->json(
                [
                    'admin' => $admin,
                ],
                200
            );
        }
    }
}
