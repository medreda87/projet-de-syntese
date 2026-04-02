<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
        ]);
        // $request->validate([
        //     'email' => 'required|string|email',
        //     'password' => 'required|string',
        // ]);

        // if (!Auth::attempt($request->only('email', 'password'))) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Invalid credentials',
        //     ], 401);
        // }

        // $user = Auth::user();
        // $token = $user->createToken('auth_token')->plainTextToken;

        // return response()->json([
        //     'success' => true,
        //     'access_token' => $token,
        //     'token_type' => 'Bearer',
        //     'user' => $user,
        // ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }
}