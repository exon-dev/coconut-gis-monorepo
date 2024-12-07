<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Farmer;
use App\Models\Land;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('barangays', function (Blueprint $table) {
            $table->id('barangay_id');
            $table->string('barangay_name');
            $table->string('barangay_captain');
            $table->string('barangay_contact');
            $table->foreignIdFor(Land::class, 'land_id')->onDelete('cascade');
            $table
                ->foreignIdFor(Farmer::class, 'farmer_id')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangays');
    }
};
