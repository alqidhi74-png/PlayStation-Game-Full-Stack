# Use Node.js 20 as base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Command to run Vite development server
CMD ["npm", "run", "dev"]
