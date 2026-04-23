<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\EmailVerification;
use App\Mail\VerificationCodeMail;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Send a verification code to the given email.
     */
    public function sendCode(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        // Check if email is already registered
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This email is already registered.',
            ], 422);
        }

        // Delete any existing codes for this email
        EmailVerification::where('email', $request->email)->delete();

        // Generate a 6-digit code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store with 5-minute expiration
        EmailVerification::create([
            'email' => $request->email,
            'code' => $code,
            'expires_at' => Carbon::now()->addMinutes(5),
        ]);

        // Send the email
        Mail::to($request->email)->send(new VerificationCodeMail($code));

        return response()->json([
            'success' => true,
            'message' => 'Verification code sent to your email.',
        ]);
    }

    /**
     * Verify the code for the given email.
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'code' => 'required|string|size:6',
        ]);

        $verification = EmailVerification::where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$verification) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code.',
            ], 422);
        }

        if ($verification->isExpired()) {
            $verification->delete();
            return response()->json([
                'success' => false,
                'message' => 'Verification code has expired. Please request a new one.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'code' => 'required|string|size:6',
        ]);

        // Verify the code before registering
        $verification = EmailVerification::where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$verification) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code.',
            ], 422);
        }

        if ($verification->isExpired()) {
            $verification->delete();
            return response()->json([
                'success' => false,
                'message' => 'Verification code has expired. Please request a new one.',
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Clean up used verification code
        EmailVerification::where('email', $request->email)->delete();

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
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
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

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'              => 'sometimes|required|string|max:255',
            'current_password'  => 'nullable|string',
            'password'          => 'nullable|string|min:8|confirmed',
        ]);

        if ($request->filled('current_password') || $request->filled('password')) {
            if (!$request->filled('current_password') || !Hash::check($request->current_password, $user->password)) {
                return response()->json(['success' => false, 'message' => 'Current password is incorrect.'], 422);
            }
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }
        }

        if ($request->filled('name')) $user->name = $request->name;

        $user->save();

        return response()->json(['success' => true, 'user' => $user]);
    }

    public function updateRole(Request $request)
    {
        $request->validate([
            'role' => 'required|string|in:client,customer,provider',
        ]);

        $user = $request->user();
        $user->role = $request->role;
        $user->save();

        return response()->json([
            'success' => true,
            'user' => $user,
        ]);
    }
    public function userInfo(){
        $user=User::all();
        return response()->json($user);
    }

    /**
     * Send a password reset code to an existing user's email.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        if (!User::where('email', $request->email)->exists()) {
            // Return success to avoid email enumeration
            return response()->json(['success' => true, 'message' => 'If this email is registered, a reset code has been sent.']);
        }

        EmailVerification::where('email', $request->email)->delete();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        EmailVerification::create([
            'email' => $request->email,
            'code' => $code,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        Mail::to($request->email)->send(new VerificationCodeMail($code));

        return response()->json(['success' => true, 'message' => 'Reset code sent to your email.']);
    }

    /**
     * Reset the password after code verification.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'code'     => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $verification = EmailVerification::where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$verification) {
            return response()->json(['success' => false, 'message' => 'Invalid reset code.'], 422);
        }

        if ($verification->isExpired()) {
            $verification->delete();
            return response()->json(['success' => false, 'message' => 'Reset code has expired.'], 422);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->password = Hash::make($request->password);
        $user->save();

        $verification->delete();

        return response()->json(['success' => true, 'message' => 'Password reset successfully.']);
    }
}