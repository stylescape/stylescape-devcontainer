#!/bin/bash

# =============================================================================
# Logging
# =============================================================================
echo "Entering Entrypoint"

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

# Function to handle errors
error_exit() {
    echo "Error on line $1"
    exit 1
}
trap 'error_exit $LINENO' ERR

# Function to check required environment variables
check_env_vars() {
    echo "Checking required environment variables..."
    : "${NODE_ENV?Need to set NODE_ENV}"
    echo "NODE_ENV is set to '$NODE_ENV'"
}

# =============================================================================
# Main Entrypoint
# =============================================================================

# Check environment variables
check_env_vars

# Execute the main command passed as arguments to the script
echo "Executing command: $*"
exec "$@"