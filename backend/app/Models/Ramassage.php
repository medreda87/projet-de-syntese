<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ramassage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'laundry_id',
        'full_name',
        'phone',
        'pickup_address',
        'pickup_date',
        'pickup_time',
        'pickup_latitude',
        'pickup_longitude',
        'delivery_address',
        'delivery_date',
        'delivery_time',
        'delivery_latitude',
        'delivery_longitude',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function laundry()
    {
        return $this->belongsTo(Laundry::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'ramassage_service');
    }
}
