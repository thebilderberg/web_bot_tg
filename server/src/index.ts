import cors from "cors";
import express from "express";
import session from "express-session";
import pgSessionFactory from "connect-pg-simple";

import { env } from "./env";
import { pool, dbHealthcheck } from "./db";
import { login, logout, me, register } from "./auth";
import { seedUsersIfEnabled } from "./seed";

async function main() {
  // Ensure DB reachable early (give a clear error for local dev)
  try {
    await dbHealthcheck();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Database connection failed. Check DATABASE_URL and that Postgres is running.");
    throw e;
  }

  // Seed users only when explicitly enabled
  await seedUsersIfEnabled();

  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(express.json());

  app.use(
    cors({
      origin: env.frontendOrigin,
      credentials: true
    })
  );

  const PgSession = pgSessionFactory(session);
  app.use(
    session({
      name: "sid",
      store: new PgSession({
        pool,
        createTableIfMissing: true
      }),
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env.nodeEnv === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000
      }
    })
  );

  app.get("/health", async (_req, res) => {
    const ok = await dbHealthcheck();
    res.json({ ok });
  });

  app.post("/auth/register", register);
  app.post("/auth/login", login);
  app.post("/auth/logout", logout);
  app.get("/me", me);

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

