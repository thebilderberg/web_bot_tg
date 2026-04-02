import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL"),
  sessionSecret: required("SESSION_SECRET"),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  seedUsers: (process.env.SEED_USERS ?? "").toLowerCase() === "true",
  seedPassword: process.env.SEED_PASSWORD ?? "Test12345!"
};

