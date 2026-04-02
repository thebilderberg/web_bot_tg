# Memory Bank — Telegram Web UI (React + TS + AntD)

## Goals
- Fix burger-menu UX: **closed = only button in DOM**, open = slide-out menu that fully unmounts when closed.
- Implement full auth: register/login/logout/me with **cookie-based httpOnly sessions**, SQL DB, bcrypt password hashing, dev seed accounts.

## Architecture decisions

### Backend
- **Runtime**: Node.js + Express
- **Location**: `web_bot_tg/server/` (separate package, started from root via npm scripts)
- **DB driver**: `pg` (node-postgres) with `Pool`
- **Password hashing**: `bcrypt` (store only `password_hash`)
- **Sessions**: `express-session` + cookie (`httpOnly`, `sameSite=Lax` in dev)
  - Session store: Postgres via `connect-pg-simple` (keeps sessions in SQL)
- **CORS**: allow frontend origin + `credentials: true`
- **Cookie lifetime**: 7 days (`maxAge`), `rolling=true` to refresh on activity

### Database
- **DB**: Postgres (Docker Compose)
- **Schema**: `users(id, login unique, password_hash, created_at)`
- **Seed**: `user1..user50` with a shared password (default `Test12345!`)
  - Enabled only when `SEED_USERS=true`
  - Uses **parameterized SQL** and `ON CONFLICT DO NOTHING`

### API Endpoints
- `POST /auth/register` body `{ login, password }` → creates user, sets session, returns `{ id, login }`
- `POST /auth/login` body `{ login, password }` → sets session, returns `{ id, login }`
- `POST /auth/logout` → destroys session, clears cookie
- `GET /me` → `{ id, login }` or `401`

### Frontend
- **Auth UI**: AntD `Modal` + `Tabs` (Login/Register) + `Form` + `Input.Password`
- **Auth state**: `AuthProvider` with `me()` on app start, `fetch(..., { credentials: 'include' })`
- **Top bar**:
  - Left: burger button
  - Right: auth block
    - logged out: “Вход / Регистрация”
    - logged in: “Вы вошли как {login}” + “Выйти”

## Dev/Prod notes
- In dev: cookies `sameSite=Lax`, `secure=false`
- In prod: cookies `secure=true` (HTTPS), origin restricted

## Run commands (target)
- `docker compose up -d` (Postgres)
- `npm --prefix server install && npm --prefix server run dev`
- `npm start` (frontend)

## Repo hygiene (important)
- `node_modules/` is ignored and should not be committed.
- If repository history previously included `node_modules`, remove from git tracking and rely on `npm install`.

