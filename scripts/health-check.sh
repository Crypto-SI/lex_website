#!/bin/bash

# Health check script for Lex Consulting website
set -e

# Configuration
PORT=${1:-3000}
HOST=${2:-localhost}
TIMEOUT=${3:-30}

echo "🏥 Health Check for Lex Consulting Website"
echo "Target: http://$HOST:$PORT"
echo "Timeout: ${TIMEOUT}s"
echo ""

# Function to check HTTP endpoint
check_http() {
    local url=$1
    local description=$2
    
    echo -n "🔍 Checking $description... "
    
    if curl -f -s --max-time 10 "$url" > /dev/null 2>&1; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

# Function to check Docker container health
check_docker_health() {
    echo "🐳 Checking Docker container health..."
    
    # Get container status
    local containers=$(docker-compose ps --services --filter "status=running" 2>/dev/null || echo "")
    
    if [[ -z "$containers" ]]; then
        echo "❌ No running containers found"
        return 1
    fi
    
    echo "✅ Running containers: $containers"
    
    # Check container health status
    for container in $containers; do
        local health=$(docker inspect --format='{{.State.Health.Status}}' "$(docker-compose ps -q $container)" 2>/dev/null || echo "unknown")
        echo "   $container: $health"
    done
    
    return 0
}

# Function to check application endpoints
check_application() {
    local base_url="http://$HOST:$PORT"
    local failed=0
    
    echo "🌐 Checking application endpoints..."
    
    # Main endpoints to check
    local endpoints=(
        "/ (Homepage)"
        "/about (About page)"
        "/services (Services page)"
        "/contact (Contact page)"
    )
    
    for endpoint_info in "${endpoints[@]}"; do
        local endpoint=$(echo "$endpoint_info" | cut -d' ' -f1)
        local description=$(echo "$endpoint_info" | cut -d' ' -f2-)
        
        if ! check_http "$base_url$endpoint" "$description"; then
            ((failed++))
        fi
    done
    
    return $failed
}

# Function to check performance metrics
check_performance() {
    local base_url="http://$HOST:$PORT"
    
    echo "⚡ Checking performance metrics..."
    
    # Check response time for homepage
    local response_time=$(curl -o /dev/null -s -w '%{time_total}' --max-time 10 "$base_url/" 2>/dev/null || echo "timeout")
    
    if [[ "$response_time" == "timeout" ]]; then
        echo "❌ Homepage response: TIMEOUT"
        return 1
    else
        echo "✅ Homepage response time: ${response_time}s"
        
        # Check if response time is acceptable (< 3 seconds)
        if (( $(echo "$response_time > 3.0" | bc -l) )); then
            echo "⚠️  Warning: Response time is slow (> 3s)"
        fi
    fi
    
    return 0
}

# Function to check SSL/TLS (if HTTPS)
check_ssl() {
    if [[ "$PORT" == "443" ]]; then
        echo "🔒 Checking SSL/TLS configuration..."
        
        if openssl s_client -connect "$HOST:$PORT" -servername "$HOST" </dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
            echo "✅ SSL certificate is valid"
        else
            echo "❌ SSL certificate validation failed"
            return 1
        fi
    fi
    
    return 0
}

# Function to generate health report
generate_report() {
    local exit_code=$1
    
    echo ""
    echo "📊 Health Check Report"
    echo "====================="
    echo "Timestamp: $(date)"
    echo "Target: http://$HOST:$PORT"
    
    if [[ $exit_code -eq 0 ]]; then
        echo "Status: ✅ HEALTHY"
        echo "All checks passed successfully"
    else
        echo "Status: ❌ UNHEALTHY"
        echo "One or more checks failed"
    fi
    
    echo ""
    echo "💡 Troubleshooting tips:"
    echo "- Check if the application is running: docker-compose ps"
    echo "- View application logs: docker-compose logs"
    echo "- Restart services: docker-compose restart"
    echo "- Check system resources: docker stats"
}

# Main health check function
main() {
    local total_failed=0
    
    echo "Starting comprehensive health check..."
    echo ""
    
    # Run all health checks
    check_docker_health || ((total_failed++))
    echo ""
    
    check_application || ((total_failed++))
    echo ""
    
    check_performance || ((total_failed++))
    echo ""
    
    check_ssl || ((total_failed++))
    
    # Generate final report
    generate_report $total_failed
    
    # Exit with appropriate code
    if [[ $total_failed -eq 0 ]]; then
        echo "🎉 All health checks passed!"
        exit 0
    else
        echo "⚠️  $total_failed health check(s) failed"
        exit 1
    fi
}

# Script usage
usage() {
    echo "Usage: $0 [port] [host] [timeout]"
    echo ""
    echo "Arguments:"
    echo "  port     - Port to check (default: 3000)"
    echo "  host     - Host to check (default: localhost)"
    echo "  timeout  - Timeout in seconds (default: 30)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Check localhost:3000"
    echo "  $0 3002               # Check localhost:3002"
    echo "  $0 80 example.com     # Check example.com:80"
    echo "  $0 443 example.com 60 # Check HTTPS with 60s timeout"
}

# Handle script arguments
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    usage
    exit 0
fi

# Check if required tools are available
for tool in curl docker docker-compose; do
    if ! command -v $tool &> /dev/null; then
        echo "❌ Required tool '$tool' is not installed"
        exit 1
    fi
done

# Run main health check
main