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
        'city',
        'phone',
        'email',
        'description',
        'logo',
        'bigLogo',
        'user_id',
        'email_verified_at',
        'openingHours',
        'is_accepted',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'is_accepted' => 'boolean',
    ];

    public function checkAccepted()
    {
        $hasRequiredFields = $this->name
            && $this->description
            && $this->address
            && $this->phone
            && $this->logo
            && $this->bigLogo;

        $hasServices = $this->services()->exists();
        $hasDelivery = $this->delivery()->exists();

        return $hasRequiredFields && $hasServices && $hasDelivery;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
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

     public function comments()
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id')->with('replies', 'user');
    }

}
