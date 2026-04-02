## How to run (dev)

### 1) Database (Postgres)
Рекомендуется (Docker):

```bash
cd web_bot_tg
docker compose up -d
```

Если Docker недоступен, установите PostgreSQL локально и задайте `DATABASE_URL` для бэкенда.

#### Windows (без Docker): локальный PostgreSQL

1) Установите PostgreSQL (рекомендуется версия 16+) и убедитесь, что `psql.exe` доступен (либо добавьте `...\PostgreSQL\16\bin` в `PATH`, либо передайте `-PostgresBin` скрипту ниже).

2) Инициализируйте БД/пользователей/схему, выполнив:

```powershell
cd web_bot_tg
.\scripts\init-db.ps1
```

Если требуется пароль суперпользователя `postgres`, PowerShell запросит его через аутентификацию `psql` (в зависимости от настроек вашей локальной системы).

### 2) Backend API

# Создать .env для backend'а
cd server
cp .env.example .env

# Отредактировать .env (можно через nano или другой редактор)
nano .env

Убедитесь, что в server/.env есть:
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/web_bot_tg"
SESSION_SECRET="ваш_секретный_ключ_тут"
FRONTEND_ORIGIN="http://localhost:3000"
SEED_USERS="true"
SEED_PASSWORD="Test12345!"

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

## Примечания (Windows)
- Если у вас уже были добавлены зависимости `node_modules` в Git, этот репозиторий теперь игнорирует их и удаляет из отслеживания Git (рекомендуемая практика). После получения этих изменений выполните команду `npm install`, чтобы восстановить зависимости локально.

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

