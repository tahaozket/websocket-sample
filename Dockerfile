FROM node:16.9.1-slim
WORKDIR /app
COPY . /app
RUN npm install
CMD node index.js

