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
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->save();

        $admin = new Admin([
            'name' => $request->name,
            'role' => 'admin',
            'user_id' => $user->user_id,
        ]);

        $admin->save();

        return response()->json(
            [
                'message' => 'Successfully created admin!',
            ],
            201
        );
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
