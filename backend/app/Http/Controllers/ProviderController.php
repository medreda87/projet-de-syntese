<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Provider;
use App\Notifications\ProviderEmail;

class ProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index()
    {
        // function index
        return response()->json(Provider::all());       
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'laudry_name' => 'required',
            'provider_name' => 'required',
            'email' => 'required|email|unique:providers,email',
            'password' => 'required|min:6',
            'phone' => 'nullable',
            'address' => 'nullable',
        ]);

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);
        $provider = Provider::create($data);
        
        return response()->json($provider, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $provider = Provider::findOrFail($id);

        return response()->json($provider);
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Provider $provider)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'laudry_name' => 'required',
            'provider_name' => 'required',
            'email' => 'required|email|unique:providers,email,' . $id,
            'password' => 'sometimes|min:6',
            'phone' => 'nullable',
            'address' => 'nullable',
        ]);

        $provider = Provider::findOrFail($id);
        $data = $request->all();
        if ($request->filled('password')) {
            $data['password'] = Hash::make($data['password']);
        }
        $provider->update($data);

        return response()->json($provider);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $provider = Provider::findOrFail($id);
        $provider->delete();

        return response()->json(['message' => 'Provider deleted successfully']);
    }



}
