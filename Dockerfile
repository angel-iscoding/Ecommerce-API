# syntax=docker/dockerfile:1

FROM node:18-alpine AS deps
WORKDIR /usr/src

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar todas las dependencias para el build
# Use npm install since repository does not include a package-lock.json
RUN npm install

FROM node:18-alpine AS builder
WORKDIR /usr/src

# Copiar node_modules y configuraciones
COPY --from=deps /usr/src/node_modules ./node_modules
COPY --from=deps /usr/src/package*.json ./
COPY --from=deps /usr/src/tsconfig*.json ./
COPY --from=deps /usr/src/nest-cli.json ./

# Copiar código fuente
COPY src ./src

# Construir la aplicación
RUN npm run build

# Verificar que el build se creó correctamente
RUN ls -la dist/ && echo "Build completado - main.js está en dist/"

FROM node:18-alpine AS production
RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /usr/src

# Copiar package.json para producción
COPY package*.json ./

# Instalar solo dependencias de producción
# Use npm install --only=production to work without package-lock.json
RUN npm install --only=production --no-audit --no-fund && npm cache clean --force

# Copiar el build desde la etapa builder
COPY --from=builder --chown=nestjs:nodejs /usr/src/dist ./dist

USER nestjs

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]

# Usar dist/src/main.js
CMD ["node", "dist/main.js"]