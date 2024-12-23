# Dockerfile

# Use the official Node.js LTS image
FROM node:23

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the application's port
EXPOSE 5000

# Define the command to run the application
CMD [ "npm", "start" ]
