# syntax=docker/dockerfile:1
FROM node:24.14.0 AS build

WORKDIR /app

COPY package*.json ./
COPY scripts/patch-routify-esm.cjs scripts/
RUN npm ci

COPY . ./
RUN npm run build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
