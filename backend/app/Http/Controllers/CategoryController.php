<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
class CategoryController extends Controller
{
     public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        return Category::create($request->all());
    }

    public function show($id)
    {
        return Category::with('products')->findOrFail($id);
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['message' => 'deleted']);
    }

}
