# ─── Build stage ───────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps & compile
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile
COPY src ./src
RUN yarn build

# ─── Runtime image ─────────────────────────────────────────────────────────────
FROM node:18-alpine
WORKDIR /app

# Copy built app and deps
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Environment defaults (override in compose)
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001
CMD ["node", "dist/index.js"]
