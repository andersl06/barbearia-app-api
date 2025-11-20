// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

// verifica se o usuário está logado
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  try {
    // decodifica e valida o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // guarda os dados do usuário na requisição (id, role, iat, exp)
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

// checa se o usuário tem um dos papéis permitidos
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Sem permissão" });
    }

    return next();
  };
};
