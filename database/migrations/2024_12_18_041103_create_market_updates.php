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
        Schema::create('market_updates', function (Blueprint $table) {
            $table->id('update_id');
            $table->text('price_per_coconut_kg')->nullable(); // value of this is a stringified array of objects
            $table->text('volume_of_coconut')->nullable(); // value of this is a stringified array of objects
            $table->text('top_market')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_updates');
    }
};
