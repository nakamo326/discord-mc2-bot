FROM node:18-slim

WORKDIR /nodejs

RUN apt-get update && apt-get install -y \
  zip \
  && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /entrypoint.sh

RUN npm init -y && npm install discord-interactions
