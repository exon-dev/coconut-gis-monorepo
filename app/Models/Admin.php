<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Laravel\Sanctum\HasApiTokens;

use App\Models\Barangay;

class Admin extends Model
{
    use HasFactory, HasApiTokens;

    protected $primaryKey = 'admin_id';
    protected $fillable = ['name', 'role', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}
