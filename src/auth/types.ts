export type User = {
  id: string;
  login: string;
};

export type ApiError =
  | "INVALID_INPUT"
  | "LOGIN_TAKEN"
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "SERVER_ERROR";

