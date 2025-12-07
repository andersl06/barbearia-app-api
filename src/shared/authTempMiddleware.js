// src/shared/authTempMiddleware.js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authTempMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Token ausente" });

    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (decoded.type !== "password_change") {
      return res.status(403).json({ error: "Token inválido" });
    }

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
