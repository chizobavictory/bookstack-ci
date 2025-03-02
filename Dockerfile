# Use Node.js 18 with Alpine for a lightweight image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the app into the container
COPY . .

# Build the TypeScript app
RUN yarn build

# Expose the port (match the port your app uses in app.ts)
EXPOSE 6000

# Command to run the compiled app
CMD ["node", "dist/app.js"]
