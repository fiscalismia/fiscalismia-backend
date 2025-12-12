#     __               __
#    |__) |  | | |    |  \
#    |__) \__/ | |___ |__/
ARG BUILD_VERSION

FROM node:20.12.2-alpine3.19 AS build
WORKDIR /build-dir/
COPY package-lock.json ./
COPY package.json ./
COPY tsconfig.json ./
RUN npm ci
COPY src/ ./src
RUN npm run build

#     __   __   __   __        __  ___    __
#    |__) |__) /  \ |  \ |  | /  `  |  | /  \ |\ |
#    |    |  \ \__/ |__/ \__/ \__,  |  | \__/ | \|
ARG BUILD_VERSION

FROM node:20.12.2-alpine3.19

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set up Build Directory
WORKDIR /fiscalismia-backend/
COPY package-lock.json ./
COPY package.json ./
COPY LICENSE ./
ENV BUILD_VERSION=$BUILD_VERSION
ENV NODE_ENV="production"

# Install production packages
RUN npm ci --only=production
COPY --from=build /build-dir/dist ./dist

# copy db init scripts for on-demand user schema creation
COPY database/pgsql-public-ddl.sql ./database/pgsql-public-ddl.sql
COPY database/pgsql-user-ddl.sql ./database/pgsql-user-ddl.sql
COPY database/pgsql-demo-dml.sql ./database/pgsql-demo-dml.sql

# Install Nginx (which adds nginx user) and Supervisor
RUN apk add --no-cache nginx supervisor

# Create Logging and Process ID File Directories
RUN mkdir -p /run/nginx /var/log/supervisor /var/log/nginx

# Copy nginx and Supervisor config
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Change Ownership of directories according to users
RUN chown -R root:root /var/log/supervisor
RUN chown -R nginx:nginx /run/nginx /var/log/nginx
RUN chown -R nodejs:nodejs /fiscalismia-backend

# Port 80 would require root priviliges
EXPOSE 8080

# Start Supervisor to manage Nginx and Uvicorn
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]