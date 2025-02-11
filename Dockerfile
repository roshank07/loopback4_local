# Check out https://hub.docker.com/_/node to select a new base image
FROM docker.io/library/node:18-slim

# Set to a non-root built-in user `node`
USER node

# Set the working directory inside the container
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y vim


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

RUN npm run clean
RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD [ "node", "."]
