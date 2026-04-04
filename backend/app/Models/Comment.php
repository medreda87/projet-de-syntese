<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

      protected $fillable = [
        'user_id',
        'laundry_id',
        'comment',
        'rating',
        'name',
    ];

    public function laundry(){
        return $this->belongsTo(Laundry::class);
    }


    public function user(){
        return $this->belongsTo(User::class);
    };
}
