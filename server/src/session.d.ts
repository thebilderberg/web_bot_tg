import "express-session";
import type { SessionUser } from "./types";

declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
  }
}

