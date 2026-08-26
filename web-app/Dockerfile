# ==========================================
# Stage 1 — Dependencies
# ==========================================

FROM node:22-alpine AS deps

WORKDIR /app

# Enable Corepack.
# package.json specifies pnpm@11.1.2.
RUN corepack enable

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Prisma schema is needed by Prisma tooling
COPY prisma ./prisma

# Install dependencies without running postinstall.
# Prisma Client will be generated explicitly in the builder stage.
RUN pnpm install --frozen-lockfile --ignore-scripts


# ==========================================
# Stage 2 — Build
# ==========================================

FROM node:22-alpine AS builder

WORKDIR /app

# Enable Corepack.
# Corepack reads packageManager from package.json.
RUN corepack enable

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy the entire application
COPY . .

# Prisma config requires DATABASE_URL during
# `prisma generate`.
#
# This is ONLY a dummy build-time value.
# It is NOT the production database URL.
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build Next.js
#
# package.json:
# "build": "prisma generate && next build"
#
# So Prisma generation happens again here.
RUN pnpm build
# ==========================================
# Stage 3 — Database Migration
# ==========================================

FROM builder AS migration

WORKDIR /app

CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]


# ==========================================
# Stage 3 — Production
# ==========================================

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Next.js standalone production server
COPY --from=builder \
    --chown=nextjs:nodejs \
    /app/.next/standalone ./

# Copy Next.js static assets
COPY --from=builder \
    --chown=nextjs:nodejs \
    /app/.next/static ./.next/static

# Run application as non-root user
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]