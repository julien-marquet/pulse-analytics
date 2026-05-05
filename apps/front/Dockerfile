ARG NODE_VERSION=24.13.0-slim

FROM node:${NODE_VERSION} AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune @app/front --docker

FROM node:${NODE_VERSION} AS installer
WORKDIR /app
# Install only front's deps using pruned lockfile
COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .
ENV NODE_ENV=production
RUN npm run build --workspace=apps/front
# Flatten standalone output: move apps/front/* up to standalone root
RUN cd apps/front/.next/standalone && \
    cp -rn apps/front/. . && \
    rm -rf apps

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=node:node /app/apps/front/public ./public

RUN mkdir .next
RUN chown node:node .next

COPY --from=builder --chown=node:node /app/apps/front/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/front/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]