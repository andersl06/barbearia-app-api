// src/modules/audit/service.js
import * as repo from "./repo.js";

export const log = async ({ user_id, action, payload }) => {
  const entry = {
    user_id,
    action,
    payload,
    created_at: new Date()
  };

  const { error } = await repo.insert(entry);
  if (error) {
    // nunca travar o fluxo por auditoria
    console.error("Erro audit_log:", error);
  }
};
