#     __               __
#    |__) |  | | |    |  \
#    |__) \__/ | |___ |__/

# initialize global scope build args by supplying --build-arg flag in podman build
ARG BACKEND_VERSION
ARG ENVIRONMENT
ARG CLOUD_DB
ARG NGINX_CONF
ARG BACKEND_PORT

FROM node:20.12.2-alpine3.19 AS build
WORKDIR /build-dir/
# copy required files for installation and compilation
COPY package-lock.json ./
COPY package.json ./
COPY tsconfig.json ./
# run full installation
RUN npm ci
COPY src/ ./src
RUN npm run build

#     __   __   __   __        __  ___    __
#    |__) |__) /  \ |  \ |  | /  `  |  | /  \ |\ |
#    |    |  \ \__/ |__/ \__/ \__,  |  | \__/ | \|
FROM node:20.12.2-alpine3.19

# add non priviledged system users to run their respective services
RUN addgroup -g 101 -S nginx && adduser -S -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx nginx
RUN addgroup -g 1001 -S nodejs && adduser -S -H -u 1001 -s /sbin/nologin -G nodejs nodejs

# Set up Build Directory
WORKDIR /fiscalismia-backend/
COPY package-lock.json ./
COPY package.json ./
COPY LICENSE ./
# consume build arguments to expose them in subsequent stages
ARG BACKEND_VERSION
ARG ENVIRONMENT
ARG CLOUD_DB
ARG NGINX_CONF
ARG BACKEND_PORT
# init environment variables /w build arguments, then read in supervisord.conf
ENV BACKEND_VERSION=$BACKEND_VERSION
ENV ENVIRONMENT=$ENVIRONMENT
ENV CLOUD_DB=$CLOUD_DB

# Install production packages
RUN npm ci --omit=dev
COPY --from=build /build-dir/dist ./dist

# copy db init scripts for on-demand user schema creation
COPY database/pgsql-public-ddl.sql ./database/pgsql-public-ddl.sql
COPY database/pgsql-user-ddl.sql ./database/pgsql-user-ddl.sql
COPY database/pgsql-demo-dml.sql ./database/pgsql-demo-dml.sql

# Install Nginx (which adds nginx user) and Supervisor
RUN apk add --no-cache nginx supervisor

# Create nginx and supervisor Directories
RUN mkdir -p /var/log/supervisor /etc/nginx/certs

# Copy nginx and Supervisor config
ARG NGINX_CONF
COPY $NGINX_CONF /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Change Ownership of directories according to users
RUN chown -R root:root /var/log/supervisor
RUN chown -R nginx:nginx /etc/nginx/certs/
RUN chown -R nodejs:nodejs /fiscalismia-backend

# Listen on HTTP/S Port
ARG BACKEND_PORT
EXPOSE $BACKEND_PORT

# Start Supervisor to manage the Nginx and NodeJS unix processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
