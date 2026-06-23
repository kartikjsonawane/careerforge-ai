import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme-use-env";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "changeme-refresh";

export function signAccessToken(userId: string): string {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: "30d" });
}

export function verifyAccessToken(token: string): { id: string } {
  return jwt.verify(token, JWT_SECRET) as { id: string };
}

export function verifyRefreshToken(token: string): { id: string } {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
}
