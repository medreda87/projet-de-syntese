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
        Schema::table('products', function (Blueprint $table) {
                $table->unsignedBigInteger('laundry_id')->nullable()->after('id');
                $table->foreign('laundry_id')->references('id')->on('laundries')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['laundry_id']);
            $table->dropColumn('laundry_id');
        });
    }
};
