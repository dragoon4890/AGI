FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port that Vite preview uses, typically 4173 by default
EXPOSE 4173

# Command to run the application in preview mode
CMD ["npm", "run", "preview"]
