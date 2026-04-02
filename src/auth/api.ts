import type { ApiError, User } from "./types";

type ApiErrorResponse = { error: ApiError | string };

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export class HttpError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    },
    credentials: "include"
  });

  if (!res.ok) {
    let code: string | undefined;
    try {
      const body = await readJson<ApiErrorResponse>(res);
      if (body && typeof body === "object" && "error" in body) {
        code = String((body as any).error);
      }
    } catch {
      // ignore
    }
    throw new HttpError(res.status, `HTTP ${res.status}`, code);
  }

  return readJson<T>(res);
}

export const api = {
  me: () => request<User>("/me"),
  register: (login: string, password: string) =>
    request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ login, password })
    }),
  login: (login: string, password: string) =>
    request<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password })
    }),
  logout: () =>
    request<{ ok: true }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({})
    })
};

