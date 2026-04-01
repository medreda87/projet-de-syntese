<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laundry;
class LaundryController extends Controller
{
     public function index()
    {
        return Laundry::first(); 
    }

    public function store(Request $request)
    {
        $laundry = Laundry::first();

        if ($laundry) {
            $laundry->update($request->all());
        } else {
            $laundry = Laundry::create($request->all());
        }

        return response()->json($laundry);
    }
}
