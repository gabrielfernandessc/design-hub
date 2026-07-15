FROM oven/bun:1.3.14 AS base

# Install dependencies
WORKDIR /app
COPY package.json bun.lockb* ./
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/
COPY packages/config/package.json ./packages/config/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api-client/package.json ./packages/api-client/
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN bun run build

# Production
FROM oven/bun:1.3.14 AS production
WORKDIR /app
COPY --from=base /app .

EXPOSE 3000
CMD ["bun", "run", "--filter=@design-hub/web", "start"]
