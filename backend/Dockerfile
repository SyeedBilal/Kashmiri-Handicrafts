# Use the official Node image as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy the rest of backend files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
