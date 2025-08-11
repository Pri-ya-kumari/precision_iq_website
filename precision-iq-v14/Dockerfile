# Stage 1: Build the Angular app
FROM node:18-alpine AS build

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the Angular app in production mode
RUN ng build --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built Angular app to Nginx's HTML directory
COPY --from=build /app/dist/precizion /usr/share/nginx/html

# Replace default Nginx config (optional, if you have a custom one)
COPY nginx.conf /etc/nginx/conf.d/default.conf
