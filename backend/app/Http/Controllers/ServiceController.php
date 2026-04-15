<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Service::all();
        return response()->json($services);
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
            'icon' => 'nullable|string',
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'laundry_id' => 'nullable|exists:laundries,id',
            'unit' => 'nullable|string',
        ]);

        $service = Service::create($request->all());

        return response()->json($service, 201); 
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $request->validate([
            'icon' => 'sometimes|required|string',
            'name' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
        ]);

        $service->update($request->all());

        return response()->json($service);  
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(null, 204);
    }
    public function getByLaundry($id){
        $services = Service::where('laundry_id', $id)->get();
        return response()->json($services);
    }
}
