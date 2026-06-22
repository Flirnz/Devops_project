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

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

CMD ["node","src/server.js"]