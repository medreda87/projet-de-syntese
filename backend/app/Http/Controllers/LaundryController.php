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
            'logo' => 'nullable|string',
            'bigLogo' => 'nullable|string',
            'provider_id' => 'required|exists:providers,id',
        ]);

        $laundry = Laundry::updateOrCreate(
            [
                'name' => $request->name,
                'provider_id' => $request->provider_id
            ],
            [
                'address' => $request->address,
                'phone' => $request->phone,
                'email' => $request->email,
                'description' => $request->description,
                'logo' => $request->logo,
                'bigLogo' => $request->bigLogo,
            ]
        );

        return response()->json($laundry);
    }
}
