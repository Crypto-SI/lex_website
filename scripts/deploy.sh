#!/bin/bash

# Deployment script for Lex Consulting website
set -e

# Configuration
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"
PROD_COMPOSE_FILE="docker-compose.prod.yml"

echo "🚀 Starting deployment for environment: $ENVIRONMENT"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to run pre-deployment checks
pre_deployment_checks() {
    echo "🔍 Running pre-deployment checks..."
    
    # Check if required files exist
    local required_files=("package.json" "next.config.js" "Dockerfile")
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            echo "❌ Required file $file not found"
            exit 1
        fi
    done
    
    # Run build check script
    if [[ -f "scripts/build-check.js" ]]; then
        echo "🔧 Running build checks..."
        node scripts/build-check.js
    fi
    
    echo "✅ Pre-deployment checks passed"
}

# Function to build and deploy
deploy() {
    local env=$1
    
    case $env in
        "development"|"dev")
            echo "🔧 Deploying development environment..."
            docker-compose -f $COMPOSE_FILE up --build web-dev -d
            ;;
        "production"|"prod")
            echo "🏭 Deploying production environment..."
            
            # Build production image
            docker-compose -f $PROD_COMPOSE_FILE build web
            
            # Stop existing containers
            docker-compose -f $PROD_COMPOSE_FILE down
            
            # Start production containers
            docker-compose -f $PROD_COMPOSE_FILE up -d
            ;;
        "production-nginx"|"prod-nginx")
            echo "🏭 Deploying production with Nginx..."
            docker-compose -f $PROD_COMPOSE_FILE --profile nginx up --build -d
            ;;
        *)
            echo "❌ Unknown environment: $env"
            echo "Available environments: development, production, production-nginx"
            exit 1
            ;;
    esac
}

# Function to run health checks
health_check() {
    local max_attempts=30
    local attempt=1
    local port=3000
    
    if [[ "$ENVIRONMENT" == "production"* ]]; then
        port=80
    elif [[ "$ENVIRONMENT" == "development" || "$ENVIRONMENT" == "dev" ]]; then
        port=3002
    fi
    
    echo "🏥 Running health checks on port $port..."
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1 || \
           curl -f -s "http://localhost:$port/" > /dev/null 2>&1; then
            echo "✅ Health check passed (attempt $attempt)"
            return 0
        fi
        
        echo "⏳ Health check failed, attempt $attempt/$max_attempts"
        sleep 5
        ((attempt++))
    done
    
    echo "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Function to show deployment status
show_status() {
    echo "📊 Deployment Status:"
    docker-compose ps
    echo ""
    echo "📋 Container Logs (last 20 lines):"
    docker-compose logs --tail=20
}

# Function to cleanup old images
cleanup() {
    echo "🧹 Cleaning up old Docker images..."
    docker image prune -f
    docker system prune -f --volumes
    echo "✅ Cleanup completed"
}

# Main deployment flow
main() {
    echo "🎯 Lex Consulting Website Deployment"
    echo "Environment: $ENVIRONMENT"
    echo "Timestamp: $(date)"
    echo ""
    
    check_docker
    pre_deployment_checks
    deploy "$ENVIRONMENT"
    
    echo "⏳ Waiting for services to start..."
    sleep 10
    
    if health_check; then
        echo "🎉 Deployment successful!"
        show_status
        
        # Optional cleanup
        read -p "🧹 Run cleanup? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cleanup
        fi
    else
        echo "❌ Deployment failed health checks"
        echo "📋 Recent logs:"
        docker-compose logs --tail=50
        exit 1
    fi
}

# Script usage
usage() {
    echo "Usage: $0 [environment]"
    echo "Environments:"
    echo "  development, dev     - Development environment (port 3002)"
    echo "  production, prod     - Production environment (port 80)"
    echo "  production-nginx     - Production with Nginx reverse proxy"
    echo ""
    echo "Examples:"
    echo "  $0 development"
    echo "  $0 production"
    echo "  $0 production-nginx"
}

# Handle script arguments
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    usage
    exit 0
fi

# Run main deployment
main