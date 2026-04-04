<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laundry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'description',
        'logo',
        'bigLogo',
        'provider_id',
        'email_verified_at',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
    public function services()
    {
        return $this->hasMany(Service::class);
    }
    public function categories()
    {
        return $this->hasMany(Category::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function delivery()
    {
        return $this->hasOne(Delivery::class);
    }

     public function comment()
    {
        return $this->hasMany(Comment::class);
    }

}
