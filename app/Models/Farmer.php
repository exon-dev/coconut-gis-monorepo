<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Land;
use App\Models\Barangay;

class Farmer extends Model
{
    use HasFactory;

    protected $primaryKey = 'farmer_id';

    protected $guarded = [];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'barangay_id', 'barangay_id');
    }

    public function lands()
    {
        return $this->hasMany(Land::class, 'farmer_id', 'farmer_id');
    }
}
