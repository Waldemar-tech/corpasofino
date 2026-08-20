# ═══════════════════════════════════════════════════════════════
#  Despliegue en Railway — build de Astro + Caddy sirviendo estático
# ═══════════════════════════════════════════════════════════════
#
#  Se usa Docker en vez de dejar que Railway adivine (Nixpacks)
#  porque así el build es idéntico en tu máquina y en producción:
#  si funciona local, funciona allá. Sin sorpresas a medianoche.
#
#  El resultado final es una imagen de ~50 MB con Caddy y HTML
#  estático. No hay Node corriendo en producción, o sea que no hay
#  proceso que se caiga, no hay memoria que se fugue y el consumo
#  de Railway se mantiene en el mínimo.

# ── Etapa 1: construir ──────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Copiamos primero los manifiestos para que Docker cachee la capa
# de dependencias: mientras package.json no cambie, npm ci no
# se vuelve a ejecutar y el deploy baja de minutos a segundos.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Etapa 2: servir ─────────────────────────────────────────────
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

# Railway inyecta PORT en tiempo de ejecución; el Caddyfile lo lee.
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
