<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;
        protected $fillable = [
        'laudry_name',
        'provider_name',
        'email',
        'password',
        'phone',
        'address',
    ];
    
}
