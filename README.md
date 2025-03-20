# Crypto Watcher

## START GUIDE

This backend can work with `docker compose` as well as self hosted database by using `Start-Service -Name 'postgresql-x64-17'`.

- To run local db open `powershell` as admin and run below:
  ```bash
  Start-Service -Name 'postgresql-x64-17
  ```

### Create ENV Files

`.env` -> used to connect to self hosted postgreSQL database

```env
PORT_BACKEND=3001
DB_TYPE=postgres
PG_HOST=localhost
PG_PORT=
PG_USER=
PG_PASSWORD=
PG_DB=
```

`.env.local` -> used to pick correct port based on production or local environment

```env
PORT_BACKEND=3001
```

## Start Backend

### Using Localhost:

```bash
yarn start:dev
```

### Using Docker (this will host db also):

```bash
docker compose up -d db
docker compose build
docker compose up
```
