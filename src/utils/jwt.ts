import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface TokenPayload {
  id: string;
  email?: string
}

export function signToken(payload: TokenPayload) {
  //
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}