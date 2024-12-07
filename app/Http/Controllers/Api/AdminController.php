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
    //
    public function create_admin(Request $request)
    {
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|max:255|unique',
            'password' => 'string|max:11',
        ]);

        $user = User::where('email', $request->email)->first();
        $admin = Admin::where('admin_id', $user->id)->first();

        if ($user || $admin) {
            return response()->json(
                [
                    'message' => 'Email already exists',
                ],
                400
            );
        }

        $user = new User();
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        if ($user) {
            $token = null;
            if ($user->save()) {
                $token = $user->createToken('personal access token');
            }

            $admin = new Admin();
            $admin->name = $request->name;
            $admin->role = 'admin';
            $admin->user_id = $user->id;
            $admin->save();

            return response()->json(
                [
                    'message' => 'Admin created successfully',
                    'token' => $token->plainTextToken,
                ],
                200
            );
        } else {
            return response()->json(
                [
                    'message' => 'Failed to create admin. Please try again',
                ],
                400
            );
        }
    }

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
