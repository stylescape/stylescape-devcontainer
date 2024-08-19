#!/bin/bash

# =============================================================================
# Logging
# =============================================================================
echo "Starting Application"

# =============================================================================
# Bash options
# =============================================================================

# if any of the commands in your code fails for any reason, the entire script fails
set -o errexit
# fail exit if one of your pipe command fails
set -o pipefail
# exits if any of your variables is not set
set -o nounset

# =============================================================================
# Functions
# =============================================================================

# Function to check if the service is available
wait_for_service() {
    local service_url=$1
    local retry_count=0
    local max_retries=10
    local sleep_seconds=5
    
    echo "Waiting for service at $service_url to be available..."

    until curl --output /dev/null --silent --head --fail "$service_url"; do
        retry_count=$((retry_count + 1))
        if [ $retry_count -ge $max_retries ]; then
            echo "Service at $service_url is not available after $max_retries attempts. Exiting."
            exit 1
        fi
        echo "Service not available yet. Retrying in $sleep_seconds seconds..."
        sleep $sleep_seconds
    done

    echo "Service at $service_url is available!"
}

# =============================================================================
# Pre-start Tasks
# =============================================================================

# Example: Wait for a dependent service to be available
# wait_for_service http://database:5432

# Example: Run database migrations
# echo "Running database migrations..."
# npm run migrate

# =============================================================================
# Start Application
# =============================================================================

echo "Starting application with NODE_ENV=$NODE_ENV"
npm start
