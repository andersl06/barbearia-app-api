// src/shared/roleMiddleware.js

export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // req.user deve ser injetado pelo authMiddleware
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const userRole = req.user.role;

      // Se ninguém pode acessar, bloqueia
      if (!allowedRoles.length) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      // Verifica se a role do user é permitida
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Permissão insuficiente" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: "Erro ao validar permissões" });
    }
  };
};
