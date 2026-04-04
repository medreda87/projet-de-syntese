<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ramassages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('laundry_id')->constrained('laundries')->onDelete('cascade');
            $table->string('full_name');
            $table->string('phone');
            $table->string('pickup_address');
            $table->date('pickup_date');
            $table->string('pickup_time');
            $table->decimal('pickup_latitude', 10, 7)->nullable();
            $table->decimal('pickup_longitude', 10, 7)->nullable();
            $table->string('delivery_address');
            $table->date('delivery_date');
            $table->string('delivery_time');
            $table->decimal('delivery_latitude', 10, 7)->nullable();
            $table->decimal('delivery_longitude', 10, 7)->nullable();
            $table->enum('status', ['pending', 'confirmed', 'picked_up', 'delivered', 'cancelled'])->default('pending');
            $table->timestamps();
        });

        Schema::create('ramassage_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ramassage_id')->constrained('ramassages')->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ramassage_service');
        Schema::dropIfExists('ramassages');
    }
};
