# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TypeScript code
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV SECRET=epytodo

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy necessary files
COPY --from=builder /app/dist/index.js ./dist/index.js

# Set correct permissions
RUN chown -R expressjs:nodejs /app

# Switch to non-root user
USER expressjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]