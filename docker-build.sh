#!/bin/bash

# PranaJiva Storefront - Docker Build Script
# Usage: ./docker-build.sh [dev|prod]

set -e

ENVIRONMENT="${1:-dev}"

echo "=== PranaJiva Storefront Docker Build ==="
echo "Environment: $ENVIRONMENT"
echo ""

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo "Error: Invalid environment. Use 'dev' or 'prod'"
    exit 1
fi

# Load environment variables based on environment
if [ "$ENVIRONMENT" == "prod" ]; then
    ENV_FILE=".env.production"
    if [ ! -f "$ENV_FILE" ]; then
        echo "Error: $ENV_FILE not found"
        echo "Creating sample $ENV_FILE file..."
        cat > "$ENV_FILE" << EOF
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.pranajiva.com
NEXT_PUBLIC_SANITY_PROJECT_ID=5ehhoj92
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_here
EOF
        echo "Please edit $ENV_FILE with your production values"
        exit 1
    fi
else
    ENV_FILE=".env.local"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running"
    echo "Please start Docker and try again"
    exit 1
fi

# Build the image
echo "Building Docker image..."
echo ""

if [ "$ENVIRONMENT" == "prod" ]; then
    docker-compose --env-file "$ENV_FILE" build
else
    docker-compose build
fi

echo ""
echo "=== Build Complete ==="
echo ""
echo "To run the container:"
echo "  docker-compose up -d"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the container:"
echo "  docker-compose down"
echo ""
