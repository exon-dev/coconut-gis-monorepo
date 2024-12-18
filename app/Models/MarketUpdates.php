<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketUpdates extends Model
{
    use HasFactory;

    protected $primaryKey = 'update_id';

    protected $fillable = [
        'price_per_coconut_kg',
        'volume_of_coconut',
        'top_market',
    ];
}
