#!/usr/bin/env bash

echo "Setting up Laravel application..."

php -v

echo "Installing composer dependencies..."
composer install --optimize-autoloader --no-dev

echo "Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Caching configurations..."
php artisan config:cache
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Deployment complete! Let's fucking go!"
