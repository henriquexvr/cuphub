# ─────────────────────────────────────────────────────────────────────────────
# CupHub front-end — build Vite estático servido pelo Caddy
# Contexto de build: src/front  (Root Directory no Railway)
# ─────────────────────────────────────────────────────────────────────────────

# ---- build ----
FROM node:22-alpine AS build
# URL da API é build-time no Vite; o Railway injeta as variáveis como build args
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- serve ----
# Caddy escuta em $PORT (Railway) e faz fallback de SPA para o index.html
FROM caddy:2-alpine
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
