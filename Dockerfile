# Use Node.js version 22 (required by Angular 22)
FROM node:22-alpine AS builder

# Set the working directory to /app
WORKDIR /app

# Copy manifests first for better layer caching
COPY package*.json ./

# Install project dependencies from the lockfile (reproducible)
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Run linting (unit tests run in CI, where a headless browser is available)
RUN npx ng lint

# Build the Angular app for production
RUN npx ng build --configuration production

# Production stage
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built app from the previous stage (flat output at dist/trainUI)
COPY --from=builder /app/dist/trainUI /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
