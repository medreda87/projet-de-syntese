<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'admin_approved',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'is_accepted'    => 'boolean',
        'admin_approved' => 'boolean',
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

    public function getLogoAttribute($value)
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) return $value;
        return url(Storage::url($value));
    }

    public function toArray()
    {
        $arr = parent::toArray();
        $raw = $this->attributes['bigLogo'] ?? null;
        if ($raw) {
            $arr['bigLogo'] = str_starts_with($raw, 'http') ? $raw : url(Storage::url($raw));
        } else {
            $arr['bigLogo'] = null;
        }
        return $arr;
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
