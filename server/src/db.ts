import { Pool } from "pg";
import { env } from "./env";

export const pool = new Pool({
  connectionString: env.databaseUrl
});

export async function dbHealthcheck() {
  const res = await pool.query("select 1 as ok");
  return res.rows[0]?.ok === 1;
}

