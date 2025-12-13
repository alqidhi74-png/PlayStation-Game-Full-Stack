# Use Node.js 20 as base image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose server port
EXPOSE 5000

# Command to run server in development mode with nodemon
CMD ["npm", "run", "dev"]
