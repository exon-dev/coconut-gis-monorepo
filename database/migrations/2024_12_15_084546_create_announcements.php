<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\User;
use App\Models\Barangay;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id('announcement_id');
            $table->string('title');
            $table->text('content');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('status');
            $table->foreignIdFor(User::class, 'user_id')->onDelete('cascade');
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
        Schema::dropIfExists('announcements');
    }
};
