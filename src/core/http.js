// src/core/http.js

export const ok = (res, data) => res.status(200).json(data);

export const created = (res, data) => res.status(201).json(data);

export const badRequest = (res, message) =>
  res.status(400).json({ message });

export const unauthorized = (res, message = "Unauthorized") =>
  res.status(401).json({ message });

export const forbidden = (res, message = "Forbidden") =>
  res.status(403).json({ message });

export const notFound = (res, message = "Not found") =>
  res.status(404).json({ message });

export const serverError = (res, error) =>
  res.status(500).json({ message: error.message });
