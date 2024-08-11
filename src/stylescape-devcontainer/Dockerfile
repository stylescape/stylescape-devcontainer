# syntax=docker/dockerfile:1.4


# Base Image
# =============================================================================

# Use the official Node.js 18 image as the base image
FROM node:18-bullseye

# Set the working directory inside the container
WORKDIR /workspace

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    python3 \
    python3-pip \
    python3-venv \
    libsass-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages if needed
RUN npm install -g \
    typescript \
    eslint \
    prettier \
    sass \
    stylelint \
    @angular/cli

# Install Jinja2 CLI for template rendering (optional)
RUN pip3 install jinja2-cli

# Copy package.json and package-lock.json (if available) to leverage Docker cache
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Set environment variables
ENV NODE_ENV=development

# Expose any ports your app uses (for example, 3000 for Node.js apps)
EXPOSE 3000

# Command to run the application or start the development server
CMD ["npm", "start"]