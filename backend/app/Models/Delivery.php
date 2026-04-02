<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;
    protected $fillable = [
    'laundry_id',
    'type',
    'price_per_km',
    'fixed_price',
    'min_order',
    ];
    public function laundry()
    {
        return $this->belongsTo(Laundry::class);
    }
}
