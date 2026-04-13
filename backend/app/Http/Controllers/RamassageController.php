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
            'user_id' => 'nullable',
            'fullName' => 'required|string',
            'phoneNumber' => 'required|string',
            'pickupAddress' => 'required|string',
            'pickupDate' => 'required|date',
            'pickupTime' => 'required|string',
            'pickupLatitude' => 'nullable|numeric',
            'pickupLongitude' => 'nullable|numeric',
            'deliveryAddress' => 'required|string',
            'deliveryDate' => 'required|date',
            'deliveryTime' => 'required|string',
            'deliveryLatitude' => 'nullable|numeric',
            'deliveryLongitude' => 'nullable|numeric',
            'services' => 'required|array|min:0'
        ]);

        $ramassage = Ramassage::create([
            'user_id' => $request->user() ? $request->user()->id : null,
            'laundry_id' => $request->laundry_id,
            'full_name' => $request->fullName,
            'phone' => $request->phoneNumber,
            'pickup_address' => $request->pickupAddress,
            'pickup_date' => $request->pickupDate,
            'pickup_time' => $request->pickupTime,
            'pickup_latitude' => $request->pickupLatitude,
            'pickup_longitude' => $request->pickupLongitude,
            'delivery_address' => $request->deliveryAddress,
            'delivery_date' => $request->deliveryDate,
            'delivery_time' => $request->deliveryTime,
            'delivery_latitude' => $request->deliveryLatitude,
            'delivery_longitude' => $request->deliveryLongitude,
            'status' => 'pending',
            'services' => json_encode($request->services),
        ]);
        $ramassage->save();


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

    public function checkForLaundry(Request $request, $laundryId)
    {
        $hasRamassage = Ramassage::where('user_id', $request->user()->id)
            ->where('laundry_id', $laundryId)
            ->exists();

        return response()->json(['hasRamassage' => $hasRamassage]);
    }

    public function getByLaundry($laundryId)
    {
        $ramassages = Ramassage::where('laundry_id', $laundryId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ramassages);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,picked_up,delivered,cancelled',
        ]);

        $ramassage = Ramassage::findOrFail($id);
        $ramassage->status = $request->status;
        $ramassage->save();

        return response()->json(['success' => true, 'ramassage' => $ramassage]);
    }

    public function destroy($id)
    {
        $ramassage = Ramassage::findOrFail($id);
        $ramassage->delete();

        return response()->json(['success' => true]);
    }
}
