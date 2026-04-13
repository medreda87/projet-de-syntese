<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laundry;
class LaundryController extends Controller
{
     public function index(Request $request)
    {
        $query = Laundry::with('provider', 'services', 'categories.products', 'delivery', 'comment');

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('address')) {
            $query->where('address', 'like', '%' . $request->address . '%');
        }

        if($request->has('user_id')){
            $query->where('user_id', $request->user_id);
        }

        $laundries = $query->get();
        return response()->json($laundries);
    }

    public function show($id)
    {
        $laundry = Laundry::with('provider', 'services', 'categories.products', 'delivery', 'comment')
            ->findOrFail($id);

        return response()->json($laundry);
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
