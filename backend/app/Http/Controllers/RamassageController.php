<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ramassage;

class RamassageController extends Controller
{
    public function index(Request $request)
    {
        $ramassages = Ramassage::with('laundry', 'services', 'user')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($ramassages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'laundry_id' => 'required|exists:laundries,id',
            'full_name' => 'required|string',
            'phone' => 'required|string',
            'pickup_address' => 'required|string',
            'pickup_date' => 'required|date',
            'pickup_time' => 'required|string',
            'pickup_latitude' => 'nullable|numeric',
            'pickup_longitude' => 'nullable|numeric',
            'delivery_address' => 'required|string',
            'delivery_date' => 'required|date',
            'delivery_time' => 'required|string',
            'delivery_latitude' => 'nullable|numeric',
            'delivery_longitude' => 'nullable|numeric',
            'services' => 'required|array|min:1',
            'services.*' => 'exists:services,id',
        ]);

        $ramassage = Ramassage::create([
            'user_id' => $request->user()->id,
            'laundry_id' => $request->laundry_id,
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'pickup_address' => $request->pickup_address,
            'pickup_date' => $request->pickup_date,
            'pickup_time' => $request->pickup_time,
            'pickup_latitude' => $request->pickup_latitude,
            'pickup_longitude' => $request->pickup_longitude,
            'delivery_address' => $request->delivery_address,
            'delivery_date' => $request->delivery_date,
            'delivery_time' => $request->delivery_time,
            'delivery_latitude' => $request->delivery_latitude,
            'delivery_longitude' => $request->delivery_longitude,
        ]);

        $ramassage->services()->attach($request->services);

        return response()->json([
            'success' => true,
            'ramassage' => $ramassage->load('laundry', 'services'),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $ramassage = Ramassage::with('laundry', 'services', 'user')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($ramassage);
    }
}
