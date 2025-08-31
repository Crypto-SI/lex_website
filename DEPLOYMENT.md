# Deployment Guide

This document provides comprehensive instructions for deploying the Lex Consulting website using Docker.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Git (for version control)

## Quick Start

### Development Deployment

```bash
# Start development environment
npm run deploy:dev

# Or manually with Docker Compose
docker-compose up --build web-dev
```

Access the application at: http://localhost:3002

### Production Deployment

```bash
# Deploy production environment
npm run deploy:prod

# Or manually with Docker Compose
docker-compose -f docker-compose.prod.yml up --build
```

Access the application at: http://localhost:80

### Production with Nginx

```bash
# Deploy with Nginx reverse proxy
npm run deploy:prod-nginx

# Or manually
docker-compose -f docker-compose.prod.yml --profile nginx up --build
```

## Deployment Environments

### 1. Development Environment

**File**: `docker-compose.yml` (web-dev service)
**Dockerfile**: `Dockerfile.dev`
**Port**: 3002
**Features**:
- Hot reloading
- Development dependencies
- Volume mounts for live code changes
- Debug logging

**Environment Variables**:
```bash
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
WATCHPACK_POLLING=true
```

### 2. Production Environment

**File**: `docker-compose.prod.yml`
**Dockerfile**: `Dockerfile`
**Port**: 80
**Features**:
- Multi-stage build optimization
- Minimal production image
- Health checks
- Resource limits
- Security hardening

**Environment Variables**:
```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 3. Production with Nginx

**Additional Features**:
- SSL/TLS termination
- Gzip compression
- Static file caching
- Rate limiting
- Security headers

## Build Optimization Features

### Multi-Stage Docker Build

The production Dockerfile uses a multi-stage build:

1. **Dependencies Stage**: Installs only production dependencies
2. **Builder Stage**: Builds the application
3. **Runner Stage**: Creates minimal runtime image

### Caching Strategies

- **Layer Caching**: Dependencies are cached separately from source code
- **Build Cache**: Webpack build cache is optimized
- **Static Assets**: Nginx caches static files with long expiration

### Security Hardening

- **Non-root User**: Application runs as `nextjs` user (UID 1001)
- **Minimal Base Image**: Uses Alpine Linux for smaller attack surface
- **Security Headers**: Comprehensive security headers via Nginx
- **Resource Limits**: CPU and memory limits in production

## Health Checks

### Automated Health Checks

Docker containers include built-in health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
```

### Manual Health Checks

```bash
# Check development environment
npm run health-check:dev

# Check production environment
npm run health-check:prod

# Custom health check
npm run health-check [port] [host] [timeout]
```

### Health Check Features

- **HTTP Endpoint Testing**: Validates main application routes
- **Docker Container Status**: Checks container health
- **Performance Metrics**: Measures response times
- **SSL Validation**: Verifies SSL certificates (HTTPS)

## Deployment Scripts

### Deploy Script (`scripts/deploy.sh`)

Comprehensive deployment automation:

```bash
# Development
./scripts/deploy.sh development

# Production
./scripts/deploy.sh production

# Production with Nginx
./scripts/deploy.sh production-nginx
```

**Features**:
- Pre-deployment validation
- Build optimization
- Health check verification
- Rollback capabilities
- Cleanup utilities

### Health Check Script (`scripts/health-check.sh`)

Detailed application monitoring:

```bash
# Basic health check
./scripts/health-check.sh

# Custom configuration
./scripts/health-check.sh 3000 localhost 30
```

## Environment Configuration

### Environment Variables

Create `.env.local` for local configuration:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Lex Consulting
NEXT_PUBLIC_APP_URL=https://lexconsulting.com
NEXT_PUBLIC_VERSION=1.0.0

# Build Configuration
ESLINT_NO_DEV_ERRORS=true
TYPESCRIPT_NO_BUILD_ERRORS=true

# External Services
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username

