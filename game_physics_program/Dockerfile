# Use an official Node.js runtime as a base image
FROM node:21.0.0-slim

# Set the working directory in the container
WORKDIR /game_physics_program

COPY . /game_physics_program

# Copy package.json and package-lock.json to the working directory
COPY ["package.json", "package-lock.json"]

# Install app dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]