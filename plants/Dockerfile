# Specify the base image
FROM node:alpine

# The type of directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --only=prod
COPY ./ ./

# Default Command
CMD ["npm", "start"]