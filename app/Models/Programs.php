<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programs extends Model
{
    use HasFactory;

    protected $primaryKey = 'program_id';

    protected $table = 'programs';

    protected $fillable = [
        'cover_image',
        'program_name',
        'program_description',
        'program_objectives',
        'program_timeline',
        'program_eligibility',
        'admin_id',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'admin_id');
    }
}
