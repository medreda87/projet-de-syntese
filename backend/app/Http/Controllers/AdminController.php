<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Laundry;
use App\Models\Comment;
use App\Mail\LaundryApprovedMail;
use App\Mail\LaundryRejectedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    /* ──────────────────────────────────────────
     | GUARD: require admin role on every method
     ─────────────────────────────────────────── */
    private function assertAdmin(Request $request)
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Forbidden');
        }
    }

    /* ═══════════ STATS ═══════════ */
    public function stats(Request $request)
    {
        $this->assertAdmin($request);
        return response()->json([
            'users'         => User::count(),
            'laundries'     => Laundry::count(),
            'pending'       => Laundry::where('admin_approved', false)->count(),
            'accepted'      => Laundry::where('admin_approved', true)->count(),
            'comments'      => Comment::count(),
            'providers'     => User::where('role', 'provider')->count(),
        ]);
    }

    /* ═══════════ USERS ═══════════ */
    public function users(Request $request)
    {
        $this->assertAdmin($request);
        $q = User::query();
        if ($request->filled('search')) {
            $q->where(function ($sub) use ($request) {
                $sub->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }
        if ($request->filled('role')) {
            $q->where('role', $request->role);
        }
        $users = $q->orderByDesc('created_at')->paginate(20);
        return response()->json($users);
    }

    public function showUser(Request $request, $id)
    {
        $this->assertAdmin($request);
        $user = User::with('laundries')->findOrFail($id);
        return response()->json($user);
    }

    public function updateUser(Request $request, $id)
    {
        $this->assertAdmin($request);
        $user = User::findOrFail($id);
        $data = $request->validate([
            'name'  => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,'.$id,
            'role'  => 'sometimes|required|in:admin,provider,customer',
        ]);
        if ($request->filled('password')) {
            $request->validate(['password' => 'string|min:8']);
            $data['password'] = Hash::make($request->password);
        }
        $user->update($data);
        return response()->json(['success' => true, 'user' => $user]);
    }

    public function deleteUser(Request $request, $id)
    {
        $this->assertAdmin($request);
        if ((int)$id === $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Cannot delete yourself.'], 422);
        }
        User::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    /* ═══════════ LAUNDRIES ═══════════ */
    public function laundries(Request $request)
    {
        $this->assertAdmin($request);
        $q = Laundry::with('user:id,name,email')->withCount('comments')->withAvg('comments','rating');
        if ($request->filled('status')) {
            $q->where('admin_approved', $request->status === 'accepted');
        }
        if ($request->filled('search')) {
            $q->where('name', 'like', '%'.$request->search.'%');
        }
        $laundries = $q->orderByDesc('created_at')->paginate(20);
        return response()->json($laundries);
    }

    public function approveLaundry(Request $request, $id)
    {
        $this->assertAdmin($request);
        $laundry = Laundry::with('user')->findOrFail($id);
        $laundry->update(['admin_approved' => true, 'is_accepted' => true]);

        // Send approval email to provider
        if ($laundry->user && $laundry->user->email) {
            try {
                Mail::to($laundry->user->email)->send(new LaundryApprovedMail($laundry));
            } catch (\Exception $e) {
                // Log but don't fail
            }
        }
        return response()->json(['success' => true]);
    }

    public function rejectLaundry(Request $request, $id)
    {
        $this->assertAdmin($request);
        $laundry = Laundry::with('user')->findOrFail($id);
        $laundry->update(['admin_approved' => false, 'is_accepted' => false]);

        // Send rejection email
        if ($laundry->user && $laundry->user->email) {
            try {
                Mail::to($laundry->user->email)->send(new LaundryRejectedMail($laundry));
            } catch (\Exception $e) {
                // Log but don't fail
            }
        }
        return response()->json(['success' => true]);
    }

    public function deleteLaundry(Request $request, $id)
    {
        $this->assertAdmin($request);
        Laundry::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    /* ═══════════ COMMENTS / MESSAGES ═══════════ */
    public function comments(Request $request)
    {
        $this->assertAdmin($request);
        $q = Comment::with('user:id,name,email', 'laundry:id,name')->whereNull('parent_id');
        if ($request->filled('search')) {
            $q->where('comment', 'like', '%'.$request->search.'%');
        }
        $comments = $q->orderByDesc('created_at')->paginate(20);
        return response()->json($comments);
    }

    public function deleteComment(Request $request, $id)
    {
        $this->assertAdmin($request);
        Comment::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
