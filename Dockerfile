# --- builder ---------------------------------------------------------------
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- runner ----------------------------------------------------------------
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat \
    && addgroup -S nodejs && adduser -S -G nodejs nextjs

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    PORTAL_DB_PATH=/data/portal.db \
    PORTAL_SCREENSHOTS_DIR=/data/screenshots

COPY --from=builder --chown=nextjs:nodejs /build/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /build/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /build/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder --chown=nextjs:nodejs /build/node_modules/bindings ./node_modules/bindings
COPY --from=builder --chown=nextjs:nodejs /build/node_modules/file-uri-to-path ./node_modules/file-uri-to-path

RUN mkdir -p /data && chown -R nextjs:nodejs /data

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
