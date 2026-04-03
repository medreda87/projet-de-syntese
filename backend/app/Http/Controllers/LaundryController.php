<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laundry;
class LaundryController extends Controller
{
     public function index()
    {
        $laundries = Laundry::with('provider', 'services', 'categories.products')->get();
        return response()->json($laundries);
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
        'provider_id' => 'required|exists:providers,id',
    ]);

    $data = $request->all();

    if ($request->hasFile('logo')) {
        $data['logo'] = $request->file('logo')->store('logos', 'public');
    }

    if ($request->hasFile('bigLogo')) {
        $data['bigLogo'] = $request->file('bigLogo')->store('covers', 'public');
    }

    $laundry = Laundry::updateOrCreate(
        ['name' => $request->name, 'provider_id' => $request->provider_id],
        $data
    );

    return response()->json($laundry);
}
}
