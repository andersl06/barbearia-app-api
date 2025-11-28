// src/core/security.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/index.js";

export const hashPassword = (password) => {
  return bcrypt.hash(password, env.HASH_ROUNDS);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const signToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};
