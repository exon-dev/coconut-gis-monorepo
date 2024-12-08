<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    use HasFactory;

    protected $table = 'barangays';

    protected $primaryKey = 'barangay_id';

    protected $fillable = [
        'barangay_name',
        'barangay_captain',
        'barangay_contact',
        'x_coordinate',
        'y_coordinate',
        'coordinate_points',
    ];

    public function farmers()
    {
        return $this->hasMany(Farmer::class, 'barangay_id', 'barangay_id');
    }

    public function lands()
    {
        return $this->hasMany(Land::class, 'barangay_id', 'barangay_id');
    }
}
