<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $fillable = [
        'icon',
        'name',
        'description',
        'price',
        'laundry_id',
        'unit',
    ];
    public function laundry()
    {
        return $this->belongsTo(Laundry::class);
    }
}
