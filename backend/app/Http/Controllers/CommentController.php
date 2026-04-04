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
        //
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
        //
        $request->validate([
            "comment" => "required|string|max:250",
            "shopId" => "required|number"
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'laundry_id' => $request->shop_id, 
            'comment'=>$request->comment,
            'name'=>$request->user()->name,
        ]);

        return response()->json([
            "success" => true,
            "message"=> "the comment added succufuly"
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
        //

        $comment = Comment::where("id", $request->id)->update([
            "comment"=>$request->comment
        ]) ;


        return response()->json(["success" => true , "message" => "the comment updated with success" ] , 201) ;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        
        Comment::destroy($id);

        return response()->json([
            "success"=> true , 
            "message" => "your comment deleted with success"
        ]);
    }
}
