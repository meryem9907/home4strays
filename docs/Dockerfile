# Stage 1: Build the Astro (Starlight) docs site
FROM node:lts AS builder

# Set working directory
WORKDIR /app

# Copy root project files (includes .gitmodules)
COPY . .

# Install dependencies in all packages
RUN npm ci
RUN cd home4strays-frontend && npm ci && cd ..
RUN cd home4strays-backend && npm ci && cd ..

# Build the Astro site
RUN npm run build

# Stage 2: Serve the site with a lightweight web server
FROM nginx:alpine

# Copy built files from the builder stage
COPY --from=builder /app/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
