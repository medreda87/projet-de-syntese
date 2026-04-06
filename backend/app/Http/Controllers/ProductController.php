<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
USE App\Models\Product;
class ProductController extends Controller
{
    /**
     * Display a listing of products (index page)
     */
    public function index()
    {
        $products = Product::all(); 
        return view('products.index', compact('products'));
    }

    /**
     * Show the form for creating a new product
     */
    public function create()
    {
        $products = Product::all();
        return response()->json($products);
    }

    /**
     * Store a newly created product in storage
     */
    public function store(Request $request)
    {
        
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category_id' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'laundry_id' => 'nullable|exists:laundries,id',
        ]);

 
        $imageName = null;
        if ($request->hasFile('image')) {
            $imageName = Str::slug($request->name) . '_' . time() . '.' . $request->image->extension();
            $request->image->move(public_path('images/products'), $imageName);
        }

        Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'image' => $imageName,
            'laundry_id' => $request->laundry_id,
        ]);

        return response()->json(['message' => 'Product created successfully']);

    }
    public function getByLaundry($id){
        $products = Product::with('category')
        ->where('laundry_id', $id)
        ->get();
        return response()->json($products);
    }

}
