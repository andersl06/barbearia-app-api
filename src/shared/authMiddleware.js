import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ message: "Token não enviado." });

  const token = auth.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
}
