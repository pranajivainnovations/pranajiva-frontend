# PranaJiva Storefront - Docker Deployment Guide

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)
- Medusa backend running (accessible at the configured URL)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the container:**
```bash
docker-compose up -d --build
```

2. **View logs:**
```bash
docker-compose logs -f pranajiva-storefront
```

3. **Stop the container:**
```bash
docker-compose down
```

### Option 2: Using Docker CLI

1. **Build the image:**
```bash
docker build -t pranajiva-storefront:latest \
  --build-arg NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9001 \
  --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=5ehhoj92 \
  --build-arg NEXT_PUBLIC_SANITY_DATASET=production \
  --build-arg NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key \
  .
```

2. **Run the container:**
```bash
docker run -d \
  --name pranajiva-storefront \
  -p 3000:3000 \
  -e NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9001 \
  -e NEXT_PUBLIC_SANITY_PROJECT_ID=5ehhoj92 \
  -e NEXT_PUBLIC_SANITY_DATASET=production \
  -e NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key \
  --restart unless-stopped \
  pranajiva-storefront:latest
```

3. **View logs:**
```bash
docker logs -f pranajiva-storefront
```

4. **Stop and remove the container:**
```bash
docker stop pranajiva-storefront
docker rm pranajiva-storefront
```

## Environment Variables

### Build-time Variables (ARG)
These are set during the build process:

- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Medusa backend URL (default: http://localhost:9001)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity CMS project ID (default: 5ehhoj92)
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset (default: production)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay public key

### Runtime Variables (ENV)
These can be overridden when running the container:

- `NODE_ENV` - Node environment (default: production)
- `PORT` - Server port (default: 3000)
- All `NEXT_PUBLIC_*` variables from build time

## Production Deployment

### Using .env file with Docker Compose

1. **Create a `.env.production` file:**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.pranajiva.com
NEXT_PUBLIC_SANITY_PROJECT_ID=5ehhoj92
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
```

2. **Build with production env:**
```bash
docker-compose --env-file .env.production up -d --build
```

### Cloud Deployment (AWS, GCP, Azure)

#### AWS ECR + ECS/Fargate

1. **Authenticate to ECR:**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

2. **Tag and push:**
```bash
docker tag pranajiva-storefront:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/pranajiva-storefront:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/pranajiva-storefront:latest
```

#### Google Cloud Run

1. **Build and push to GCR:**
```bash
gcloud builds submit --tag gcr.io/<project-id>/pranajiva-storefront
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy pranajiva-storefront \
  --image gcr.io/<project-id>/pranajiva-storefront \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.pranajiva.com
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs pranajiva-storefront

# Check if port 3000 is available
netstat -an | grep 3000
```

### Build fails
```bash
# Clear Docker cache and rebuild
docker builder prune -a
docker-compose build --no-cache
```

### Health check failing
```bash
# Check if application is responding
docker exec pranajiva-storefront wget -O- http://localhost:3000

# View health status
docker inspect pranajiva-storefront | grep -A 10 Health
```

### Backend connection issues
- Ensure Medusa backend URL is accessible from container
- For localhost backend, use `host.docker.internal` on Mac/Windows
- For Linux, use `--network=host` flag or configure bridge network

## Image Optimization

The Dockerfile uses multi-stage builds to minimize image size:
- **deps stage**: Installs production dependencies only
- **builder stage**: Builds the Next.js application
- **runner stage**: Creates minimal runtime image (~150MB)

## Security Features

- ✓ Non-root user (nextjs:nodejs)
- ✓ Minimal Alpine Linux base
- ✓ Health checks enabled
- ✓ Security headers configured
- ✓ Only necessary files copied
- ✓ Production-only dependencies

## Monitoring

### Health Check Endpoint
The container includes a health check that pings `http://localhost:3000` every 30 seconds.

### Resource Limits (Optional)
Add to docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          docker build -t pranajiva-storefront:${{ github.sha }} \
            --build-arg NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{ secrets.MEDUSA_URL }} \
            .
      
      - name: Push to registry
        run: |
          docker tag pranajiva-storefront:${{ github.sha }} your-registry/pranajiva-storefront:latest
          docker push your-registry/pranajiva-storefront:latest
```

## Support

For issues or questions:
- Check logs: `docker logs pranajiva-storefront`
- Container shell: `docker exec -it pranajiva-storefront sh`
- Inspect image: `docker inspect pranajiva-storefront:latest`
