<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Admin;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean',
        ]);

        $credentials = request(['email', 'password']);
        if (!Auth::attempt($credentials)) {
            return response()->json(
                [
                    'message' => 'Unauthorized',
                ],
                401
            );
        }

        $admin = Auth::user();

        $admin_creds = Admin::select('admin_id', 'name', 'role')
            ->where('user_id', $admin->user_id)
            ->first();

        $tokenResult = $admin->createToken('Personal Access Token');
        $token = $tokenResult->plainTextToken;

        return response()->json([
            'admin' => $admin_creds,
            'accessToken' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function signup(Request $request)
    {
        $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'middle_initial' => 'string|max:255',
            'age' => 'integer|required',
            'gender' => 'string|max:255',
            'address' => 'string|max:255',
            'email' => 'string|max:255|unique:users',
            'password' => 'string|max:11',
            'role' => 'string|max:255',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            return response()->json(
                [
                    'message' => 'Email already exists',
                ],
                400
            );
        }

        $user = new User();
        $user->name =
            $request->first_name .
            ' ' .
            $request->middle_initial .
            ' ' .
            $request->last_name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        if ($user) {
            $token = null;
            if ($user->save()) {
                $token = $user->createToken('personal access token');
            }

            $admin = new Admin();
            $admin->name =
                $request->first_name .
                ' ' .
                $request->middle_initial .
                ' ' .
                $request->last_name;
            $admin->age = $request->age;
            $admin->address = $request->address;
            $admin->gender = $request->gender;
            $admin->role = $request->role;
            $admin->user_id = $user->user_id;
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

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request
                ->user()
                ->currentAccessToken()
                ->delete();
            return response()->json([
                'message' => 'Successfully logged out',
            ]);
        }

        return response()->json(
            [
                'message' => 'No authenticated user',
            ],
            401
        );
    }
}
