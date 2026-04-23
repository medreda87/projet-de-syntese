<?php

namespace App\Http\Controllers;

use App\Models\Laundry;
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
            'services' => 'required|array|min:0',
            'servicesTotal' => 'nullable|numeric',
        ]);

        $laundry = Laundry::with("delivery")->find($request->laundry_id);
        if (!$laundry) {
            return response()->json(['success' => false, 'message' => 'Laundry not found.'], 404);
        }

        // Calculate services total from the sent data
        $servicesTotal = $request->servicesTotal ?? 0;

        // Calculate delivery price based on laundry's delivery settings
        $deliveryPrice = 0;
        $delivery = $laundry->delivery;

        if ($delivery) {
            switch ($delivery->type) {
                case 'free':
                    $deliveryPrice = 0;
                    break;

                case 'fixed':
                    $deliveryPrice = $delivery->fixed_price ?? 0;
                    break;

                case 'free_above':
                    // Free if services total >= min_order, otherwise use fixed_price
                    if ($servicesTotal >= ($delivery->min_order ?? 0)) {
                        $deliveryPrice = 0;
                    } else {
                        $deliveryPrice = $delivery->fixed_price ?? 0;
                    }
                    break;

                case 'distance':
                    // Calculate distance between laundry and pickup address (customer location)
                    $pricePerKm = $delivery->price_per_km ?? 0;
                    $distance = 0;

                    if ($laundry->latitude && $laundry->longitude && $request->pickupLatitude && $request->pickupLongitude) {
                        $distance = $this->haversineDistance(
                            $laundry->latitude, $laundry->longitude,
                            $request->pickupLatitude, $request->pickupLongitude
                        );
                    }

                    $deliveryPrice = round($distance * $pricePerKm, 2);
                    break;
            }
        }

        $totalPrice = $servicesTotal + $deliveryPrice;

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
            'delivery_price' => $deliveryPrice,
            'services_total' => $servicesTotal,
            'total_price' => $totalPrice,
        ]);

        return response()->json([
            'success' => true,
            'ramassage' => $ramassage->load('laundry', 'services'),
            'pricing' => [
                'services_total' => $servicesTotal,
                'delivery_price' => $deliveryPrice,
                'total_price' => $totalPrice,
                'delivery_type' => $delivery ? $delivery->type : null,
            ],
        ], 201);
    }

    /**
     * Calculate distance between two coordinates using Haversine formula (in km)
     */
    private function haversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c, 2);
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
