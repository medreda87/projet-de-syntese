<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $deliveries = Delivery::all();
        return response()->json($deliveries);
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
        $data=$request->validate([
   'laundry_id' => 'required|exists:laundries,id',
    'type' => 'required|in:distance,fixed,free_above,free',

    'price_per_km' => 'required_if:type,distance|nullable|numeric',
    'fixed_price' => 'required_if:type,fixed|nullable|numeric',
    'min_order' => 'required_if:type,free_above|nullable|numeric',
        ]);
    

    $data['price_per_km'] = $data['type'] === 'distance' ? $data['price_per_km'] ?? null : null;
    $data['fixed_price']  = $data['type'] === 'fixed' ? $data['fixed_price'] ?? null : null;
    $data['min_order']    = $data['type'] === 'free_above' ? $data['min_order'] ?? null : null;

    $delivery = Delivery::updateOrCreate(
    ['laundry_id' => $data['laundry_id']],
    $data
);
        return response()->json($delivery, 201);
        
        
}


    /**
     * Display the specified resource.
     */
    public function show(Delivery $delivery)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Delivery $delivery)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Delivery $delivery)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Delivery $delivery)
    {
        //
    }
}
