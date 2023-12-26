# Use Node.js version 14
FROM node:14-alpine as builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli@12

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run linting
RUN ng lint

# Run tests
# RUN ng test

# Build the Angular app for production
RUN ng build

# Production stage
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built app from the previous stage
COPY --from=builder /app/dist/trainUI /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
