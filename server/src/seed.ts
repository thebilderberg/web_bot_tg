import bcrypt from "bcrypt";
import { pool } from "./db";
import { env } from "./env";

const SALT_ROUNDS = 12;

export async function seedUsersIfEnabled() {
  if (!env.seedUsers) return;

  const passwordHash = await bcrypt.hash(env.seedPassword, SALT_ROUNDS);

  // Insert user1..user50; ignore if already exists
  const values: any[] = [];
  const placeholders: string[] = [];
  for (let i = 1; i <= 50; i++) {
    values.push(`user${i}`, passwordHash);
    const a = (i - 1) * 2 + 1;
    placeholders.push(`($${a}, $${a + 1})`);
  }

  await pool.query(
    `insert into users (login, password_hash)
     values ${placeholders.join(",")}
     on conflict (login) do nothing`,
    values
  );
}

