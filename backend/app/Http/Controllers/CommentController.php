<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comments = Comment::with('replies')->get();
        return response()->json($comments);
    }

    public function byLaundry($laundryId)
    {
        $comments = Comment::where('laundry_id', $laundryId)
            ->whereNull('parent_id')
            ->with('replies.user', 'user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "comment" => "required|string|max:250",
            "laundryId" => "required|exists:laundries,id",
            "image" => "nullable|file|image|max:5120",
            "parent_id" => "nullable|integer|exists:table_comment,id",
            "rating" => "nullable|integer|min:1|max:5",
        ]);

        // Check if user has a ramassage for this laundry (only for top-level comments)
        if (!$request->parent_id) {
            $hasRamassage = \App\Models\Ramassage::where('user_id', $request->user()->id)
                ->where('laundry_id', $request->laundryId)
                ->exists();

            if (!$hasRamassage) {
                return response()->json([
                    'success' => false,
                    'message' => 'You must have a reservation before leaving a review.'
                ], 403);
            }
        }

        $data = [
            'user_id' => $request->user()->id,
            'laundry_id' => $request->laundryId,
            'comment' => $request->comment,
            'name' => $request->user()->name,
            'parent_id' => $request->parent_id,
            'rating' => $request->rating ?? 0,
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('comments', 'public');
        }

        $comment = Comment::create($data);
        $comment->load('user', 'replies');

        return response()->json([
            "success" => true,
            "comment" => $comment,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $comment = Comment::where("id", $id)->update([
            "comment" => $request->comment
        ]);

        return response()->json(["success" => true, "message" => "the comment updated with success"], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Comment::destroy($id);

        return response()->json([
            "success" => true,
            "message" => "your comment deleted with success"
        ]);
    }
}
