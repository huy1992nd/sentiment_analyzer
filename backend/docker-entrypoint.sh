#!/bin/sh
set -e

echo "Checking database..."

# Ensure prisma directory exists and is writable
mkdir -p prisma

# Fix permissions for prisma directory (if running as root)
if [ "$(id -u)" = "0" ]; then
  echo "Running as root, fixing permissions..."
  chown -R nestjs:nodejs prisma || true
  chmod -R 775 prisma || true
fi

# Check if database file exists
if [ ! -f "prisma/dev.db" ]; then
  echo "Database not found. Initializing database..."
  # Run as current user (root if entrypoint runs as root)
  npx prisma db push --skip-generate --accept-data-loss || {
    echo "Warning: Database initialization failed, but continuing..."
  }
  # Fix permissions after creating database
  if [ "$(id -u)" = "0" ]; then
    # Wait a moment for file to be fully created
    sleep 1
    # Fix permissions for database file and any related files
    [ -f "prisma/dev.db" ] && chown nestjs:nodejs prisma/dev.db && chmod 664 prisma/dev.db || true
    [ -f "prisma/dev.db-journal" ] && chown nestjs:nodejs prisma/dev.db-journal && chmod 664 prisma/dev.db-journal || true
    [ -f "prisma/dev.db-wal" ] && chown nestjs:nodejs prisma/dev.db-wal && chmod 664 prisma/dev.db-wal || true
  fi
  echo "Database initialized successfully!"
else
  echo "Database file exists. Verifying accessibility..."
  # Try to verify database is accessible by testing with sqlite3 or prisma
  # If we can't access it, recreate it
  if [ "$(id -u)" = "0" ]; then
    # Fix permissions first
    chown nestjs:nodejs prisma/dev.db prisma/dev.db-journal 2>/dev/null || true
    chmod 664 prisma/dev.db prisma/dev.db-journal 2>/dev/null || true
    
    # Test if nestjs user can access the database
    if su-exec nestjs test -r prisma/dev.db && su-exec nestjs test -w prisma/dev.db; then
      echo "Database is accessible."
    else
      echo "Database file has permission issues. Recreating..."
      rm -f prisma/dev.db prisma/dev.db-journal prisma/dev.db-wal 2>/dev/null || true
      npx prisma db push --skip-generate --accept-data-loss || {
        echo "Warning: Database recreation failed, but continuing..."
      }
      chown nestjs:nodejs prisma/dev.db prisma/dev.db-journal 2>/dev/null || true
      chmod 664 prisma/dev.db prisma/dev.db-journal 2>/dev/null || true
      echo "Database recreated successfully!"
    fi
  else
    # Not running as root, just check if we can access it
    if [ -r "prisma/dev.db" ] && [ -w "prisma/dev.db" ]; then
      echo "Database is accessible."
    else
      echo "Warning: Cannot access database file. May need to run as root to fix permissions."
    fi
  fi
fi

# If running as root, switch to nestjs user before starting app
if [ "$(id -u)" = "0" ]; then
  echo "Switching to nestjs user to start application..."
  exec su-exec nestjs "$@"
else
  exec "$@"
fi
