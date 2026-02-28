# Fiscalismia Backend
Node.JS REST API Server handling authentication & all routes to the Postgres Database.
Fiscalismia is a Web Service for visualizing, analyzing, aggregating, importing and exporting personal finance data. Data can consist of variable and fixed costs, income, sales and investments, including taxes and dividends. The db also retains supermarket food prices and grocery deals, dynamically added and updated by the user.

## Technical Overview

fiscalismia-backend consists of an express server running a REST API. Requests from the frontend are handled by the backend's REST API querying data from a postgres db. The database runs within a docker container for development. JWT tokens are used for authentication. Local Browser Storage for Session Cookies. The REST API is designed with full CRUD operations in mind, allowing for dynamic user input, sanitized before being commited to the db. In production, we use a cloud-hosted scale-to-zero PostgreSQL database on Neon.tech with a generous free tier. The backend is built in a continuous integration pipeline, tested, scanned for vulnerabilities and published as a docker image to a public docker registry for later deployment on Hetzner VM's, orchestrated via Github Actions and OpenSSH via Bastion Host for access to Instances in private subnets.

## Table of Contents

- [Technologies](#technologies)
- [DevOps Pipeline](#pipeline)
- [Setup](#setup)
- [Running](#running)
- [Testing](#testing)
- [Usage](#usage)
- [Production & Deployment](#production)
- [License](#license)

## Technologies

- **Github Actions:** CI/CD Pipeline for automating type checking, eslint analysis, REST API testing, vulnerability scanning, building, publishing and deploying.
- **Docker:** The final build artifact from compiled src code is a docker image published to a registry and deployed in the cloud.
- **TypeScript:** Statically typed JS with high strictness level and compile target ESNext. Mid-project Migration from plain JavaScript (ECMAScript 2016).
- **Express Server:** A fast, unopinionated, minimalist web framework for Node.js, used to build the backend server.
- **Supertest:** A testing library for HTTP assertions, employed for REST API testing to ensure the reliability of the server.
- **JWT Auth:** JSON Web Token authentication is used for securing and verifying the authenticity of API requests.
- **Snyk:** Static Code security analysis, dependency security analysis, monitoring and notifications on detected security issues.
- **ESLint and Prettier:** Linter and Formatter for ensuring code quality and enforcing coding standards.
- **Winston Logger:** A versatile logging library for Node.js, utilized for logging events and errors in the server.
- **Nodemon/ts-node:** Hot Reload upon file changes of the server during development, enhancing the development workflow.

## Setup

**Dependencies**

1. **Install Node with Version Management**

   See https://docs.volta.sh/guide/getting-started

   ```bash
   volta install node@20.19.5
   volta pin node@20.19.5
   ```

2. **Podman & Docker Compose** Ensure that Podman is installed in your local development environment. Get Podman [here](https://podman.io/docs/installation) and Docker Compose

   <details closed>
   <summary><b>On Linux:</b></summary>

   ```bash
   sudo dnf install -y podman podman-docker
   sudo dnf -y install dnf-plugins-core
   sudo dnf-3 config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
   sudo dnf install -y docker-compose-plugin # docker compose V2
   docker compose -v
   systemctl --user start podman.socket
   systemctl --user enable --now podman.socket
   ```

   If your dotfiles repo doesn't already contain this in `.bashrc` then add these lines
   `export DOCKER_BUILDKIT=0                                # disable docker buildkit for rootless podman`
   `export DOCKER_HOST=unix:///run/user/$UID/docker.sock    # set docker host to rootless user for podman`

   </details>

   <details closed>
   <summary><b>On Windows:</b></summary>

   1) Install WSL
   ```
   wsl --install FedoraLinux-42
   wsl --set-default FedoraLinux-42
   wsl -u root
   passwd
   # Enter new Password
   ```

   2) Windows Terminal `winget install Microsoft.WindowsTerminal`
   3) Execute `podman-installer-windows-amd64.exe` See https://github.com/containers/podman/releases
   4) Setup Podman See https://github.com/containers/podman/blob/main/docs/tutorials/podman-for-windows.md
   ```Powershell
   podman -v
   podman machine init
   podman machine start
   ```
   5) Setup Docker Compose in WSL

   ```bash
   # setup plugins repository
   wsl
   sudo dnf -y install dnf-plugins-core
   sudo dnf-3 config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
   sudo dnf install -y docker-ce-cli docker-compose-plugin
   echo "export DOCKER_HOST=unix:///var/run/docker.sock" >> ~/.bashrc
   docker --version
   docker compose -v
   ```

   </details>

3. **Clone the Repository:**
   git clone https://github.com/your-username/fiscalismia-backend.git

**Installation**

1. **Navigate to the Project Folder:**

   ```bash
   cd fiscalismia-backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**

   Store the `.env` in the root folder of `fiscalismia-backend`. Ensure that you never upload this file to Git, as it contains sensitive information!
   `DB_CONNECTION_URL` is only required in production, as this points to the cloud hosted db.
   ```bash
   # App & Server
   JWT_SECRET=xxx
   DB_CONNECTION_URL=
   FRONTEND_PORT=3001
   BACKEND_PORT=3002
   FASTAPI_PORT=3003
   HOST_ADDRESS=127.0.0.1

   # Local Docker DB Setup
   POSTGRES_USER=fiscalismia_api
   POSTGRES_HOST=fiscalismia-postgres
   POSTGRES_DB=fiscalismia
   POSTGRES_PASSWORD=xxx
   POSTGRES_PORT=5432
   # Set only on Linux - your local user and group id. check via "id" command
   UID=1000
   GID=1000

   # PIPELINE INTEGRATIONS
   SNYK_TOKEN=xxx
   API_GW_SECRET_KEY=xxx
   ```

4. **Github Secrets:**

   Set up Github Secrets in your Repository Settings, for the pipeline to run successfully. These can and should be the same as in your `.env` file.
   ```bash
   JWT_SECRET
   POSTGRES_PASSWORD
   SNYK_TOKEN
   ```

## Running

1. **Option 1: Podman Compose**

   To run the entire stack in development mode

   ```bash
   cd ~/git/fiscalismia-backend
   docker compose down --volumes
   docker compose up --build

   # with cloud db in development mode
   CLOUD_DB=true docker compose up --build
   ```

2. **Option 2: Local Backend with Dev DB**

   ```bash
   cd ~/git/fiscalismia-backend
   docker compose down --volumes
   docker compose up --detach --build --no-deps fiscalismia-postgres fiscalismia-frontend
   npm run dev
   ```

3. **Option 3: Local Backend with Cloud DB**

   ```bash
   cd ~/git/fiscalismia-backend
   docker compose down --volumes
   docker compose up --detach --build --no-deps fiscalismia-frontend
   npm run neon-dev
   ```

4. **Option 4: Local Prod Backend with Cloud DB**

   Run only the backend locally pointing to cloud db defined in `.env` file key `DB_CONNECTION_URL`
   ```bash
   cd ~/git/fiscalismia-backend
   docker compose down --volumes
   docker compose up --detach --build --no-deps fiscalismia-frontend
   npm run build
   npm run prod
   ```

5. **Option 5: Individual Containers**

   **DEV Backend & DEV Frontend & local DB**
   ```bash
   docker compose down --volumes
   docker compose up --build --detach --no-deps fiscalismia-frontend fiscalismia-postgres
   podman build \
      --pull \
      --no-cache \
      -f "Dockerfile.dev" \
      -t fiscalismia-backend-dev:latest "."
   podman run \
      --name fiscalismia-backend-dev \
      --env-file .env \
      --rm \
      -it \
      -v $PWD/src:/fiscalismia-backend/src \
      -v $PWD/public:/fiscalismia-backend/public \
      --net fiscalismia-network \
      -p 3002:3002 \
      fiscalismia-backend-dev:latest
   ```

   **PROD Backend & DEV Frontend & local DB**
   NOTE: `ENVIRONMENT` for local testing must be development, otherwise cors of undefined will deny access.

   ```bash
   # NET_BIND_SERVICE allows non-priviledged service user in container to bind to ports below 1024
   # also requires to adjust sysctl config on linux host since kernels prevent this behavior
   # this command sets it ephemerally for the session and is lost after reboot.
   sudo sysctl net.ipv4.ip_unprivileged_port_start=80

   docker compose down --volumes
   docker compose up --build --detach --no-deps fiscalismia-frontend fiscalismia-postgres

   podman build \
      -f "Dockerfile" \
      --build-arg BACKEND_VERSION=0.9.0 \
      --build-arg ENVIRONMENT=docker-development \
      --build-arg CLOUD_DB=false \
      --build-arg NGINX_CONF=nginx.conf \
      --build-arg BACKEND_PORT=80 \
      -t fiscalismia-backend:latest \
      "."

   chmod -R a+w $PWD/public/img/uploads/
   podman run \
      --name fiscalismia-backend \
      --env-file .env \
      --rm \
      -it \
      -v $PWD/public:/fiscalismia-backend/public:z \
      --net fiscalismia-network \
      --sysctl net.ipv4.ip_unprivileged_port_start=0 \
      --cap-add=NET_BIND_SERVICE \
      -p 80:80 \
      fiscalismia-backend:latest
   ```

6. **Option 6: Deploy Demo Container on Hetzner Instance**

```bash
# INSECURE CONFIG WITH ROOT USER FOR ACCESSING SSL CERTS
cd ~/git/fiscalismia-backend/
export REMOTE_DIR="/usr/local/etc/fiscalismia-backend"
ssh demo "mkdir -p $REMOTE_DIR/public"
scp -r ./public demo:$REMOTE_DIR/public
scp .env demo:$REMOTE_DIR/.env
ssh demo << EOF
cd $REMOTE_DIR
podman stop fiscalismia-backend || true
podman run \
   --name fiscalismia-backend \
   --env-file .env \
   --rm \
   --pull=always \
   --net host \
   -v $REMOTE_DIR/public:/fiscalismia-backend/public:z \
   -v /etc/letsencrypt/live/demo.fiscalismia.com/fullchain.pem:/etc/nginx/certs/fullchain.pem:ro,z \
   -v /etc/letsencrypt/live/demo.fiscalismia.com/privkey.pem:/etc/nginx/certs/privkey.pem:ro,z \
   -u 0:0 \
   ghcr.io/fiscalismia/fiscalismia-backend-demo:latest
EOF
   ------

## Testing

**All tests generate report files in the `reports/` subdirectory.**

1. **REST API tests /w supertest:**

   We use supertest for testing the REST API which can be executed via running the test script from a second console while the dev database is up and running.

   ```bash
   # basic usage
   npm run test
   # usage with freshly spawned local db
   docker compose down --volumes && docker compose up fiscalismia-postgres --no-deps --detach --build && sleep 5 && npm test
   ```

2. **Static Code Analysis**

   Eslint is used to ensure a consistent codebase adhering to certain coding standards configured in `.eslintrc.js`.
   Typecheck runs the Typescript Compiler which is configured with high strictness in `tsconfig.json`.

   ```bash
   npm run typeCheck
   npm run eslintAnalysis
   ```

3. **Snyk Security Analysis**

   `SNYK_TOKEN` has to be set in `.env` file.
   Get one for free by creating a snyk account [here](https://app.snyk.io/login)

   Once per workspace
   ```bash
   # with snyk cli installed
   snyk auth SNYK_TOKEN
   # without snyk cli installed
   npx snyk auth SNYK_TOKEN
   ```

   Vulnerability scanning of both the codebase, especially relevant for issues such as SQL Injection and XSS(Cross Site Scripting).
   ```bash
   npm run snykCodeAnalysis
   npm run snykDependencyAnalysis
   ```

## Usage

Once the server is up and running, it will be ready to handle API requests from your frontend application or REST API Client at http://127.0.0.1:3002/api/fiscalismia

**Accessing the Database via CLI**

   ```bash
   podman exec -it fiscalismia-postgres sh
   psql -U $POSTGRES_USER -d $POSTGRES_DB -h $POSTGRES_HOST -p $POSTGRES_PORT
   # copy paste $POSTGRES_PASSWORD
   ```

**Accessing the Database via DB Client**

   You can run DBeaver or a database client of your choice and use the .env file connection strings

   `POSTGRES_USER | POSTGRES_HOST | POSTGRES_DB | POSTGRES_PASSWORD | POSTGRES_PORT`

**Accessing Protected Routes**

   A valid user is required.
   Default credentials are
   ```admin changeit```

   Alternatively use a POST request to http://127.0.0.1:3002/api/fiscalismia/um/credentials carrying a user object.

   ```json
   { "username": "yourUser", "email": "user@mailserver.domain", "password": "yourPassword" }
   ```

   User can also be created easily via the **frontend login mask**.

   All important routes are protected and require an Authorization header reading 'Bearer token' where token is a jwt-token received after posting valid user credentials to http://127.0.0.1:3002/api/fiscalismia/um/login

   result:
   `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsInVzZXJFbWFpbCI6ImhlcnBfZGVycEBnbWFpbC5pbyJ9LCJpYXQiOjE3MDczMDk4MTgsImV4cCI6MTcwNzM5NjIxOH0.RkxSnXZZAwHIi-QPR57KtLiVdeRn3FybfPtCosM4rqY`

   ```bash
   GET http://127.0.0.1:3002/api/fiscalismia/ HTTP/1.1
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsInVzZXJFbWFpbCI6ImhlcnBfZGVycEBnbWFpbC5pbyJ9LCJpYXQiOjE3MDczMDk4MTgsImV4cCI6MTcwNzM5NjIxOH0.RkxSnXZZAwHIi-QPR57KtLiVdeRn3FybfPtCosM4rqY
   ```

## Production

1. **Set up Cloud DB**

   I recommend using scale-to-zero cloud-native postgresql with a generous free tier at [neon.tech](https://console.neon.tech/)

2. **Build docker image**

   *Hint: %cd% backslash file path command is unique to windows, in unix based systems, replace it with $PWD forward slash*
   ```
   podman build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-backend:latest "."
   podman run -v %cd%\public:/fiscalismia-backend/public --env-file .env --rm -it -p 3002:3002 --name fiscalismia-backend fiscalismia-backend:latest
   ```

3. **Provisioning of AWS S3 Bucket for Image Upload**

   Todo

4. **Automatic Docker Build and Push to private AWS ECR in Github Actions Pipeline**

   Todo

5. **Deployment to public AWS EC2 Instance via Github Actions Pipeline**

   Todo

6. **Configure and Initialize Database**

   Todo

## License

This project is licensed under the [MIT License](LICENSE).
