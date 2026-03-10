# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Fichiers nécessaires pour l’install et le build
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install (dont devDependencies pour le build)
RUN npm ci

# Prisma client + build Nest
RUN npx prisma generate
COPY . .
RUN npm run build

# Run stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Dépendances de prod uniquement
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci --omit=dev && npx prisma generate
COPY --from=builder /app/dist ./dist

# Migrations au démarrage (DATABASE_URL injectée par Railway), puis l’API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
