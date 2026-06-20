FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm ci

FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./

RUN npm ci --only=production

COPY . .

USER node

EXPOSE 5001

ENV NODE_ENV=production

CMD ["node","src/server.js"]