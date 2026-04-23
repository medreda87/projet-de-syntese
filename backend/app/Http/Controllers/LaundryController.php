<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laundry;
use App\Models\Service;
class LaundryController extends Controller
{
     public function index(Request $request)
    {

        $query = Laundry::query()->where('admin_approved', true)->with('services:id,laundry_id,name');
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Filter by city
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        // Filter by service name
        if ($request->filled('service')) {
            $query->whereHas('services', function ($q) use ($request) {
                $q->where('name', $request->service);
            });
        }

        if ($request->has('address')) {
            $query->where('address', 'like', '%' . $request->address . '%');
        }

        if($request->has('user_id')){
            $query->where('user_id', $request->user_id);
        }

        // Filter by map bounds (sw_lat, sw_lng, ne_lat, ne_lng)
        if ($request->has(['sw_lat', 'sw_lng', 'ne_lat', 'ne_lng'])) {
            $query->whereNotNull('latitude')
                  ->whereNotNull('longitude')
                  ->whereBetween('latitude', [$request->sw_lat, $request->ne_lat])
                  ->whereBetween('longitude', [$request->sw_lng, $request->ne_lng]);
        }

        $query->withAvg('comments', 'rating');
        $query->withCount('comments');

        $laundries = $query->paginate($request->get('per_page', 9));
        return response()->json($laundries);
    }

    public function show($id)
    {
        $laundry = Laundry::with('user', 'services', 'delivery', 'comments' , 'products.category:id,name')
            ->findOrFail($id);
        

        return response()->json(["laundry"=> $laundry]);
    }
   public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'address' => 'required|string', 
        'phone' => 'required|string',
        'email' => 'nullable|email',
        'description' => 'nullable|string',
        'logo' => 'nullable|file|image',
        'bigLogo' => 'nullable|file|image',
        'openingHours' => 'nullable|string',
        'user_id' => 'required|exists:users,id',
    ]);

    $data = $request->all();

    if ($request->hasFile('logo')) {
        $data['logo'] = $request->file('logo')->store('logos', 'public');
    }

    if ($request->hasFile('bigLogo')) {
        $data['bigLogo'] = $request->file('bigLogo')->store('covers', 'public');
    }

    $laundry = Laundry::updateOrCreate(
        ['name' => $request->name, 'user_id' => $request->user_id],
        $data
    );

    // Auto-mark profile as complete if all required info is filled
    // admin_approved is NOT touched here — only admin can set it
    $laundry->is_accepted = $laundry->checkAccepted();
    $laundry->save();

    return response()->json($laundry);
}

    public function filters(Request $request)
    {
        $services = Service::select('name')
            ->distinct()
            ->orderBy('name')
            ->pluck('name');

        $cities = Laundry::where('admin_approved', true)
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->select('city')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        return response()->json([
            'services' => $services,
            'cities' => $cities,
        ]);
    }
public function update(Request $request, $id)
{
    $laundry = Laundry::findOrFail($id);

    $request->validate([
        'name' => 'sometimes|required|string',
        'address' => 'sometimes|required|string',
        'phone' => 'sometimes|required|string',
        'email' => 'nullable|email',
        'description' => 'nullable|string',
        'logo' => 'nullable|file|image',
        'bigLogo' => 'nullable|file|image',
        'openingHours' => 'nullable|string',
    ]);

    $data = $request->except(['logo', 'bigLogo', '_method']);

    if ($request->hasFile('logo')) {
        $data['logo'] = $request->file('logo')->store('logos', 'public');
    }
    if ($request->hasFile('bigLogo')) {
        $data['bigLogo'] = $request->file('bigLogo')->store('covers', 'public');
    }

    $laundry->update($data);
    // Update profile-completeness flag; admin_approved is NOT changed
    $laundry->is_accepted = $laundry->checkAccepted();
    $laundry->save();

    return response()->json($laundry);
}

// get toute les laundry d'un user 
public function getLaundriesByUser($userId)
{
    $laundries = Laundry::where('user_id', $userId)->get();
    return response()->json($laundries);
}
// get info d'un laundry par son id
public function getLaundryById($id)
{
    $laundry=Laundry::findOrFail($id);
    return response()->json($laundry);
}
}
