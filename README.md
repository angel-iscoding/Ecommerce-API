# Ecommerce API (NestJS)

This repository contains an ecommerce backend built with NestJS. It uses PostgreSQL for persistent storage, Redis for caching/session/cart storage, Cloudinary for media, and TypeORM as the ORM.

This README documents the project's features, how to run it with Docker, environment variables, DB initialization, and common troubleshooting steps.

## Tech stack

- Node.js (NestJS)
- TypeScript
- TypeORM
- PostgreSQL
- Redis
- Cloudinary (file uploads)
- Jest (tests)

## Project features (high level)

- Inventory management (products, stock)
- Persistent shopping cart (backed by Redis)
- Authentication & Authorization (JWT + roles)
- Orders and order details
- Payments integration (PayPal)
- File uploads to Cloudinary
- Seeders / preloaders for categories and products

Each feature is organized in modules inside `src/` (for example `store-management`, `user-management`, `auth`, etc.).

## Docker (recommended)

The repository includes `docker-compose.yml` and a `Dockerfile` to run the whole stack (Postgres, Redis, API).

Quick start (development):

```bash
# Build images and start containers
docker compose up --build

# Tail logs
docker compose logs -f
```

Notes:
- The app exposes port `3000` inside the container and `docker-compose.yml` maps host `3000` to container `3000` by default.
- If this is the first time running, the Postgres container will create the database and user only if the data directory is empty. See "Database initialization" below for an idempotent setup.

## Environment variables

`docker-compose.yml` in this repository uses a small indirection: Docker-specific variables with the `DOCKER_` prefix are used to configure services, and the `app` service picks up translated variables for runtime. The compose file expects an `.env` with the following variables (examples):

Docker / Compose variables (put these in `.env`):

- DOCKER_POSTGRES_USER — Postgres initialization user (example: `ecommerce_user`)
- DOCKER_POSTGRES_PASSWORD — Postgres initialization password
- DOCKER_POSTGRES_DB — Postgres database name
- DOCKER_DB_HOST — host value injected into the app (typically `db`)
- DOCKER_DB_PORT — DB port (typically `5432`)
- DOCKER_REDIS_HOST — Redis host value injected into the app (typically `redis`)

The `db` service maps these Compose variables into Postgres environment variables:
- `POSTGRES_USER: ${DOCKER_POSTGRES_USER}`
- `POSTGRES_PASSWORD: ${DOCKER_POSTGRES_PASSWORD}`
- `POSTGRES_DB: ${DOCKER_POSTGRES_DB}`

The `app` service receives runtime variables from the same `.env` file (via `env_file`) and the compose file maps Docker variables into the app runtime variables. The app expects the following runtime variables (examples):

- DB_HOST — hostname used by TypeORM (set by compose to `${DOCKER_DB_HOST}`)
- DB_PORT — database port (set by compose to `${DOCKER_DB_PORT}`)
- POSTGRES_DB — database name (set by compose to `${DOCKER_POSTGRES_DB}`)
- POSTGRES_PASSWORD — DB password (set by compose to `${DOCKER_POSTGRES_PASSWORD}`)
- REDIS_HOST — Redis host (set by compose to `${DOCKER_REDIS_HOST}`)
- NODE_ENV — `development` or `production`
- APP_PORT — application port (3000)
- JWT_SECRET — secret used for signing JWT tokens (use a long random secret)

Example `.env` (update the values before running in production):

```ini
# Docker / compose variables (used to configure the db & redis services)
DOCKER_POSTGRES_USER=ecommerce_user
DOCKER_POSTGRES_PASSWORD=your_secure_password_here_change_this
DOCKER_POSTGRES_DB=ecommerce_db
DOCKER_DB_HOST=db
DOCKER_DB_PORT=5432
DOCKER_REDIS_HOST=redis

# Application runtime variables (the compose maps DOCKER_* -> app variables)
NODE_ENV=production
APP_PORT=3000
JWT_SECRET=replace_this_with_a_real_secret_min_32_chars

# If you need Redis auth
REDIS_PASSWORD=your_redis_password_here_change_this
```

Security: never commit real secrets; use Docker secrets, environment injection on CI, or a vault in production.

## Database initialization (idempotent)

This repository ships with a `src/config/typeorm.ts` that reads DB credentials from environment variables. To make DB initialization automatic and idempotent when using Docker Compose, there are two approaches:

1. Use Postgres' `/docker-entrypoint-initdb.d` mechanism:
   - Create a directory `docker/init/` in the repo and place an SQL file such as `init.sql` with statements guarded by `DO $$ BEGIN ... EXCEPTION WHEN OTHERS THEN END $$;` or use `CREATE ROLE IF NOT EXISTS` / `CREATE DATABASE IF NOT EXISTS` patterns.
   - Mount the folder into the `db` service in `docker-compose.yml` as `/docker-entrypoint-initdb.d`. Postgres will execute those scripts only when the data directory is empty (first-run).

2. Use a short `db-init` helper service that waits for Postgres and runs idempotent SQL (helps when you keep the data volume):
   - Create a script like `docker/init/db-init.sh` which connects as `postgres` and runs `CREATE ROLE IF NOT EXISTS ...`, `ALTER DATABASE ... OWNER TO ...` and `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.
   - Have the `app` service depend on this `db-init` service or run the script as an init container.

Important: If a Postgres volume already exists, `/docker-entrypoint-initdb.d` scripts will NOT run. In that case either:
- Run the idempotent SQL script manually once (connect to the DB and run it), or
- Remove the volume to reinitialize the DB (data will be lost):

```bash
docker compose down
docker volume rm ecommerce-api_postgres-data
docker compose up --build
```

I included an example script and/or suggested steps in the project's root to help automate this (see `docker/init/` if added).

## Common troubleshooting

- "password authentication failed / role does not exist":
  - Reason: the DB user in `.env` wasn't created because Postgres already had an initialized data directory.
  - Fix: create the role manually in the Postgres container or use an idempotent init script (see above).

- `function uuid_generate_v4() does not exist`:
  - Fix: create the `uuid-ossp` extension in the target database:
    ```bash
    docker compose exec db psql -U postgres -d <your_db> -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
    ```

- ESLint warnings about TypeScript version: the project uses TypeScript 5.9.x which may not be supported by the installed `@typescript-eslint` parser. If you see parser warnings, consider pinning a supported TS version, updating `@typescript-eslint` to a newer compatible version, or ignore the warning.

## Development

Run locally without Docker (requires Node and Postgres locally):

```bash
npm install
cp .env.example .env   # edit .env
npm run start:dev
```

Notes on path aliases: the project uses `@` as a TypeScript path alias mapping to `src/`. This is configured in `tsconfig.json` and the Jest mapping is set in `package.json` so imports like `@/store-management/products/product.service` work.

## Seeds and preloaders

The project contains preloaders for categories and products (`src/utils/helpers/preload*`). These may throw errors if run multiple times against the same DB because they might not be fully idempotent. Consider modifying seeders to upsert or to skip existing entries.

## Next improvements (suggested)

- Add `docker/init/init.sql` or `docker/init/db-init.sh` with idempotent SQL to ensure DB users, DB and extensions exist on first-run without manual steps.
- Add `package-lock.json` to enable `npm ci` inside Docker and increase build reproducibility.
- Make seeders idempotent (use upsert or pre-checks).
- Add docker secrets or environment config for production.
