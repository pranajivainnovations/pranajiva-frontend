# PranaJiva Storefront - Docker Build Script
# Usage: ./docker-build.ps1 [dev|prod]

param(
    [Parameter(Position=0)]
    [ValidateSet('dev', 'prod')]
    [string]$Environment = 'dev'
)

Write-Host "=== PranaJiva Storefront Docker Build ===" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host ""

# Load environment variables based on environment
if ($Environment -eq 'prod') {
    $envFile = '.env.production'
    if (-not (Test-Path $envFile)) {
        Write-Host "Error: $envFile not found" -ForegroundColor Red
        Write-Host "Creating sample $envFile file..." -ForegroundColor Yellow
        @"
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.pranajiva.com
NEXT_PUBLIC_SANITY_PROJECT_ID=5ehhoj92
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_here
"@ | Out-File -FilePath $envFile -Encoding UTF8
        Write-Host "Please edit $envFile with your production values" -ForegroundColor Yellow
        exit 1
    }
} else {
    $envFile = '.env.local'
}

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "Error: Docker is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    exit 1
}

# Build the image
Write-Host "Building Docker image..." -ForegroundColor Green
Write-Host ""

if ($Environment -eq 'prod') {
    docker-compose --env-file $envFile build
} else {
    docker-compose build
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Build Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "To run the container:" -ForegroundColor Cyan
Write-Host "  docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "  docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "To stop the container:" -ForegroundColor Cyan
Write-Host "  docker-compose down" -ForegroundColor White
Write-Host ""
