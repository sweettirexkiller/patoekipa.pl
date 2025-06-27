#!/bin/sh

# Azure App Service startup script for Next.js application

# Set the port - Azure App Service uses WEBSITES_PORT or PORT
export PORT=${WEBSITES_PORT:-${PORT:-8080}}

# Set hostname to accept connections from all interfaces
export HOSTNAME=${HOSTNAME:-"0.0.0.0"}

echo "=== Azure App Service Next.js Startup ==="
echo "PORT: $PORT"
echo "HOSTNAME: $HOSTNAME"
echo "NODE_ENV: $NODE_ENV"
echo "Working directory: $(pwd)"
echo "Files in directory:"
ls -la

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "ERROR: server.js not found!"
    exit 1
fi

echo "Starting Next.js application..."

# Start the Next.js server
exec node server.js 