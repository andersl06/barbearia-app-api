import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// TOKEN NORMAL (login completo)
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN || "1d",
    }
  );
}

// TOKEN TEMPORÁRIO (para must_change_password)
export function generateTempToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      type: "password_change",
    },
    env.JWT_SECRET,
    { expiresIn: "15m" } // curto de propósito
  );
}
