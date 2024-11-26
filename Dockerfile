# Use Node.js official image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

RUN apt install -y vim

# Install dependencies
COPY package*.json ./
RUN npm install


# Expose the port your app uses
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
