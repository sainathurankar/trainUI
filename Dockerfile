# Use Node.js version 12.18.3
FROM node:14-alpine

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
RUN ng test

# Build the Angular app for production
RUN ng build

# Expose the port the app runs on
EXPOSE 80

# Start the Angular app in production mode
CMD ["./node_modules/.bin/ng", "serve", "--host", "0.0.0.0", "--disable-host-check", "--port", "80"]