# Security
CSRF_SECRET=your-csrf-secret-here
```

### Docker Environment Files

- **Development**: Uses `.env.local` and docker-compose environment
- **Production**: Uses environment variables from deployment system

## SSL/TLS Configuration

### Development

Development uses HTTP only for simplicity.

### Production with Nginx

1. **Certificate Files**: Place SSL certificates in `./ssl/` directory
   - `cert.pem`: SSL certificate
   - `key.pem`: Private key

2. **Nginx Configuration**: Update `nginx.conf` with your domain:
   ```nginx
   server_name your-domain.com;
   ssl_certificate /etc/nginx/ssl/cert.pem;
   ssl_certificate_key /etc/nginx/ssl/key.pem;
   ```

3. **Let's Encrypt Integration**: For automatic SSL certificates:
   ```bash
   # Add Certbot service to docker-compose.prod.yml
   certbot:
     image: certbot/certbot
     volumes:
       - ./ssl:/etc/letsencrypt
     command: certonly --webroot --webroot-path=/var/www/certbot --email your-email@domain.com --agree-tos --no-eff-email -d your-domain.com
   ```

## Monitoring and Logging

### Container Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs web

# View last N lines
docker-compose logs --tail=50
```

### Performance Monitoring

```bash
# Container resource usage
docker stats

# System resource usage
docker system df

# Container inspection
docker inspect <container-id>
```

### Log Aggregation

For production, consider integrating with log aggregation services:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Fluentd
- Prometheus + Grafana

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

2. **Port Conflicts**
   ```bash
   # Check port usage
   lsof -i :3000
   
   # Kill process using port
   kill -9 <PID>
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   
   # Fix Docker socket permissions
   sudo chmod 666 /var/run/docker.sock
   ```

4. **Memory Issues**
   ```bash
   # Increase Docker memory limit
   # Docker Desktop: Settings > Resources > Memory
   
   # Check container memory usage
   docker stats --no-stream
   ```

### Debug Mode

Enable debug logging:

```bash
# Development
DEBUG=* npm run dev

# Docker development
docker-compose -f docker-compose.yml up web-dev --build
```

### Health Check Failures

```bash
# Manual health check
curl -f http://localhost:3000/

# Check container health
docker inspect --format='{{.State.Health.Status}}' <container-id>

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' <container-id>
```

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed (if using HTTPS)
- [ ] Domain DNS configured
- [ ] Firewall rules configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Log aggregation configured
- [ ] Health checks validated
- [ ] Performance testing completed
- [ ] Security scan completed

## Scaling and Load Balancing

### Horizontal Scaling

```yaml
# docker-compose.prod.yml
services:
  web:
    deploy:
      replicas: 3
    # ... other configuration
```

### Load Balancer Configuration

Update Nginx configuration for multiple backend servers:

```nginx
upstream nextjs {
    server web_1:3000;
    server web_2:3000;
    server web_3:3000;
}
```

## Backup and Recovery

### Database Backup (if applicable)

```bash
# Backup volumes
docker run --rm -v lex_data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

### Application Backup

```bash
# Backup application files
tar -czf lex-backup-$(date +%Y%m%d).tar.gz --exclude=node_modules --exclude=.git .
```

### Recovery Process

```bash
# Restore from backup
tar -xzf lex-backup-YYYYMMDD.tar.gz

# Rebuild and deploy
npm run deploy:prod
```

## Support and Maintenance

### Regular Maintenance Tasks

1. **Update Dependencies**: Monthly security updates
2. **Log Rotation**: Prevent disk space issues
3. **Performance Monitoring**: Track Core Web Vitals
4. **Security Scans**: Regular vulnerability assessments
5. **Backup Verification**: Test backup restoration

### Getting Help

- **Documentation**: Check this deployment guide
- **Logs**: Review application and container logs
- **Health Checks**: Run comprehensive health checks
- **Community**: Next.js and Docker communities