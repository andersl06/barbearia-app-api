// src/core/logger.js

export const logInfo = (...msg) => console.log("[INFO]", ...msg);

export const logError = (...msg) => console.error("[ERROR]", ...msg);

export const logWarn = (...msg) => console.warn("[WARN]", ...msg);
