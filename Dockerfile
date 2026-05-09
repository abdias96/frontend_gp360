# syntax=docker/dockerfile:1.7

# ===== Stage 1: build =====
FROM node:20-alpine AS build
WORKDIR /app

# Argumentos de build (override por entorno)
ARG VITE_APP_API_URL=/api
ARG VITE_APP_FRONTEND_URL=
ARG VITE_APP_NAME=GP360
ARG VITE_APP_VERSION=1.0.0
ARG VITE_APP_FULL_NAME="Gestión Penitenciaria 360"

ENV VITE_APP_API_URL=$VITE_APP_API_URL \
    VITE_APP_FRONTEND_URL=$VITE_APP_FRONTEND_URL \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_APP_VERSION=$VITE_APP_VERSION \
    VITE_APP_FULL_NAME=$VITE_APP_FULL_NAME \
    NODE_OPTIONS=--max-old-space-size=8192

COPY package*.json ./
RUN npm ci

COPY . .

# Build sin type-check estricto; el proyecto Metronic puede tener warnings residuales
RUN npm run build:no-check

# ===== Stage 2: runtime nginx =====
FROM nginx:1.27-alpine AS runtime

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV BACKEND_URL=http://host.docker.internal:8000 \
    BACKEND_PROXY_TIMEOUT=60s \
    NGINX_HOST=_

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
