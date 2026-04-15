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
        Schema::table('ramassages', function (Blueprint $table) {
            $table->decimal('delivery_price', 8, 2)->nullable()->after('status');
            $table->decimal('services_total', 8, 2)->nullable()->after('delivery_price');
            $table->decimal('total_price', 8, 2)->nullable()->after('services_total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ramassages', function (Blueprint $table) {
            $table->dropColumn(['delivery_price', 'services_total', 'total_price']);
        });
    }
};
