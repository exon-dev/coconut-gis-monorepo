<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Farmer;
use App\Models\Barangay;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lands', function (Blueprint $table) {
            $table->id('land_id');
            $table->float('total_hectare');
            $table->float('total_square_meter');
            $table->string('land_location');
            $table
                ->foreignIdFor(Farmer::class, 'farmer_id')
                ->onDelete('cascade');
            $table
                ->foreignIdFor(Barangay::class, 'barangay_id')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lands');
    }
};
