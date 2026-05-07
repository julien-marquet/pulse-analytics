ARG NODE_VERSION=24.13.0-slim

# ============================================
# Stage 1: Prune
# ============================================

FROM node:${NODE_VERSION} AS pruner
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund
RUN npx turbo prune @app/ingestion-worker --docker

# ============================================
# Stage 2: Build
# ============================================

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/node_modules ./node_modules

ENV NODE_ENV=production

RUN npx prisma generate --schema=packages/database/schema.prisma
RUN npm run build --workspace=apps/ingestion-worker

# ============================================
# Stage 4: Run
# ============================================

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/apps/ingestion-worker/dist .

USER node
CMD ["node", "main.js"]