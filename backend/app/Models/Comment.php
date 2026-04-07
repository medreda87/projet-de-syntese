<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

      protected $table = 'table_comment';

      protected $fillable = [
        'user_id',
        'laundry_id',
        'comment',
        'image',
        'rating',
        'name',
        'parent_id',
    ];

    public function laundry(){
        return $this->belongsTo(Laundry::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function replies(){
        return $this->hasMany(Comment::class, 'parent_id')->with('replies', 'user');
    }

    public function parent(){
        return $this->belongsTo(Comment::class, 'parent_id');
    }
}
