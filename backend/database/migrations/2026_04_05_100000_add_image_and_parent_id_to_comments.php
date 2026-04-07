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
        Schema::table('table_comment', function (Blueprint $table) {
            $table->string('image')->nullable()->after('comment');
            $table->foreignId('parent_id')->nullable()->after('name')->constrained('table_comment')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('table_comment', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['image', 'parent_id']);
        });
    }
};
