<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laundry;
class LaundryController extends Controller
{
     public function index(Request $request)
    {
        $query = Laundry::with('provider', 'services', 'categories.products');

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('address')) {
            $query->where('address', 'like', '%' . $request->address . '%');
        }

        if ($request->has('provider_id')) {
            $query->where('provider_id', $request->provider_id);
        }

        $laundries = $query->get();
        return response()->json($laundries);
    }

    public function show($id)
    {
        $laundry = Laundry::with('provider', 'services', 'categories.products', 'comment.user', 'delivery')->findOrFail($id);
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
                'name' => $request->name,
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
