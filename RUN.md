## How to run (dev)

### 1) Database (Postgres)
Recommended (Docker):

```bash
cd web_bot_tg
docker compose up -d
```

If Docker is not available, install Postgres locally and set `DATABASE_URL` for the backend.

#### Windows (no Docker): local Postgres

1) Install PostgreSQL (recommended v16+) and make sure `psql.exe` is available (either add `...\PostgreSQL\16\bin` to `PATH`, or pass `-PostgresBin` to the script below).
2) Initialize DB/user/schema by running:

```powershell
cd web_bot_tg
.\scripts\init-db.ps1
```

If your `postgres` superuser password is required, PowerShell will prompt via `psql` authentication (depending on your local setup).

### 2) Backend API

Create `web_bot_tg/server/.env` based on `web_bot_tg/server/.env.example`.

```bash
cd web_bot_tg
npm run server:install
npm run server:dev
```

API default: `http://localhost:4000`

Quick API check (PowerShell):

```powershell
.\scripts\test-auth.ps1
```

### 3) Frontend

```bash
cd web_bot_tg
npm install
npm start
```

Frontend default: `http://localhost:3000` (or next free port)

## Notes (Windows)
- If you already had `node_modules` committed in git, this repo now ignores them and removes them from git tracking (best practice). After pulling these changes, run `npm install` to restore dependencies locally.

## ENV variables

### Root (`web_bot_tg/.env`) — for Docker Compose only
- **POSTGRES_USER**
- **POSTGRES_PASSWORD**
- **POSTGRES_DB**
- **POSTGRES_PORT**

### Backend (`web_bot_tg/server/.env`)
- **PORT**: API port (default `4000`)
- **DATABASE_URL**: Postgres connection string
- **SESSION_SECRET**: secret for cookie sessions
- **FRONTEND_ORIGIN**: allowed origin for CORS (default `http://localhost:3000`)
- **SEED_USERS**: `true/false` — create `user1..user50` on server start
- **SEED_PASSWORD**: shared password for seed accounts (default `Test12345!`)

## Test accounts (dev seed)
- **login**: `user1` … `user50`
- **password**: `Test12345!` (or `SEED_PASSWORD`)

## Manual test plan (UI)
- Open app, verify top bar:
  - left: burger button
  - right: auth block
- Click burger:
  - closed: menu not present in DOM
  - open: compact menu panel (not fullscreen), closes on item click/outside click
  - menu items: “Главная”, “Аккаунт”
- Auth:
  - Click “Вход / Регистрация”
  - Login as `user7` / `Test12345!` → top-right shows current user
  - Click “Выйти” → becomes anonymous
  - Register a new user → auto-login, then logout/login as another

## cURL test plan

> Note: cookie session is stored in `cookies.txt`.

Register:

```bash
curl -i -c cookies.txt -H "Content-Type: application/json" ^
  -d "{\"login\":\"newuser1\",\"password\":\"Test12345!\"}" ^
  http://localhost:4000/auth/register
```

Login:

```bash
curl -i -c cookies.txt -H "Content-Type: application/json" ^
  -d "{\"login\":\"user7\",\"password\":\"Test12345!\"}" ^
  http://localhost:4000/auth/login
```

Me:

```bash
curl -i -b cookies.txt http://localhost:4000/me
```

Logout:

```bash
curl -i -b cookies.txt -X POST -H "Content-Type: application/json" ^
  -d "{}" ^
  http://localhost:4000/auth/logout
```

