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

    public function land()
    {
        return $this->hasOne(Land::class);
    }

    public function barangay()
    {
        return $this->hasOne(Barangay::class);
    }
}
