# syntax=docker/dockerfile:1

# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build CRM
FROM node:20-slim AS crm-builder
WORKDIR /app/crm
COPY crm/package*.json ./
RUN npm install
COPY crm/ ./
RUN npm run build

# Stage 3: Production Server
FROM node:20-slim
WORKDIR /app

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY backend/ ./backend/
# Copy builds from stages 1 and 2
COPY --from=frontend-builder /app/backend/public ./backend/public
COPY --from=crm-builder /app/backend/public/admin ./backend/public/admin

# Setup Environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Run migrations and start
WORKDIR /app/backend
CMD npx prisma migrate deploy && npm start
