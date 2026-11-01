#!/bin/sh
set -e

echo "==> Preparing Harry AVer Application..."

# Fix storage & cache permissions
mkdir -p /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Create storage symlink if not already created
if [ ! -L /var/www/html/public/storage ]; then
    echo "==> Creating storage link..."
    php artisan storage:link || true
fi

# Wait for MySQL to be ready
if [ "$DB_CONNECTION" = "mysql" ]; then
    echo "==> Waiting for MySQL host ($DB_HOST:$DB_PORT) to be ready..."
    until nc -z -v -w30 "$DB_HOST" "$DB_PORT"; do
        echo "Waiting for database connection..."
        sleep 2
    done
    echo "==> Database is reachable."
fi

# Run database migrations
echo "==> Running migrations..."
php artisan migrate --force

echo "==> Harry Application is ready!"

# Execute main command (defaults to php-fpm)
exec "$@"

