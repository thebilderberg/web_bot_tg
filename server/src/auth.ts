import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import { pool } from "./db";
import type { PublicUser } from "./types";

const SALT_ROUNDS = 12;

function normalizeLogin(login: unknown) {
  if (typeof login !== "string") return null;
  const trimmed = login.trim();
  if (trimmed.length < 3 || trimmed.length > 32) return null;
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return null;
  return trimmed;
}

function validatePassword(password: unknown) {
  if (typeof password !== "string") return null;
  if (password.length < 8 || password.length > 128) return null;
  return password;
}

function toPublicUser(row: { id: string; login: string }): PublicUser {
  return { id: row.id, login: row.login };
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: "UNAUTHORIZED" });
  next();
};

export const register: RequestHandler = async (req, res) => {
  const login = normalizeLogin(req.body?.login);
  const password = validatePassword(req.body?.password);
  if (!login || !password) {
    return res.status(400).json({ error: "INVALID_INPUT" });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const result = await pool.query(
      "insert into users (login, password_hash) values ($1, $2) returning id, login",
      [login, passwordHash]
    );
    const user = toPublicUser(result.rows[0]);
    req.session.user = user;
    return res.json(user);
  } catch (e: any) {
    if (e?.code === "23505") {
      return res.status(409).json({ error: "LOGIN_TAKEN" });
    }
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

export const login: RequestHandler = async (req, res) => {
  const login = normalizeLogin(req.body?.login);
  const password = validatePassword(req.body?.password);
  if (!login || !password) {
    return res.status(400).json({ error: "INVALID_INPUT" });
  }

  const result = await pool.query(
    "select id, login, password_hash from users where login = $1 limit 1",
    [login]
  );
  const row = result.rows[0] as
    | { id: string; login: string; password_hash: string }
    | undefined;
  if (!row) return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  const user = toPublicUser(row);
  req.session.user = user;
  return res.json(user);
};

export const logout: RequestHandler = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "SERVER_ERROR" });
    res.clearCookie("sid");
    return res.json({ ok: true });
  });
};

export const me: RequestHandler = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "UNAUTHORIZED" });
  return res.json(req.session.user);
};

