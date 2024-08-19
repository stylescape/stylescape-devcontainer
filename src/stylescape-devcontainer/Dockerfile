# syntax=docker/dockerfile:1.4

# Base Image
# =============================================================================
# Use the official Ubuntu base image for maximum control over dependencies
FROM ubuntu:22.04 AS base

# Environment Variables
# =============================================================================
# Set environment variables to avoid prompts during installation and ensure compatibility
ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    PYTHONUNBUFFERED=1 \
    NODE_ENV=development

# System Dependencies
# =============================================================================
# Install essential packages, then clean up to reduce image size
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    ca-certificates \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    libffi-dev \
    python3.10 \
    python3-pip \
    python3-venv \
    libsass-dev \
    software-properties-common \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Node.js Installation
# =============================================================================
# Install Node.js (using NodeSource PPA) and global npm packages
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g \
    typescript@5.0.4 \
    eslint@8.40.0 \
    prettier@2.8.8 \
    sass@1.49.11 \
    stylelint@15.0.0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /workspace

# Python Dependencies
# =============================================================================
# Install Python dependencies specified in requirements.txt and Jinja2 CLI
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --upgrade pip \
    && pip3 install --no-cache-dir jinja2-cli==0.8.3 \
    && pip3 install --no-cache-dir -r requirements.txt

# Node.js Application Dependencies
# =============================================================================
# Copy package.json and package-lock.json to the container and install dependencies
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copy Application Code
# =============================================================================
# Copy the rest of the application code into the container
COPY . .

# Copy Entrypoint and Start Scripts
# =============================================================================
COPY /bin/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY /bin/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/start.sh

# Security Best Practices
# =============================================================================
# Add a non-root user and switch to it to improve security
RUN useradd -m -d /home/nodeuser -s /bin/bash nodeuser \
    && chown -R nodeuser:nodeuser /workspace
USER nodeuser

# Expose Ports
# =============================================================================
# Expose the port on which the app will run
EXPOSE 3000

# Health Check
# =============================================================================
# Add a health check to ensure the container is running correctly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Entrypoint
# =============================================================================
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start Command
# =============================================================================
CMD ["/usr/local/bin/start.sh"]