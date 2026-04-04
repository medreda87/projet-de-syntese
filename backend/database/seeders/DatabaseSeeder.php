<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Provider;
use App\Models\Laundry;
use App\Models\Category;
use App\Models\Product;
use App\Models\Service;
use App\Models\Delivery;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // --- Provider ---
        $provider = Provider::firstOrCreate(
            ['email' => 'provider@test.com'],
            [
                'laudry_name' => 'CleanPress',
                'provider_name' => 'Mohamed Amine',
                'password' => bcrypt('password'),
                'phone' => '0600000001',
                'address' => 'Casablanca, Maarif',
            ]
        );

        // --- Laundry 1 ---
        $laundry1 = Laundry::firstOrCreate(
            ['name' => 'CleanPress Maarif', 'provider_id' => $provider->id],
            [
                'address' => '12 Rue des Fleurs, Maarif, Casablanca',
                'phone' => '0522334455',
                'email' => 'maarif@cleanpress.ma',
                'description' => 'Pressing professionnel au cœur de Maarif. Service rapide et qualité garantie.',
                'logo' => 'https://ui-avatars.com/api/?name=CleanPress&background=4F46E5&color=fff&size=128',
                'bigLogo' => 'https://ui-avatars.com/api/?name=CleanPress&background=4F46E5&color=fff&size=512',
            ]
        );

        // Services for Laundry 1
        Service::firstOrCreate(
            ['name' => 'Lavage classique', 'laundry_id' => $laundry1->id],
            ['icon' => '🧺', 'description' => 'Lavage standard pour vêtements du quotidien', 'price' => 30.00]
        );
        Service::firstOrCreate(
            ['name' => 'Repassage', 'laundry_id' => $laundry1->id],
            ['icon' => '👔', 'description' => 'Repassage professionnel soigné', 'price' => 15.00]
        );
        Service::firstOrCreate(
            ['name' => 'Nettoyage à sec', 'laundry_id' => $laundry1->id],
            ['icon' => '✨', 'description' => 'Nettoyage à sec pour costumes et vêtements délicats', 'price' => 50.00]
        );
        Service::firstOrCreate(
            ['name' => 'Express 2h', 'laundry_id' => $laundry1->id],
            ['icon' => '⚡', 'description' => 'Service express en 2 heures', 'price' => 60.00]
        );

        // Categories & Products for Laundry 1
        $cat1 = Category::firstOrCreate(['name' => 'Vêtements']);
        Product::firstOrCreate(
            ['name' => 'Chemise', 'category_id' => $cat1->id],
            ['description' => 'Lavage et repassage chemise', 'price' => 20.00, 'image' => null]
        );
        Product::firstOrCreate(
            ['name' => 'Pantalon', 'category_id' => $cat1->id],
            ['description' => 'Lavage et repassage pantalon', 'price' => 25.00, 'image' => null]
        );
        Product::firstOrCreate(
            ['name' => 'Costume complet', 'category_id' => $cat1->id],
            ['description' => 'Nettoyage à sec costume 2 pièces', 'price' => 80.00, 'image' => null]
        );

        $cat2 = Category::firstOrCreate(['name' => 'Linge de maison']);
        Product::firstOrCreate(
            ['name' => 'Drap', 'category_id' => $cat2->id],
            ['description' => 'Lavage drap 2 places', 'price' => 35.00, 'image' => null]
        );
        Product::firstOrCreate(
            ['name' => 'Couette', 'category_id' => $cat2->id],
            ['description' => 'Lavage couette', 'price' => 60.00, 'image' => null]
        );
        Product::firstOrCreate(
            ['name' => 'Rideau', 'category_id' => $cat2->id],
            ['description' => 'Lavage et repassage rideau', 'price' => 45.00, 'image' => null]
        );

        // Delivery for Laundry 1
        Delivery::firstOrCreate(
            ['laundry_id' => $laundry1->id],
            ['type' => 'fixed', 'fixed_price' => 20.00, 'price_per_km' => null, 'min_order' => 100.00]
        );

        // --- Laundry 2 ---
        $laundry2 = Laundry::firstOrCreate(
            ['name' => 'Blanchisserie Royale', 'provider_id' => $provider->id],
            [
                'address' => '45 Bd Zerktouni, Gauthier, Casablanca',
                'phone' => '0522556677',
                'email' => 'contact@royale-pressing.ma',
                'description' => 'Blanchisserie haut de gamme avec service de ramassage et livraison.',
                'logo' => 'https://ui-avatars.com/api/?name=Royale&background=059669&color=fff&size=128',
                'bigLogo' => 'https://ui-avatars.com/api/?name=Royale&background=059669&color=fff&size=512',
            ]
        );

        Service::firstOrCreate(
            ['name' => 'Lavage premium', 'laundry_id' => $laundry2->id],
            ['icon' => '👑', 'description' => 'Lavage premium avec produits bio', 'price' => 45.00]
        );
        Service::firstOrCreate(
            ['name' => 'Détachage', 'laundry_id' => $laundry2->id],
            ['icon' => '🫧', 'description' => 'Traitement spécial des taches difficiles', 'price' => 35.00]
        );

        Delivery::firstOrCreate(
            ['laundry_id' => $laundry2->id],
            ['type' => 'free_above', 'fixed_price' => 15.00, 'price_per_km' => null, 'min_order' => 150.00]
        );

        // --- Laundry 3 ---
        $provider2 = Provider::firstOrCreate(
            ['email' => 'provider2@test.com'],
            [
                'laudry_name' => 'QuickWash',
                'provider_name' => 'Sara Benali',
                'password' => bcrypt('password'),
                'phone' => '0600000002',
                'address' => 'Rabat, Agdal',
            ]
        );

        $laundry3 = Laundry::firstOrCreate(
            ['name' => 'QuickWash Agdal', 'provider_id' => $provider2->id],
            [
                'address' => '8 Av. Fal Ould Oumeir, Agdal, Rabat',
                'phone' => '0537889900',
                'email' => 'agdal@quickwash.ma',
                'description' => 'Laverie en libre-service et pressing rapide à Agdal.',
                'logo' => 'https://ui-avatars.com/api/?name=QuickWash&background=DC2626&color=fff&size=128',
                'bigLogo' => 'https://ui-avatars.com/api/?name=QuickWash&background=DC2626&color=fff&size=512',
            ]
        );

        Service::firstOrCreate(
            ['name' => 'Libre-service', 'laundry_id' => $laundry3->id],
            ['icon' => '🏪', 'description' => 'Machine en libre-service (8kg)', 'price' => 25.00]
        );
        Service::firstOrCreate(
            ['name' => 'Lavage & pliage', 'laundry_id' => $laundry3->id],
            ['icon' => '📦', 'description' => 'On lave, sèche et plie pour vous', 'price' => 40.00]
        );

        Delivery::firstOrCreate(
            ['laundry_id' => $laundry3->id],
            ['type' => 'distance', 'fixed_price' => null, 'price_per_km' => 5.00, 'min_order' => 50.00]
        );
    }
}
