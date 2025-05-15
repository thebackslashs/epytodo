# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy migration files and TypeScript config
COPY migrate.ts ./
COPY epytodo.sql ./
COPY tsconfig.json ./

# Build TypeScript to JavaScript
RUN npx tsc --outDir ./dist

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# Environment variables
ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/dist/migrate.js ./
COPY --from=builder /app/epytodo.sql ./
COPY --from=builder /app/node_modules ./node_modules

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Set correct permissions
RUN chown -R expressjs:nodejs /app

# Switch to non-root user
USER expressjs

# Start the migration
CMD ["node", "migrate.js"] 