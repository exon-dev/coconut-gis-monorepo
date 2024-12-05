<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
            $table
                ->foreignId('land_id')
                ->constrained('lands')
                ->onDelete('cascade');
            $table
                ->foreignId('farmer_id')
                ->constrained('farmers')
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
